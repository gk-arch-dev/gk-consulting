# Step 09 — CI/CD with GitHub Actions

> Paste this entire prompt as one message into Claude Code.

---

## Context

You've completed Steps 01–08. Now wire up automated build + deploy via
GitHub Actions, using the OIDC role provisioned in Step 08.

**Read first:**

- `docs/deployment.md` — confirm the OIDC role ARN, S3 bucket name,
  CloudFront distribution ID outputs from Step 08

## What to do

### 1. Deploy workflow

Create `.github/workflows/deploy.yml`:

Triggers:
- `push` to `main`
- `workflow_dispatch` (manual trigger from the GitHub UI for
  emergency redeploys)

Jobs (run sequentially since each depends on the previous):

#### Job 1: `build-site`

- Checkout repo
- Setup Node from `.nvmrc`
- `cd app && npm ci`
- `cd app && npm run build` — produces `app/out/`
- Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` from secrets
  before the build (these are baked into the static output)
- Upload `app/out/` as a workflow artifact named `site-out`

#### Job 2: `deploy-infra` (depends on `build-site`)

- Checkout
- Setup Node from `.nvmrc`
- `cd infra && npm ci`
- Configure AWS credentials via OIDC:
  - role-to-assume: `${{ secrets.AWS_ROLE_ARN }}`
  - aws-region: `eu-central-1`
- `cd infra && npx cdk deploy GkConsulting --require-approval never`
- (CertStack and CiCdStack are NOT redeployed every push — they're
  rarely updated and breakage there shouldn't block normal deploys)
- Capture stack outputs (S3 bucket name, CloudFront distribution ID)
  using `aws cloudformation describe-stacks` and write to a file or
  set as job outputs

#### Job 3: `sync-site` (depends on both above)

- Checkout (just for the workflow files; we use the artifact for content)
- Download `site-out` artifact
- Configure AWS credentials via OIDC (same as Job 2)
- Read S3 bucket name and CloudFront distribution ID from Job 2's
  outputs
- `aws s3 sync ./site-out s3://${BUCKET} --delete --cache-control
  'public, max-age=31536000, immutable'` for the hashed assets folder
  `_next/static/`
- A second sync for HTML and root-level files with shorter cache
  (`public, max-age=300, must-revalidate`):
  `aws s3 sync ./site-out s3://${BUCKET}` (without `--delete`,
  separate include/exclude flags)
- `aws cloudfront create-invalidation --distribution-id ${ID} --paths "/*"`
- Wait for invalidation to complete (`aws cloudfront wait
  invalidation-completed`) — optional but useful for verification

### 2. PR check workflow

Create `.github/workflows/pr.yml`:

Triggers:
- `pull_request` against `main`

Don't deploy. Just verify.

Jobs (parallel where possible):

- **Frontend lint + typecheck:**
  - Setup Node from `.nvmrc`
  - `cd app && npm ci`
  - `cd app && npm run lint`
  - `cd app && npx tsc --noEmit`

- **Frontend build:**
  - Setup Node, `npm ci`, `npm run build`
  - Verifies the build succeeds (catches MDX errors, type errors, etc.)

- **Infra synth:**
  - Setup Node, `cd infra && npm ci`
  - `cd infra && npx cdk synth --all` (verifies all stacks are valid)

- **Backend tests:**
  - Setup Python from latest LTS
  - `cd backend && pip install -r requirements-dev.txt`
  - `cd backend && python -m pytest --cov=handler`

All jobs must pass for the PR to be mergeable. Configure repo branch
protection rules (document in README — manual GitHub UI step):

- Require PR before merging to main
- Require status checks: all 4 jobs above
- Don't allow force pushes to main
- Don't allow deletion of main

### 3. Don't deploy on forks

In both workflows, add a guard at the job level:

```yaml
if: github.event.pull_request.head.repo.full_name == github.repository
```

This prevents external contributors from triggering AWS-touching workflows
on their forked PRs.

### 4. GitHub repo secrets

Document in `docs/deployment.md`. Required secrets:

- `AWS_ROLE_ARN` — the OIDC role ARN from CiCdStack output
- `NEXT_PUBLIC_SITE_URL` — production site URL (e.g. `https://gk-consulting.eu`)
- `NEXT_PUBLIC_API_URL` — production API URL (e.g. `https://api.gk-consulting.eu`)

OIDC is configured via the role's trust policy, so no AWS access keys
are stored in GitHub.

### 5. CDK output capture utility

The deploy workflow needs the S3 bucket name and CloudFront distribution
ID at runtime. Two options:

**Option A: hardcode in workflow**
- After first deploy, add the bucket name + distribution ID as repo
  secrets
- Workflow reads them from secrets
- Trade-off: requires manual secret update if the resources are recreated

**Option B: query at runtime**
- Use `aws cloudformation describe-stacks` to get outputs
- Pipe through `jq` to extract values
- Set as job outputs that downstream jobs can read

Option B is cleaner. Do this:

```yaml
- name: Get stack outputs
  id: outputs
  run: |
    SITE_BUCKET=$(aws cloudformation describe-stacks \
      --stack-name GkConsulting \
      --query "Stacks[0].Outputs[?OutputKey=='SiteBucketName'].OutputValue" \
      --output text)
    DIST_ID=$(aws cloudformation describe-stacks \
      --stack-name GkConsulting \
      --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" \
      --output text)
    echo "site_bucket=$SITE_BUCKET" >> $GITHUB_OUTPUT
    echo "dist_id=$DIST_ID" >> $GITHUB_OUTPUT
```

Downstream jobs use `${{ needs.deploy-infra.outputs.site_bucket }}`.

### 6. README update

Update root `README.md`:

- Quick start (clone, install, dev)
- How to add a blog post:
  ```
  1. Create content/blog/{date}-{slug}.mdx with frontmatter
  2. git commit && git push
  3. PR check runs; merge when green
  4. main deploys automatically; live within ~5 min
  ```
- Same for case studies
- Link to `docs/architecture.md`, `docs/page-map.md`, `docs/deployment.md`,
  `docs/content-guide.md`

### 7. Add a `make` or npm script for common tasks (optional but useful)

Root `package.json`:

```json
{
  "scripts": {
    "dev": "npm --prefix app run dev",
    "build": "npm --prefix app run build",
    "test:backend": "cd backend && python -m pytest",
    "synth": "npm --prefix infra run synth",
    "deploy": "npm --prefix infra run deploy"
  }
}
```

## Acceptance criteria

- [ ] Open a PR with a small change — `pr.yml` runs, all 4 checks pass
- [ ] Merge to main — `deploy.yml` runs:
  - Site builds successfully
  - CDK deploy completes
  - S3 sync uploads the new build
  - CloudFront invalidation runs
  - Total time: <5 minutes
- [ ] Add a new blog post MDX file via PR, merge → post appears at
  `/blog/{slug}/` after deploy
- [ ] Edit a section component on homepage via PR, merge → change is
  live on `/`
- [ ] No AWS credentials are stored in GitHub secrets (OIDC only)
- [ ] Forked PRs can run lint/build/test but cannot deploy
- [ ] README.md explains the workflow clearly enough that someone new
  could ship a post

Commit with message: `feat(ci): GitHub Actions deploy and PR workflows`.
