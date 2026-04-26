# Deployment

How to deploy GK Consulting to AWS, from cold start to recurring
production deploys.

---

## TL;DR

- **First-time setup**: ~30 min plus some waiting on DNS validation and
  SES verification (can be ~hours if SES needs production access).
- **Subsequent deploys**: automatic on push to `main`. ~5 min from push
  to live.
- **Manual deploys** (rare): `cd infra && npx cdk deploy GkConsulting`

---

## Prerequisites

Before the first deploy, you need:

1. **An AWS account** you control
2. **A registered domain** (placeholder in this project: `gk-consulting.eu`).
   Until you buy your real domain, all references can stay as placeholders;
   the CDK will use whatever you put in `cdk.json` context.
3. **A Route 53 hosted zone** for the domain. If you registered the domain
   through AWS, this is created automatically. Otherwise, create the zone
   manually and point your registrar's nameservers at the AWS NS records.
4. **AWS CLI** configured locally with admin or near-admin permissions
   for the first-time deploy. After CI/CD is set up, the human admin
   role becomes optional.
5. **Node.js (latest LTS)** — see `.nvmrc` at repo root.
6. **AWS CDK installed**: `npm install -g aws-cdk` (or use the local
   binary via `npx`).
7. **Python (latest LTS supported by Lambda)** for backend tests.
8. **A GitHub repository** (for CI/CD).

---

## First-time setup

### Step A: configure CDK context

Edit `infra/cdk.json` and set the context values for your environment:

```json
{
  "context": {
    "domainName": "gk-consulting.eu",
    "hostedZoneId": "Z0123456789EXAMPLE",
    "sesFromAddress": "noreply@gk-consulting.eu",
    "sesToAddress": "hello@gk-consulting.eu",
    "githubOrg": "your-github-org",
    "githubRepo": "gk-consulting",
    "allowedCountries": ["DE","AT","CH","NL","BE","FR","IT","ES","PL","GB","IE","US","CA","AU","NZ"]
  }
}
```

You can also pass these via environment variables — see `infra/lib/config.ts`
for the loader. **Do not commit real values if the repo is public.** Use
GitHub repository secrets and CDK context overrides in CI.

### Step B: bootstrap CDK in both regions

CloudFront ACM certificates must live in `us-east-1`. Everything else
lives in `eu-central-1`. Bootstrap both:

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

cdk bootstrap aws://$AWS_ACCOUNT_ID/eu-central-1
cdk bootstrap aws://$AWS_ACCOUNT_ID/us-east-1
```

This creates the CDK staging buckets and IAM roles. One-time per region
per account.

### Step C: deploy the certificate stack

The CloudFront cert lives in us-east-1 in its own stack:

```bash
cd infra
npx cdk deploy GkConsultingCert
```

This creates an ACM certificate for `gk-consulting.eu` and `www.gk-consulting.eu`
with DNS validation. CDK waits for validation; can take 5–30 minutes.

If validation hangs longer than 30 minutes, check the Route 53 zone for
the `_acme-challenge` CNAME records — they should be there automatically,
but human-managed zones sometimes need manual intervention.

### Step D: deploy the main stack

```bash
npx cdk deploy GkConsulting
```

This creates:
- S3 bucket for the site
- CloudFront distribution
- Route 53 records (A + AAAA) for apex and www
- API Gateway HTTP API
- Contact form Lambda
- AWS WAF + association with the API
- ACM cert for `api.gk-consulting.eu` (regional, eu-central-1)
- SES domain identity for `gk-consulting.eu`
- IAM role for the Lambda

The first deploy can take 15–25 minutes (CloudFront propagation alone
takes ~10 min).

After deploy completes, **note the stack outputs**:

- `SiteBucketName`
- `DistributionId`
- `ApiUrl`

You'll need these for the first manual site sync below.

### Step E: verify SES domain

After deploy, AWS adds DKIM and verification records to your hosted zone
automatically. Check progress in the SES console:

1. Go to **SES → Verified identities** in eu-central-1
2. Find `gk-consulting.eu`
3. Wait for status to show "Verified" (usually <1 hour, max 72h)

Once verified, **request production access** (SES starts in sandbox mode
which only allows sending to verified addresses):

1. SES console → **Account dashboard** → **Request production access**
2. Mail type: Transactional
3. Website: your production URL
4. Use case: "Contact form replies for a B2B consulting site"
5. Submit. Approval is typically <24h.

Until production access is granted, the form will only send mail to
verified addresses. Add `hello@gk-consulting.eu` (your `sesToAddress`)
as a verified identity manually so you can at least test.

### Step F: first manual site upload

The CDK stack creates the S3 bucket, but doesn't upload site content.
Do this once manually (after Step E so DNS resolves):

```bash
cd app
npm ci
npm run build

# Set NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_API_URL before build:
NEXT_PUBLIC_SITE_URL=https://gk-consulting.eu \
NEXT_PUBLIC_API_URL=https://api.gk-consulting.eu \
npm run build

# Upload to S3 (use the bucket name from Step D output):
aws s3 sync ./out s3://YOUR-SITE-BUCKET/ --delete

# Invalidate CloudFront cache (use distribution ID from Step D output):
aws cloudfront create-invalidation \
  --distribution-id YOUR-DIST-ID \
  --paths "/*"
```

After ~30 seconds, visit `https://gk-consulting.eu`. Site should load.

### Step G: deploy the CI/CD stack

```bash
cd infra
npx cdk deploy GkConsultingCiCd
```

This creates the GitHub OIDC provider (if not already present) and the
IAM role GitHub Actions will assume. Note the output:

- `GitHubActionsDeployRoleArn`

### Step H: configure GitHub repository

In your GitHub repo settings → Secrets and variables → Actions, add:

| Secret name              | Value                                         |
| ------------------------ | --------------------------------------------- |
| `AWS_ROLE_ARN`           | The role ARN from Step G                      |
| `NEXT_PUBLIC_SITE_URL`   | `https://gk-consulting.eu`                    |
| `NEXT_PUBLIC_API_URL`    | `https://api.gk-consulting.eu`                |

In **Settings → Branches**, enable branch protection on `main`:

- Require pull request before merging
- Require status checks to pass: `lint-typecheck`, `build`, `infra-synth`,
  `backend-tests`
- Don't allow force pushes
- Don't allow deletion

### Step I: end-to-end test

1. Push a small change to `main` (or merge a PR with one).
2. Watch GitHub Actions run.
3. Verify the change appears on `https://gk-consulting.eu` within 5 minutes.
4. Submit a test message via the contact form. Check that:
   - The form shows the success state
   - The email arrives at `sesToAddress`
   - The email's Reply-To is set to the form submitter's email

If all four pass, you're live.

---

## Recurring deploys

After the first-time setup, deploys are automatic:

```bash
git commit -m "post: ..."
git push origin main
```

GitHub Actions runs:

1. **Build the site** (~1 min) — Next.js static export
2. **Deploy infra changes** (~2 min) — CDK diff + deploy if anything changed
3. **Sync to S3** (~30 s) — upload only changed files
4. **Invalidate CloudFront** (~30 s) — purge edge caches

Total: ~4–5 min from push to live.

For pull requests, the same checks run **without** the deploy step,
so you can verify a build green-lights before merging.

---

## Adding content (the common case)

Day-to-day, the only thing you'll do is add or update MDX files in
`content/`:

```bash
git checkout -b post/strangler-fig
# Create/edit content/blog/2026-03-18-strangler-fig.mdx
git add content/blog/...
git commit -m "post: strangler fig in practice"
git push origin post/strangler-fig
# Open PR. Merge when CI is green.
```

The deploy workflow runs on merge. Post is live in ~5 minutes.

---

## Troubleshooting

### "ACM certificate validation hangs"

Check Route 53 zone for the `_acme-challenge` CNAME records that ACM
adds automatically. If they're missing, the zone delegation may be
incorrect. Verify:

```bash
dig +short NS gk-consulting.eu
```

The result should match the NS records of your AWS hosted zone. If
not, fix the registrar.

### "SES is in sandbox mode, contact form fails"

Until SES production access is granted (Step E), Lambda can only send
to verified email addresses. Either:

- Verify the recipient address (`hello@gk-consulting.eu`) manually in
  the SES console
- Wait for production access approval

### "CloudFront returns 403 on a route"

CloudFront's "default root object" needs to be `index.html` and the
custom error responses must redirect 403 → `/404.html`. If a route
like `/blog/` returns 403, check:

1. The S3 sync uploaded `out/blog/index.html`
2. CloudFront error response config maps 404/403 to `/404.html`
3. The CloudFront distribution has `PRICE_CLASS_100` and your origin
   access is via OAC (not OAI — OAC is the modern way)

### "WAF blocks legitimate requests"

The `AWSManagedRulesCommonRuleSet` is initially in COUNT mode (logs
hits but doesn't block). After a week of clean logs:

1. Review CloudWatch sampled requests in the WAF console
2. If false-positive rate is acceptable, switch to BLOCK mode
3. Update `infra/lib/gk-consulting-stack.ts` to set `overrideAction:
   none` on the rule
4. Redeploy

The geo-allow list is also conservative. If you're getting traffic from
allowed countries that are being blocked, check the rule order in the
WebACL — geo blocks should be lower priority than rate-based rules so
allowed countries hitting rate limits still get blocked.

### "Form submits but no email arrives"

Check, in order:

1. Lambda CloudWatch Logs — was the request received? Did SES throw?
2. SES sending statistics — was the message sent? Bounced?
3. The destination inbox spam folder
4. SES SMTP credentials and DKIM — check that DKIM is "Successful" in
   the SES console
5. The Lambda env vars `SES_FROM` and `SES_TO` — verify they're set
   correctly in the deployed function (Lambda console → Configuration
   → Environment variables)

### "I need to roll back a deploy"

```bash
git revert HEAD
git push origin main
```

The next deploy reverts both the site and any infra changes. For
emergencies, you can also redeploy manually from any commit:

```bash
git checkout <good-commit>
cd app && npm run build
aws s3 sync ./out s3://YOUR-SITE-BUCKET/ --delete
aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"
```

### "I need to delete the whole stack"

**Don't do this lightly.** The S3 bucket has `RETAIN` removal policy by
design — deleting the stack will leave the bucket behind (which prevents
accidental data loss but means you have to clean up manually).

```bash
cd infra
npx cdk destroy GkConsulting        # main stack
npx cdk destroy GkConsultingCert    # cert stack (us-east-1)
# CiCdStack: leave alone unless you're sure
```

After stack destroy, manually empty + delete the S3 bucket if needed.

---

## Cost expectations

At launch (~50 visits/month, no analytics, ~3 contact form submissions/month):

| Resource              | Estimated monthly cost              |
| --------------------- | ----------------------------------- |
| Route 53 hosted zone  | $0.50                               |
| ACM certs             | $0 (free)                           |
| S3 storage + requests | <$0.10                              |
| CloudFront            | <$0.50 (well within free tier)      |
| API Gateway HTTP API  | <$0.10                              |
| Lambda                | $0 (free tier covers it)            |
| SES                   | $0 (62,000 emails/month free)       |
| WAF                   | ~$5 (the only meaningful line item) |
| **Total**             | **~$6/month**                       |

Plus your domain registration (~€10–15/year for `.eu`).

If you scale to thousands of visits, CloudFront costs rise modestly
(~$0.085/GB transferred). At 100K visits/month you're still under $50.

WAF is the dominant line item. If you want to drop to ~$1/month, you
can remove WAF and use a honeypot field instead — but you've already
chosen WAF for the reasons in `architecture.md`. Keep it.

---

## Checklist before going live

Before pointing your real domain at the production CloudFront distribution
and announcing the site:

- [ ] Lighthouse score ≥90 across all four metrics on every page
- [ ] Test the contact form end-to-end with your real inbox
- [ ] Test the Cal.com booking link reaches your real calendar
- [ ] Theme toggle works in Firefox, Safari, Chrome
- [ ] iPhone Safari renders correctly
- [ ] LinkedIn link preview shows the correct OG image (use a draft
      LinkedIn post to verify)
- [ ] Real Impressum content (not the placeholder)
- [ ] Real Datenschutz content (not the placeholder) — review with a
      German lawyer or use a verified template
- [ ] AWS badge URLs link to your real Credly profile
- [ ] Cal.com username in the contact section is real
- [ ] Email addresses (`hello@`, `noreply@`) work and forward correctly
- [ ] WAF in active BLOCK mode (not COUNT) for the common rule set,
      after a week of clean COUNT-mode logs
- [ ] At least 3 case studies and 3 blog posts published
- [ ] The "Updated" date on `/blog` reflects a real recent post

The Impressum and Datenschutz items are non-negotiable for DACH legal
compliance.
