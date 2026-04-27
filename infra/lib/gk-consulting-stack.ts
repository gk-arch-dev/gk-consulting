import * as path from 'path'
import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import * as apigwv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as ses from 'aws-cdk-lib/aws-ses'
import * as wafv2 from 'aws-cdk-lib/aws-wafv2'
import { Construct } from 'constructs'
import { Config } from './config'

interface GkConsultingStackProps extends cdk.StackProps {
  config: Config
  certificate: acm.ICertificate
}

export class GkConsultingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GkConsultingStackProps) {
    super(scope, id, props)

    const { config } = props

    const hostedZone = route53.PublicHostedZone.fromPublicHostedZoneAttributes(this, 'Zone', {
      hostedZoneId: config.hostedZoneId,
      zoneName: config.domainName,
    })

    // ── S3 site bucket ────────────────────────────────────────────
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    // ── CloudFront: URI rewrite function ──────────────────────────
    // Next.js static export produces /path/index.html. CloudFront must
    // rewrite /path/ and /path to /path/index.html for routes to resolve.
    const uriRewrite = new cloudfront.Function(this, 'UriRewrite', {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.split('/').pop().includes('.')) {
    request.uri = uri + '/index.html';
  }
  return request;
}
`),
    })

    // ── CloudFront: cache policies ────────────────────────────────
    const htmlCachePolicy = new cloudfront.CachePolicy(this, 'HtmlCachePolicy', {
      minTtl: cdk.Duration.seconds(0),
      defaultTtl: cdk.Duration.minutes(5),
      maxTtl: cdk.Duration.minutes(5),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    })

    const staticCachePolicy = new cloudfront.CachePolicy(this, 'StaticCachePolicy', {
      minTtl: cdk.Duration.days(1),
      defaultTtl: cdk.Duration.days(365),
      maxTtl: cdk.Duration.days(365),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    })

    // ── CloudFront distribution ───────────────────────────────────
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket)

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
        cachePolicy: htmlCachePolicy,
        functionAssociations: [{
          function: uriRewrite,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      additionalBehaviors: {
        '/_next/static/*': {
          origin: s3Origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          compress: true,
          cachePolicy: staticCachePolicy,
        },
      },
      domainNames: [config.domainName, `www.${config.domainName}`],
      certificate: props.certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      defaultRootObject: 'index.html',
      errorResponses: [
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html' },
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html' },
      ],
    })

    // ── Route 53: CloudFront aliases ──────────────────────────────
    const cfAlias = route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(distribution)
    )
    new route53.ARecord(this, 'ApexA', { zone: hostedZone, target: cfAlias })
    new route53.AaaaRecord(this, 'ApexAaaa', { zone: hostedZone, target: cfAlias })
    new route53.ARecord(this, 'WwwA', { zone: hostedZone, recordName: 'www', target: cfAlias })
    new route53.AaaaRecord(this, 'WwwAaaa', { zone: hostedZone, recordName: 'www', target: cfAlias })

    // ── ACM cert for API Gateway (regional, eu-central-1) ─────────
    const apiCert = new acm.Certificate(this, 'ApiCert', {
      domainName: `${config.apiSubdomain}.${config.domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    })

    // ── Lambda execution role ─────────────────────────────────────
    const lambdaRole = new iam.Role(this, 'ContactLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    })

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: [
        `arn:${this.partition}:ses:${this.region}:${this.account}:identity/${config.domainName}`,
      ],
    }))

    // ── Contact form Lambda ───────────────────────────────────────
    const contactLogGroup = new logs.LogGroup(this, 'ContactLambdaLogs', {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    const contactLambda = new lambda.Function(this, 'ContactLambda', {
      runtime: lambda.Runtime.PYTHON_3_13,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend'), {
        exclude: [
          'test_*.py',
          '__pycache__',
          '.pytest_cache',
          'dev_server.py',
          'requirements-dev.txt',
          '.env*',
          '*.example',
        ],
      }),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      role: lambdaRole,
      logGroup: contactLogGroup,
      environment: {
        SES_FROM: config.sesFromAddress,
        SES_TO: config.sesToAddress,
        SITE_ORIGIN: `https://${config.domainName}`,
      },
    })

    // ── API Gateway HTTP API ──────────────────────────────────────
    const apiDomainName = new apigwv2.DomainName(this, 'ApiDomain', {
      domainName: `${config.apiSubdomain}.${config.domainName}`,
      certificate: apiCert,
    })

    const httpApi = new apigwv2.HttpApi(this, 'ContactApi', {
      defaultDomainMapping: { domainName: apiDomainName },
    })

    const lambdaIntegration = new apigwv2Integrations.HttpLambdaIntegration(
      'ContactIntegration',
      contactLambda
    )

    httpApi.addRoutes({
      path: '/contact',
      methods: [apigwv2.HttpMethod.POST, apigwv2.HttpMethod.OPTIONS],
      integration: lambdaIntegration,
    })

    // ── Route 53: API alias ───────────────────────────────────────
    new route53.ARecord(this, 'ApiAlias', {
      zone: hostedZone,
      recordName: config.apiSubdomain,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.ApiGatewayv2DomainProperties(
          apiDomainName.regionalDomainName,
          apiDomainName.regionalHostedZoneId
        )
      ),
    })

    // ── SES domain identity with automatic DKIM records ───────────
    new ses.EmailIdentity(this, 'SesIdentity', {
      identity: ses.Identity.publicHostedZone(hostedZone),
    })

    // ── WAF WebACL (REGIONAL, associated with API Gateway) ────────
    const wafRules: wafv2.CfnWebACL.RuleProperty[] = [
      {
        name: 'AWSManagedRulesAmazonIpReputationList',
        priority: 1,
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesAmazonIpReputationList',
          },
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: 'IpReputationList',
          sampledRequestsEnabled: true,
        },
      },
      {
        name: 'AWSManagedRulesKnownBadInputsRuleSet',
        priority: 2,
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesKnownBadInputsRuleSet',
          },
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: 'KnownBadInputs',
          sampledRequestsEnabled: true,
        },
      },
      {
        // Initially in COUNT mode; switch overrideAction to { none: {} } after
        // reviewing one week of sampled requests in the WAF console.
        name: 'AWSManagedRulesCommonRuleSet',
        priority: 3,
        overrideAction: { count: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesCommonRuleSet',
          },
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: 'CommonRuleSet',
          sampledRequestsEnabled: true,
        },
      },
      {
        name: 'RateLimit',
        priority: 4,
        action: { block: {} },
        statement: {
          rateBasedStatement: {
            limit: 100,
            aggregateKeyType: 'IP',
          },
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: 'RateLimit',
          sampledRequestsEnabled: true,
        },
      },
      {
        // Block all countries not in the allow list.
        // The geo list is intentionally permissive; tighten after launch.
        name: 'GeoAllow',
        priority: 5,
        action: { block: {} },
        statement: {
          notStatement: {
            statement: {
              geoMatchStatement: {
                countryCodes: config.allowedCountries,
              },
            },
          },
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: 'GeoAllow',
          sampledRequestsEnabled: true,
        },
      },
    ]

    const webAcl = new wafv2.CfnWebACL(this, 'WebAcl', {
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'GkConsultingWebAcl',
        sampledRequestsEnabled: true,
      },
      rules: wafRules,
    })

    // API Gateway HTTP API stage ARN for WAF association.
    // HTTP API stage ARN format: arn:aws:apigateway:{region}::/apis/{apiId}/stages/{stageName}
    const stageArn = `arn:${this.partition}:apigateway:${this.region}::/apis/${httpApi.apiId}/stages/${httpApi.defaultStage!.stageName}`

    const wafAssociation = new wafv2.CfnWebACLAssociation(this, 'WebAclAssociation', {
      resourceArn: stageArn,
      webAclArn: webAcl.attrArn,
    })
    wafAssociation.addDependency(webAcl)

    // ── Stack outputs (used by GitHub Actions in CI/CD) ───────────
    new cdk.CfnOutput(this, 'SiteBucketName', {
      value: siteBucket.bucketName,
      description: 'S3 bucket for the static site',
    })
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID for cache invalidation',
    })
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: `https://${config.apiSubdomain}.${config.domainName}`,
      description: 'Contact API base URL',
    })
    new cdk.CfnOutput(this, 'WebAclArn', {
      value: webAcl.attrArn,
      description: 'WAF WebACL ARN',
    })

  }
}
