# Step 01 — Project foundation & repo structure

> Paste this entire prompt as one message into Claude Code.

---

## Context

I'm building a marketing website for **GK Consulting** — an independent
consulting practice for an EU-based Java & AWS architect targeting DACH
engineering leaders.

You'll find the full plan in `instructions/README.md` and supporting docs in
`docs/`. **Read those files before starting.** Read in particular:

- `instructions/README.md` — overall plan and stack
- `docs/architecture.md` — design decisions and rationale
- `docs/page-map.md` — site routes
- `docs/mockups/` — six reference HTML files (visual contract)

Your task in this step is to lay down the project foundation only. No UI yet,
no infrastructure yet — just scaffolding.

## Versions

**Use the latest LTS versions** of every tool. Look up the current LTS for:

- Node.js (write the version into `.nvmrc` and `engines.node` in `package.json`)
- npm
- Next.js
- TypeScript
- AWS CDK
- Python (the Lambda runtime — match the latest LTS-supported in AWS Lambda)

Pin them once known.

## Repo structure

Create this layout at the repo root:

```
gk-consulting/
├── app/              # Next.js app
├── backend/          # Python Lambda
├── infra/            # AWS CDK
├── content/          # MDX (blog + case studies)
│   ├── blog/
│   └── case-studies/
├── public/           # Static assets (already contains aws-saa.png, aws-sap.png)
├── docs/             # Project documentation (already populated)
│   └── mockups/      # Six HTML reference files (already in place)
├── .github/workflows/
├── .gitignore
├── .nvmrc            # Node LTS pin
└── README.md
```

The `docs/`, `instructions/`, and `public/images/` directories already exist
with content. **Do not modify or remove them.**

## What to do

### 1. Initialize the Next.js app in `app/`

- Run `npx create-next-app@latest app` with these answers:
  - TypeScript: yes
  - ESLint: yes
  - Tailwind CSS: **no**
  - `src/` directory: no
  - App Router: yes
  - Turbopack: yes (if offered as default)
  - Customize the import alias: no (keep default `@/*`)

- Then update `app/next.config.js` (or `.mjs`) to set:
  ```js
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  ```

- Verify `app/package.json` uses the latest LTS-compatible Next.js. Don't
  downgrade.

### 2. Initialize CDK in `infra/`

- `cd infra && npx aws-cdk@latest init app --language typescript`
- Verify `infra/package.json` uses latest CDK.
- Don't write any stack code yet (Step 8 will).

### 3. Initialize the Python Lambda in `backend/`

- Create `backend/handler.py` with a stub:
  ```python
  def handler(event, context):
      return {"statusCode": 200, "body": '{"ok": true}'}
  ```
- Create `backend/requirements.txt` (empty for now — boto3 ships with Lambda).
- Create `backend/requirements-dev.txt` with `pytest` and `moto[ses]`.
- Create `backend/test_handler.py` with one trivial passing test.

### 4. Root-level files

- `.nvmrc` — the Node LTS major version (e.g. `20`, `22` — whatever current LTS is)
- `.gitignore` — covers Node (`node_modules`, `.next`, `out`), CDK
  (`cdk.out`, `*.js` and `*.d.ts` in lib/), Python (`__pycache__`, `.pytest_cache`,
  `*.pyc`, `.venv`), env files (`.env*`), OS files (`.DS_Store`, `Thumbs.db`)
- `README.md` at repo root — short intro, dev commands, link to `docs/`

### 5. Move uploaded mockups

The user provided six HTML mockup files. Move them into `docs/mockups/`:

- `gk-consulting-main.html`
- `gk-consulting-case-studies-archive.html`
- `gk-consulting-case-study-simple-php-aws.html`
- `gk-consulting-case-study-php-aws.html`
- `gk-consulting-blog-archive.html`
- `gk-consulting-blog-post-template.html`

These are the visual contract for later steps.

### 6. AWS badge images

Two badge images (`aws-saa.png`, `aws-sap.png`) belong in `public/images/`.
Verify they're already there and not in `public/` directly.

## Acceptance criteria

- [ ] `cd app && npm run dev` starts Next.js dev server with default page
- [ ] `cd infra && npx cdk synth` produces a valid CFN template (probably empty)
- [ ] `cd backend && python -c "import handler"` succeeds
- [ ] `cd backend && python -m pytest` runs and passes
- [ ] `cat .nvmrc` shows the Node LTS major version
- [ ] All six mockup files exist in `docs/mockups/`
- [ ] `aws-saa.png` and `aws-sap.png` exist in `public/images/`
- [ ] `git status` is clean enough to commit (no `node_modules`, no build outputs)

Commit with message: `chore: project foundation and scaffolding`.

Do **not** start on UI, design tokens, or any pages yet. That's Step 02.
