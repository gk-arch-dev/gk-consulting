# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root-level shortcuts
```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Build Next.js static export → app/out/
npm run test:backend # Run Python backend tests
npm run synth        # CDK synth all stacks
npm run deploy       # CDK deploy all stacks
```

### Frontend (app/)
```bash
cd app
npm run dev          # Dev server
npm run build        # Static export
npm run lint         # ESLint
npx tsc --noEmit     # Type check only
```

### Backend (backend/)
```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest                  # All tests
python -m pytest --cov=handler    # With coverage
python -m pytest test_handler.py::test_happy_path  # Single test
python dev_server.py              # Local HTTP server on :8080 (mock mode)
```

### Infrastructure (infra/)
```bash
cd infra
npm test             # Jest tests for CDK stacks
npm run build        # TypeScript compile
npx cdk synth        # Synthesize CloudFormation templates
npx cdk deploy GkConsultingCert --profile <profile>  # Deploy cert stack first (us-east-1)
npx cdk deploy GkConsulting       # Deploy main stack (eu-central-1)
npx cdk deploy GkConsultingCiCd   # Deploy CI/CD stack (OIDC for GitHub Actions)
```

## Architecture

### Overview
Single git repo with three independent packages — no npm workspaces or Turborepo. Root `package.json` delegates via `npm --prefix`.

```
app/        Next.js 16, React 19, TypeScript (static export)
backend/    Python 3.13 Lambda (contact form + SES)
infra/      AWS CDK TypeScript (S3, CloudFront, API GW, WAF, Route53)
content/    MDX files (blog posts + case studies, read at build time)
docs/       Architecture decisions, deployment runbook, content guide
```

### Frontend (app/)
- **Static export only** (`output: "export"` in next.config.ts) — no SSR, no server components with data fetching at runtime.
- **App Router** with dynamic routes for `/blog/[slug]/` and `/case-studies/[slug]/`.
- **No Tailwind** — plain CSS with design tokens in `styles/tokens.css` as CSS custom properties (`--bg`, `--ink`, `--accent`, etc.). Light/dark theme via CSS variable override, persisted to `localStorage`.
- **Content pipeline:** `lib/content.ts` reads MDX files from `../content/` at build time using `gray-matter` for frontmatter and `next-mdx-remote` for rendering. Types `BlogPost` and `CaseStudy` are defined there.
- **Custom MDX components:** `<Note>`, `<TradeOff>`, `<Pullquote>` in `components/mdx/`.
- **Reveal animations:** `lib/useReveal.ts` hook + `components/Reveals.tsx` use `IntersectionObserver` for scroll-triggered fade-up animations.

### Backend (backend/)
- Single Lambda handler (`handler.py`) for the contact form — validates input, sanitizes with `html.escape`, sends via AWS SES with Reply-To.
- Set `SES_FROM=mock` to run in mock mode without AWS credentials (used by `dev_server.py`).
- Tests use `moto[ses]` to mock AWS SES; no real AWS calls in tests.

### Infrastructure (infra/)
Three CDK stacks, deployed in order:
1. **`GkConsultingCert`** (us-east-1) — ACM certificate for CloudFront (must be us-east-1).
2. **`GkConsulting`** (eu-central-1) — S3 bucket + CloudFront distribution + Route53 records + API Gateway + Lambda + WAF + SES domain identity.
3. **`GkConsultingCiCd`** (eu-central-1) — GitHub OIDC provider + IAM role for GitHub Actions.

Key infra decisions:
- S3 bucket uses OAC (not OAI) for CloudFront origin.
- CloudFront Function rewrites `/path/` and `/path` → `/path/index.html` (required for static export).
- Two cache policies: HTML = 5-min TTL, `_next/static/*` = 1-year immutable.
- WAF geo-allowlist: EU + US, CA, AU, NZ. Rate limiting per IP.
- S3 bucket `RemovalPolicy.RETAIN` — manual cleanup required on stack deletion.

### CI/CD
- `pr.yml`: lint + typecheck + build + CDK synth + pytest (all required for merge).
- `deploy.yml`: build → CDK deploy → S3 sync (hashed assets with immutable cache, HTML with 5-min cache) → CloudFront invalidation.
- GitHub Actions authenticates to AWS via OIDC (no stored secrets).

## Content

Blog posts: `content/blog/YYYY-MM-DD-{slug}.mdx`
Case studies: `content/case-studies/{slug}.mdx`

See `docs/content-guide.md` for frontmatter schemas, tag vocabulary, and MDX component usage.

## Key Docs

- `docs/architecture.md` — Design rationale, target audience, performance budget, SEO strategy.
- `docs/deployment.md` — Step-by-step production setup from cold start.
- `docs/content-guide.md` — Content authoring guide with frontmatter schemas.
- `app/AGENTS.md` — Note about Next.js 16 breaking changes; consult `node_modules/next/dist/docs/` for up-to-date docs.
