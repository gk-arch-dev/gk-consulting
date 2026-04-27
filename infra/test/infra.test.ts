import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { CertStack } from '../lib/cert-stack'
import { CiCdStack } from '../lib/cicd-stack'
import { GkConsultingStack } from '../lib/gk-consulting-stack'
import { getConfig } from '../lib/config'

function makeApp() {
  return new cdk.App()
}

test('CertStack synthesizes a DNS-validated ACM certificate', () => {
  const app = makeApp()
  const config = getConfig(app.node)
  const stack = new CertStack(app, 'TestCert', {
    config,
    env: { region: 'us-east-1', account: '123456789012' },
    crossRegionReferences: true,
  })
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'gk-consulting.eu',
    SubjectAlternativeNames: ['www.gk-consulting.eu'],
    ValidationMethod: 'DNS',
  })
})

test('CiCdStack synthesizes OIDC provider and deploy role', () => {
  const app = makeApp()
  const config = getConfig(app.node)
  const stack = new CiCdStack(app, 'TestCiCd', {
    config,
    env: { region: 'eu-central-1', account: '123456789012' },
  })
  const template = Template.fromStack(stack)
  template.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 1)
  template.hasResourceProperties('AWS::IAM::Role', { RoleName: 'GitHubActionsDeployRole' })
  template.hasOutput('GitHubActionsDeployRoleArn', {})
})

test('GkConsultingStack synthesizes core resources', () => {
  const app = makeApp()
  const config = getConfig(app.node)
  const certStack = new CertStack(app, 'TestCert', {
    config,
    env: { region: 'us-east-1', account: '123456789012' },
    crossRegionReferences: true,
  })
  const stack = new GkConsultingStack(app, 'TestMain', {
    config,
    certificate: certStack.certificate,
    env: { region: 'eu-central-1', account: '123456789012' },
    crossRegionReferences: true,
  })
  const template = Template.fromStack(stack)

  template.resourceCountIs('AWS::S3::Bucket', 1)
  template.hasResource('AWS::CloudFront::Distribution', {})
  template.hasResource('AWS::CloudFront::Function', {})
  template.hasResource('AWS::Lambda::Function', {})
  template.hasResource('AWS::ApiGatewayV2::Api', {})
  template.hasResource('AWS::WAFv2::WebACL', {})
  template.hasResource('AWS::WAFv2::WebACLAssociation', {})
  template.hasResource('AWS::SES::EmailIdentity', {})
  template.hasOutput('SiteBucketName', {})
  template.hasOutput('DistributionId', {})
  template.hasOutput('ApiUrl', {})
  template.hasOutput('WebAclArn', {})
})
