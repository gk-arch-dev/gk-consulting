# GK Consulting

Marketing site for GK Consulting — an independent Java & AWS architecture
consulting practice targeting DACH engineering leaders.

See `docs/architecture.md` for design decisions and rationale.

## Quick start

```bash
git clone <repo>
cd gk-consulting

# Frontend
cd app && npm ci && npm run dev        # dev server at http://localhost:3000

# Backend tests
cd backend && pip install -r requirements-dev.txt && python -m pytest

# Infra (requires AWS credentials)
cd infra && npm ci && npx cdk synth
```

Or use the root scripts:

```bash
npm run dev          # start frontend dev server
npm run build        # production build → app/out/
npm run test:backend # run backend unit tests
npm run synth        # synthesise CDK CloudFormation template
npm run deploy       # deploy infra (requires AWS credentials)
```

## Structure

```
app/        Next.js 16 frontend (static export → S3 + CloudFront)
backend/    Python 3.13 Lambda (contact form handler → SES)
infra/      AWS CDK TypeScript (site + API + WAF stack)
content/    MDX files (blog posts and case studies)
docs/       Architecture, page map, deployment notes, mockups
```

## How to add a blog post

1. Create `content/blog/{date}-{slug}.mdx` with frontmatter:
   ```mdx
   ---
   title: "Your Post Title"
   date: "2026-05-01"
   summary: "One sentence summary shown in the post list."
   tags: [aws, architecture]
   ---

   Post body in MDX…
   ```
2. `git add` and commit
3. Push a branch, open a PR — CI runs 4 checks automatically
4. Merge when all checks are green
5. The deploy workflow runs on `main`; post is live at `/blog/{slug}/`
   within ~5 minutes

## How to add a case study

Same flow as a blog post, but the file goes in `content/case-studies/`:

```
content/case-studies/{slug}.mdx
```

Required frontmatter: `title`, `summary`, `industry`, `engagement`,
`outcome`. See `docs/content-guide.md` for the full schema.

## CI/CD

Two GitHub Actions workflows run automatically:

| Workflow | Trigger | What it does |
| -------- | ------- | ------------ |
| `pr.yml` | Pull request against `main` | Lint, typecheck, build, infra synth, backend tests — no deploy |
| `deploy.yml` | Push to `main` or manual dispatch | Build → CDK deploy → S3 sync → CloudFront invalidation |

All four PR checks (`lint-typecheck`, `build`, `infra-synth`,
`backend-tests`) must pass before a PR can be merged. Configure branch
protection in GitHub Settings → Branches — see `docs/deployment.md`
Step H for the exact settings.

No AWS credentials are stored in GitHub. The deploy workflow authenticates
via OIDC using the role provisioned in the `GkConsultingCiCd` CDK stack.

## Versions

| Tool       | Version  |
| ---------- | -------- |
| Node.js    | 24.x LTS |
| npm        | 11.x     |
| Next.js    | 16.x     |
| TypeScript | 6.x      |
| AWS CDK    | 2.x      |
| Python     | 3.13     |

## Docs

- `docs/architecture.md` — design decisions, stack rationale, palette, typography
- `docs/page-map.md` — every route and what's on it
- `docs/deployment.md` — first-time setup and ongoing deploy
- `docs/content-guide.md` — how to add blog posts and case studies
