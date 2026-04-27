#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { CertStack } from '../lib/cert-stack'
import { CiCdStack } from '../lib/cicd-stack'
import { GkConsultingStack } from '../lib/gk-consulting-stack'
import { getConfig } from '../lib/config'

const app = new cdk.App()
const config = getConfig(app.node)

const account = process.env.CDK_DEFAULT_ACCOUNT

// CloudFront ACM certificate must be provisioned in us-east-1.
// crossRegionReferences passes the cert ARN to eu-central-1 via SSM.
const certStack = new CertStack(app, 'GkConsultingCert', {
  env: { region: 'us-east-1', account },
  config,
  crossRegionReferences: true,
})

new GkConsultingStack(app, 'GkConsulting', {
  env: { region: 'eu-central-1', account },
  config,
  certificate: certStack.certificate,
  crossRegionReferences: true,
})

// Deploy this stack once manually before GitHub Actions takes over (Step 09).
// See docs/deployment.md Step G for instructions.
new CiCdStack(app, 'GkConsultingCiCd', {
  env: { region: 'eu-central-1', account },
  config,
})
