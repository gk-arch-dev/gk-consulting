import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { Config } from './config'

interface CiCdStackProps extends cdk.StackProps {
  config: Config
}

export class CiCdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CiCdStackProps) {
    super(scope, id, props)

    const { config } = props

    // GitHub OIDC is an account singleton. If one already exists, import it via
    // the oidcProviderArn context key instead of creating a duplicate.
    const existingArn = this.node.tryGetContext('oidcProviderArn') as string | undefined

    const provider = existingArn
      ? iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(this, 'GithubOidc', existingArn)
      : new iam.OpenIdConnectProvider(this, 'GithubOidc', {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
          thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
        })

    const deployRole = new iam.Role(this, 'GitHubActionsDeployRole', {
      roleName: 'GitHubActionsDeployRole',
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringLike: {
          'token.actions.githubusercontent.com:sub': [
            `repo:${config.githubOrg}/${config.githubRepo}:ref:refs/heads/main`,
            `repo:${config.githubOrg}/${config.githubRepo}:pull_request`,
          ],
        },
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
      }),
      description: 'Role assumed by GitHub Actions for deployments',
    })

    deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'CloudFormation',
      actions: ['cloudformation:*'],
      resources: [
        `arn:${this.partition}:cloudformation:*:${this.account}:stack/GkConsulting*/*`,
        `arn:${this.partition}:cloudformation:*:${this.account}:stack/GkConsultingCert*/*`,
        `arn:${this.partition}:cloudformation:*:${this.account}:stack/GkConsultingCiCd*/*`,
      ],
    }))

    deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'S3Site',
      actions: ['s3:PutObject', 's3:DeleteObject', 's3:ListBucket', 's3:GetObject'],
      resources: [
        `arn:${this.partition}:s3:::*gkconsulting*`,
        `arn:${this.partition}:s3:::*gkconsulting*/*`,
        `arn:${this.partition}:s3:::cdk-*`,
        `arn:${this.partition}:s3:::cdk-*/*`,
      ],
    }))

    deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'CloudFrontInvalidation',
      actions: ['cloudfront:CreateInvalidation', 'cloudfront:GetInvalidation'],
      resources: ['*'],
    }))

    deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'IAMPassRole',
      actions: ['iam:PassRole'],
      resources: [`arn:${this.partition}:iam::${this.account}:role/cdk-*`],
    }))

    deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'CdkBootstrap',
      actions: [
        'sts:AssumeRole',
        'sts:GetCallerIdentity',
        'ssm:GetParameter',
        'ssm:PutParameter',
        'ssm:DeleteParameter',
        'ecr:GetAuthorizationToken',
        'cloudformation:DescribeStacks',
        'cloudformation:GetTemplate',
        'cloudformation:ListStacks',
        'cloudformation:ValidateTemplate',
        'cloudformation:ListStackResources',
        'cloudformation:DescribeStackEvents',
        'cloudformation:GetStackPolicy',
      ],
      resources: ['*'],
    }))

    new cdk.CfnOutput(this, 'GitHubActionsDeployRoleArn', {
      value: deployRole.roleArn,
      description: 'Add this as AWS_ROLE_ARN in GitHub repository secrets',
      exportName: 'GitHubActionsDeployRoleArn',
    })
  }
}
