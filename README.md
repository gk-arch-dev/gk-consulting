# GK Consulting

Marketing site for GK Consulting — an independent Java & AWS architecture
consulting practice targeting DACH engineering leaders.

See `docs/architecture.md` for design decisions and rationale.

## Structure

```
app/        Next.js 16 frontend (static export → S3 + CloudFront)
backend/    Python 3.13 Lambda (contact form handler → SES)
infra/      AWS CDK TypeScript (site + API + WAF stack)
content/    MDX files (blog posts and case studies)
docs/       Architecture, page map, deployment notes, mockups
```

## Dev commands

```bash
# Frontend
cd app && npm run dev        # dev server (Turbopack)
cd app && npm run build      # static export → out/
cd app && npm run lint       # ESLint

# Backend
cd backend && python -m pytest

# Infrastructure
cd infra && npx cdk synth    # synthesise CloudFormation template
cd infra && npx cdk deploy   # deploy (requires AWS credentials)
```

## Versions

| Tool       | Version |
| ---------- | ------- |
| Node.js    | 24.x LTS |
| npm        | 11.x    |
| Next.js    | 16.x    |
| TypeScript | 6.x     |
| AWS CDK    | 2.x     |
| Python     | 3.13    |

## Docs

- `docs/architecture.md` — design decisions, stack rationale, palette, typography
- `docs/page-map.md` — every route and what's on it
- `docs/deployment.md` — first-time setup and ongoing deploy
- `docs/content-guide.md` — how to add blog posts and case studies
