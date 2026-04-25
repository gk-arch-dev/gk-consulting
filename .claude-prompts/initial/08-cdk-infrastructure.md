# Step 08 — AWS CDK infrastructure

> Paste this entire prompt as one message into Claude Code.

---

## Context

You've completed Steps 01–07. Now provision AWS resources via CDK.

**Read first:**

- `docs/architecture.md` — section "Infrastructure"
- `docs/deployment.md` — first-time setup checklist

Use latest LTS-compatible CDK and Node. Use `aws-cdk-lib` v2 (the only
supported track).

## What to do

### 1. Stack structure

Two stacks in `infra/lib/`:

- `gk-consulting-stack.ts` — site + API + WAF + DNS (the main stack)
- `cicd-stack.ts` — GitHub OIDC provider and IAM role for CI/CD
  (deployed once manually before GitHub Actions takes over in Step 09)

`infra/bin/app.ts` instantiates both, but they're independent (CiCd has
no dependency on the main stack).

### 2. Configuration

`infra/lib/config.ts` exports a typed `Config` object:

```ts
export type Config = {
  domainName: string          // e.g. 'gk-consulting.eu' (placeholder)
  apiSubdomain: string        // 'api'
  hostedZoneId: string        // existing Route 53 zone — provided by user
  sesFromAddress: string      // 'noreply@gk-consulting.eu'
  sesToAddress: string        // 'hello@gk-consulting.eu'
  githubOrg: string           // for OIDC trust
  githubRepo: string          // for OIDC trust
  // WAF geo-allow list
  allowedCountries: string[]  // ['DE','AT','CH','NL','BE','FR','IT','ES','PL','GB','IE','US','CA','AU','NZ']
}
```

Read values from `cdk.json` context or environment. Document in
`docs/deployment.md` how to set them.

### 3. Main stack: `GkConsultingStack`

Region: `eu-central-1` (Frankfurt). Some resources need `us-east-1`
(see notes below).

#### 3.1 Site hosting

- **S3 bucket** (`siteBucket`):
  - Block all public access
  - No website hosting on the bucket itself (private)
  - Server-side encryption (S3-managed)
  - Lifecycle: keep only the current version (no versioning needed yet)
  - `removalPolicy: RETAIN` (don't auto-delete the bucket on stack
    destroy — defends against accidents)

- **CloudFront distribution**:
  - Origin: `S3BucketOrigin.withOriginAccessControl(siteBucket)`
    (CDK v2 best practice — uses OAC, not OAI)
  - Default behavior: redirect HTTP → HTTPS, GET/HEAD only, compress on
  - Cache policy: HTML files 5min TTL, hashed assets 1 year (Next.js
    outputs `_next/static/*` with content hashes — they're safe to
    cache long)
  - Custom error responses: 404 → `/404.html`, 403 → `/404.html`
  - Price class: `PRICE_CLASS_100` (NA + EU only)
  - HTTP version: HTTP2 + HTTP3
  - Domain: `${domainName}` and `www.${domainName}`

- **ACM certificate** (CloudFront requires us-east-1):
  - Use `DnsValidatedCertificate` in us-east-1, or create a separate
    cross-region stack reference. CDK v2 has
    `acm.Certificate.fromCertificateArn` if you provision the cert via a
    side stack. Simplest: use a `CrossRegionCertificate` pattern —
    a small companion stack `CertStack` deployed in us-east-1.
  - Domain: `gk-consulting.eu`, SANs: `www.gk-consulting.eu`
  - DNS validation
  - Document the cross-region setup clearly in `docs/deployment.md`

- **Route 53 records**:
  - A + AAAA aliases pointing to the CloudFront distribution for both
    apex and `www`

#### 3.2 Contact API

- **Lambda function** (`contactLambda`):
  - Runtime: Python latest LTS supported by Lambda (look up at deploy time)
  - Code from `../backend/`
  - Memory: 256 MB
  - Timeout: 10 seconds
  - Environment vars: `SES_FROM`, `SES_TO`, `SITE_ORIGIN`
  - Log retention: 7 days (CDK `logs.RetentionDays.ONE_WEEK`)

- **API Gateway HTTP API** (cheaper and simpler than REST API):
  - Routes:
    - `POST /contact` → contactLambda
    - `OPTIONS /contact` → contactLambda (the Lambda handles CORS preflight)
  - Custom domain: `api.gk-consulting.eu`
  - Separate ACM cert for `api.${domainName}` in `eu-central-1` (regional)
  - Route 53 record pointing to the API Gateway custom domain

- **SES**:
  - Domain identity for `gk-consulting.eu`
  - DKIM enabled
  - Note: actual verification requires DNS records to be in place; CDK
    creates the resource but the user may need to wait for verification
    to complete. Document this in `docs/deployment.md`.

#### 3.3 AWS WAF

- **Regional WebACL** (associated with API Gateway, not CloudFront):
  - Default action: `allow`
  - Scope: `REGIONAL`
  - Region: `eu-central-1` (matches API Gateway region)

- **Rules** in priority order:
  1. **AWSManagedRulesAmazonIpReputationList** — BLOCK (priority 1)
  2. **AWSManagedRulesKnownBadInputsRuleSet** — BLOCK (priority 2)
  3. **AWSManagedRulesCommonRuleSet** — start in COUNT mode (priority 3)
     (so we observe what would be blocked before flipping to BLOCK).
     Document this in deployment.md and recommend flipping to BLOCK
     after one week of clean logs.
  4. **Rate-based rule**: 20 requests per 5 minutes per IP → BLOCK
     (priority 4)
  5. **Geo-allow rule**: only allow countries in `allowedCountries`
     config; BLOCK others (priority 5). Document that this is
     intentionally permissive — can be tightened later.

- **CloudWatch metrics + sampled requests**: enabled
- **Logs**: log group with 7-day retention. WAF logging requires a Kinesis
  Firehose for full request logs — skip that for now; sampled requests
  in the console are sufficient at our traffic level.

- **Association**: `CfnWebACLAssociation` linking the WebACL to the
  API Gateway stage's ARN

#### 3.4 IAM

- Lambda execution role: `SES:SendEmail` + `SES:SendRawEmail` scoped to
  the verified domain identity, basic Lambda execution policy

#### 3.5 Stack outputs

- `SiteBucketName`
- `DistributionId`
- `ApiUrl`
- `WebAclArn`

These are needed by GitHub Actions (Step 09).

### 4. CI/CD stack: `CiCdStack`

In `infra/lib/cicd-stack.ts`. **Deploy this once manually**, before
GitHub Actions can take over.

- **GitHub OIDC provider** (only one per AWS account; check existing
  before creating)
- **IAM role** `GitHubActionsDeployRole`:
  - Trust policy: only the specific repo + branch via OIDC sub claim:
    `repo:${githubOrg}/${githubRepo}:ref:refs/heads/main`
    and `repo:${githubOrg}/${githubRepo}:pull_request` (for PR-only
    permissions like `cdk synth`)
  - Permissions:
    - `cloudformation:*` on stacks named `GkConsulting*`
    - `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the site bucket
    - `cloudfront:CreateInvalidation` on the distribution
    - `iam:PassRole` for the CDK execution role
    - All other needed CDK permissions (use a starter policy and tighten
      iteratively)

Output the role ARN; this goes into GitHub repo secrets.

### 5. CDK app entrypoint

`infra/bin/app.ts`:

```ts
const app = new cdk.App()
new GkConsultingStack(app, 'GkConsulting', { env: { region: 'eu-central-1', account: ... } })
new CiCdStack(app, 'GkConsultingCiCd', { env: ... })
new CertStack(app, 'GkConsultingCert', { env: { region: 'us-east-1', account: ... } })
```

The CertStack provisions the CloudFront cert separately in us-east-1 and
exports the ARN; GkConsultingStack consumes it.

### 6. Documentation

Update `docs/deployment.md` with:

- Prerequisites:
  - AWS account ID
  - Existing Route 53 hosted zone for the domain
  - Required IAM perms for first-time deploy
- First-time setup checklist:
  1. Create hosted zone (if domain bought)
  2. Update `infra/cdk.json` context with real values
  3. Bootstrap CDK in both regions: `cdk bootstrap aws://ACCOUNT/eu-central-1`
     and `aws://ACCOUNT/us-east-1`
  4. Deploy CertStack first: `cdk deploy GkConsultingCert`
  5. Wait for DNS validation (CDK polls; can take 5-30 min)
  6. Deploy main stack: `cdk deploy GkConsulting`
  7. Wait for SES domain verification (DNS records get added; verification
     can take up to 72h but usually <1h)
  8. Once SES is verified, request production access (out of sandbox)
     in the SES console
  9. Deploy CiCdStack: `cdk deploy GkConsultingCiCd`
  10. Add the OIDC role ARN to GitHub repo secrets as `AWS_ROLE_ARN`
- Recurring deploys: handled by GitHub Actions in Step 09
- Troubleshooting common issues

## Acceptance criteria

- [ ] `cd infra && npx cdk synth GkConsulting` produces a valid template
- [ ] `cdk diff GkConsulting` against an empty environment shows expected
  resources (S3, CloudFront, API Gateway, Lambda, WAF, Route 53 records,
  ACM cert reference, SES identity)
- [ ] `cdk synth GkConsultingCiCd` produces a valid template with OIDC
  provider + role + scoped permissions
- [ ] `cdk synth GkConsultingCert` produces a valid template in us-east-1
- [ ] `docs/deployment.md` contains the full first-time setup checklist
- [ ] If the user has a real AWS account + domain, `cdk deploy
  --all` succeeds (this can be deferred until ready to actually
  deploy)
- [ ] After deploy: visit `gk-consulting.eu` and see the site
- [ ] After deploy: `curl -X POST https://api.gk-consulting.eu/contact
  -H 'Content-Type: application/json' -d '{...}'` sends an email

Commit with message: `feat(infra): CDK stacks for site, API, WAF, DNS, OIDC`.
