# GK Consulting — Implementation Plan for Claude Code

This document is a step-by-step plan for building the **GK Consulting** marketing
site using Claude Code. Each step is a self-contained prompt you paste into
Claude Code as one message. Run them sequentially. Verify the acceptance
criteria after each step before moving on.

---

## Project overview

**Site:** Independent consulting practice for an EU-based Java & AWS architect,
targeting DACH (Germany / Austria / Switzerland) engineering leadership.

**Stack:**

| Layer                     | Choice                                                      |
| ------------------------- | ----------------------------------------------------------- |
| Frontend framework        | Next.js (latest LTS) with `output: 'export'` (static)       |
| Language                  | TypeScript (latest LTS) on the frontend & infra             |
| Styling                   | Plain CSS with design tokens (no Tailwind, no CSS-in-JS)    |
| Content                   | MDX with frontmatter (one file per post / case study)       |
| Hosting                   | AWS S3 + CloudFront                                         |
| DNS / TLS                 | AWS Route 53 + ACM                                          |
| Contact form backend      | API Gateway HTTP API → Lambda (Python latest LTS) → SES     |
| Spam protection           | AWS WAF in front of API Gateway                             |
| Booking                   | Cal.com EU (15-min intro call), external link only          |
| Infrastructure as Code    | AWS CDK (TypeScript)                                        |
| CI/CD                     | GitHub Actions, OIDC for AWS auth                           |
| Analytics                 | None (intentional, can add later)                           |
| Comments                  | None                                                        |
| Domain                    | Placeholder `gk-consulting.eu` until purchased              |

> **Always use latest LTS versions** of Node.js, npm, Next.js, TypeScript,
> Python (Lambda runtime), and AWS CDK. When Claude Code initializes the
> project, it should read the latest LTS at that time and pin to it
> (e.g., `.nvmrc`, `engines` in package.json, Lambda runtime in CDK).

---

## Reference materials

You will be given six HTML mockups as attachments. They are the **visual
contract** for the React build — every page must match them in light and
dark mode. Place them in `docs/mockups/` for Claude Code to read on demand.

| Mockup file                                          | Purpose                                |
| ---------------------------------------------------- | -------------------------------------- |
| `gk-consulting-main.html`                            | Homepage (`/`)                         |
| `gk-consulting-case-studies-archive.html`            | Case studies archive (`/case-studies`) |
| `gk-consulting-case-study-simple-php-aws.html`       | Single case study page (simple)        |
| `gk-consulting-case-study-php-aws.html`              | Single case study page (rich variant)  |
| `gk-consulting-blog-archive.html`                    | Blog archive (`/blog`)                 |
| `gk-consulting-blog-post-template.html`              | Single blog post page                  |

Two AWS badge images are also attached: `aws-saa.png` and `aws-sap.png`.
Place them in `public/images/`.

> The "simple" case study page is the **primary** template. The rich variant
> exists for future flagship case studies but is not built in this plan.

---

## How to use this plan with Claude Code

1. Open Claude Code in your project directory (after Step 1 creates the repo).
2. For each step, paste the entire prompt from `steps/0X-*.md` as a single
   message.
3. Wait for completion. Verify the **Acceptance** criteria at the bottom of
   each step.
4. **Commit after each successful step** so you have rollback points.
5. If a step gets stuck, ask Claude Code to debug rather than moving on.

The 9 steps are in `steps/`, numbered `01` through `09`.

---

## Step-by-step roadmap

| Step | What it does                                              | Approx time  |
| ---- | --------------------------------------------------------- | ------------ |
| 01   | Project foundation, repo structure, scaffolding           | ~30 min      |
| 02   | Design system: tokens, typography, theme toggle, layout   | ~30 min      |
| 03   | Site shell: nav, mobile menu, footer, route placeholders  | ~45 min      |
| 04   | Homepage — all six sections                               | ~2–3 hrs     |
| 05   | MDX content layer + blog and case studies pages           | ~2 hrs       |
| 06   | SEO: metadata, OG images, sitemap, structured data        | ~45 min      |
| 07   | Contact form: Lambda backend + frontend integration       | ~45 min      |
| 08   | AWS CDK infrastructure                                    | ~1.5 hrs     |
| 09   | CI/CD with GitHub Actions + OIDC                          | ~1 hr        |

**Total**: ~8–10 hours of Claude Code time across 1–2 evening sessions.

---

## Pre-launch checklist

After Step 9 succeeds, verify before going live:

- [ ] Lighthouse scores ≥90 across performance, SEO, accessibility, best practices
- [ ] Contact form sends email end-to-end (test by submitting a real message)
- [ ] iPhone Safari rendering verified (large slice of DACH traffic)
- [ ] Theme toggle works in Firefox, Safari, Chrome
- [ ] LinkedIn link preview renders correctly (paste URL in a draft post)
- [ ] Cal.com booking link works and reaches your calendar
- [ ] Impressum and Datenschutz pages contain real legal content
- [ ] Open Graph image displays at correct dimensions on the major platforms
- [ ] Real domain configured (replace `gk-consulting.eu` placeholder)
- [ ] Real Credly badge URLs in the hero AWS badges section
- [ ] Real Cal.com username in the contact section booking link

The Impressum and Datenschutz items are non-negotiable for DACH legal
compliance. Do not ship without real content there.

---

## Repository structure (final)

```
gk-consulting/
├── app/                          # Next.js application
│   ├── app/                      # App Router pages
│   │   ├── layout.tsx            # Root layout (nav, footer, fonts)
│   │   ├── page.tsx              # Homepage (/)
│   │   ├── case-studies/
│   │   │   ├── page.tsx          # Archive (/case-studies)
│   │   │   └── [slug]/page.tsx   # Detail (/case-studies/{slug})
│   │   ├── blog/
│   │   │   ├── page.tsx          # Archive (/blog)
│   │   │   └── [slug]/page.tsx   # Detail (/blog/{slug})
│   │   ├── impressum/page.tsx    # Legal
│   │   ├── datenschutz/page.tsx  # Privacy policy
│   │   ├── sitemap.ts            # Build-time sitemap
│   │   └── opengraph-image.tsx   # Default OG image
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── sections/             # Homepage sections
│   │   └── mdx/                  # Note, Pullquote, TradeOff, CodeBlock
│   ├── lib/
│   │   └── content.ts            # MDX reading + frontmatter parsing
│   ├── styles/
│   │   ├── tokens.css            # Design tokens (light + dark)
│   │   ├── globals.css           # Base styles, paper noise
│   │   └── utilities.css         # Spine, reveal animation, etc.
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                      # Python contact form Lambda
│   ├── handler.py
│   ├── test_handler.py
│   ├── requirements.txt
│   └── requirements-dev.txt
│
├── content/                      # MDX content (you edit these)
│   ├── blog/
│   │   └── 2026-03-18-strangler-fig-in-practice.mdx
│   └── case-studies/
│       └── php-to-aws-migration.mdx
│
├── infra/                        # AWS CDK
│   ├── bin/app.ts                # CDK entrypoint
│   ├── lib/
│   │   ├── gk-consulting-stack.ts # Site + API + WAF
│   │   └── cicd-stack.ts          # GitHub OIDC role
│   ├── cdk.json
│   ├── tsconfig.json
│   └── package.json
│
├── public/                       # Static assets
│   └── images/
│       ├── aws-saa.png
│       └── aws-sap.png
│
├── docs/                         # Project documentation
│   ├── architecture.md           # North-star design decisions
│   ├── page-map.md               # Site routes and information architecture
│   ├── deployment.md             # First-time and ongoing deployment
│   ├── content-guide.md          # How to add posts and case studies
│   └── mockups/                  # Six reference HTML files
│
├── .github/workflows/
│   ├── deploy.yml                # On push to main
│   └── pr.yml                    # On pull request
│
├── .nvmrc                        # Pin Node LTS
├── .gitignore
└── README.md
```

---

## Documentation files

The following docs are written before implementation begins and live in
`docs/`. Claude Code reads them during each step:

- `docs/architecture.md` — design decisions, tech rationale, voice, palette
- `docs/page-map.md` — every route, what's on it, where it links
- `docs/deployment.md` — first-time setup and ongoing deploy flow
- `docs/content-guide.md` — frontmatter spec, how to add a new post
- `docs/mockups/*.html` — six visual reference files (the contract)

These are deliverables, not just notes — keep them up to date as the project
evolves.
