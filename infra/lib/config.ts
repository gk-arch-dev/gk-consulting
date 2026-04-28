import { Node } from 'constructs'

export type Config = {
  domainName: string
  apiSubdomain: string
  hostedZoneId: string
  sesFromAddress: string
  sesToAddress: string
  githubOrg: string
  githubRepo: string
  allowedCountries: string[]
}

export function getConfig(node: Node): Config {
  return {
    domainName: node.tryGetContext('domainName') ?? 'gkconsulting.cloud',
    apiSubdomain: node.tryGetContext('apiSubdomain') ?? 'api',
    hostedZoneId: node.tryGetContext('hostedZoneId') ?? 'Z0123456789EXAMPLE',
    sesFromAddress: node.tryGetContext('sesFromAddress') ?? 'noreply@gkconsulting.cloud',
    sesToAddress: node.tryGetContext('sesToAddress') ?? 'hello@gkconsulting.cloud',
    githubOrg: node.tryGetContext('githubOrg') ?? 'PLACEHOLDER_ORG',
    githubRepo: node.tryGetContext('githubRepo') ?? 'gk-consulting',
    allowedCountries: node.tryGetContext('allowedCountries') ?? [
      'DE', 'AT', 'CH', 'NL', 'BE', 'FR', 'IT', 'ES', 'PL', 'GB', 'IE', 'US', 'CA', 'AU', 'NZ',
    ],
  }
}
