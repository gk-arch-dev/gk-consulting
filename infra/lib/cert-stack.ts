import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import { Config } from './config'

interface CertStackProps extends cdk.StackProps {
  config: Config
}

export class CertStack extends cdk.Stack {
  readonly certificate: acm.ICertificate

  constructor(scope: Construct, id: string, props: CertStackProps) {
    super(scope, id, props)

    const { config } = props

    const hostedZone = route53.PublicHostedZone.fromPublicHostedZoneAttributes(this, 'Zone', {
      hostedZoneId: config.hostedZoneId,
      zoneName: config.domainName,
    })

    this.certificate = new acm.Certificate(this, 'Certificate', {
      domainName: config.domainName,
      subjectAlternativeNames: [`www.${config.domainName}`],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    })
  }
}
