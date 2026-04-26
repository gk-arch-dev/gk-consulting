# Step 04 — Homepage

> Paste this entire prompt as one message into Claude Code.

---

## Context

You've completed Steps 01–03. Now build the homepage as a single page with
six sections.

**Read first:**

- `docs/mockups/gk-consulting-main.html` — the visual contract; build to match
- `docs/architecture.md` — section "Voice"
- `docs/page-map.md` — confirm the homepage anchor IDs

This is the largest single step. Take your time. Match the mockup pixel-close
in light and dark mode. The mockup HTML has every CSS rule and DOM structure
you need — port it faithfully.

## What to do

Build six section components in `app/components/sections/`, each as its own
file. The homepage `app/app/page.tsx` is just a thin wrapper that renders
them in order inside a single `<main>`.

### 1. Hero (`Hero.tsx`)

Reference: the `<section class="hero">` block in the mockup.

- Warm paper background (uses page bg)
- Padding 132px 28px 104px (top is for the fixed nav)
- Soft blueprint grid texture (the `::before` pseudo-element with
  `linear-gradient` × 2 at 48px intervals + radial mask)
- Copper warm glow (`::after` pseudo at top-right with radial gradient)
- **Right-edge spec block** (architectural title-block motif):
  - Position absolute, vertical-center on the right edge with
    `border-left: 1px solid var(--border)`
  - Three rows: `REV / 2026.04`, `REGION / eu-central-1`,
    `STATUS / accepting<br>new clients`
  - Each row has a small copper tick mark on the hairline
  - Hidden via `@media (max-width: 1180px)` — never shows on tablets/mobile
- **Hero content (in `.spine`):**
  - Hero mark line: `• GK · Est. 2026 · EU` in mono caps soft ink
  - Eyebrow: `Java & AWS Consulting` in mono copper
  - h1: `I design, build, and modernize backend systems on AWS.` —
    the words `on AWS.` are wrapped in `<em>` so they render italic copper
  - Lede paragraph (Inter 19px ink-muted) explaining what you do
  - Two CTAs:
    - Primary: `Book a discovery call` → `/#contact`. Pill button, dark navy
      bg, paper text, with a small arrow SVG. Hover = copper bg.
    - Ghost: `See case studies` → `/#work`. Transparent bg, ink text,
      `var(--border-strong)` border. Hover = stronger border + copper-soft bg.
  - Mobile (≤820px): CTAs stack vertically, full-width, centered text.

The hero **does not** include a credentials strip. AWS badges live in About.

All content is a Client Component (uses `IntersectionObserver` for the
`.reveal` animations). Mark with `'use client'`.

### 2. About (`About.tsx`)

Reference: `<section class="section" id="about">` in the mockup.

- Section header: `01.` in mono copper, then `About` label in mono soft ink,
  with a 40px copper rule between number and label (the `::after` on
  `.section-num`)
- About-intro grid: 88px portrait placeholder + name/role/location stack
  - Portrait is a div with copper-soft gradient background, "GK" in italic
    Instrument Serif. Replace with real `<img>` from `/public/images/`
    when available.
- Three prose paragraphs (Inter 18px line-height 1.75 ink-muted)
- Pullquote: 22-28px Instrument Serif italic, 2px copper left border
- Closing paragraph
- **AWS badges row** (after the prose):
  - "Verified Credentials" mono caps label with a 32px copper rule after it
  - Two badge cards, side-by-side, gap 32px:
    - Each card: 12px 16px padding, soft border, `var(--bg-elev)` bg, 8px radius
    - 64×64 image (`/images/aws-sap.png` and `/images/aws-saa.png`)
    - Right side: badge name in Instrument Serif 18px, issuer in mono caps
      tiny soft ink, "Verify on Credly →" in mono small letter-spacing
    - Hover: copper border, lift 1px, theme-aware shadow, name + verify
      link turn copper
    - Credly URLs (placeholders — replace with real ones when you have them):
      - SAP: `https://www.credly.com/badges/{user-uuid}/public_url`
      - SAA: `https://www.credly.com/badges/{user-uuid}/public_url`
    - `target="_blank" rel="noopener noreferrer"`
  - Mobile: stack vertically, full-width

### 3. Services (`Services.tsx`)

Reference: `<section class="section" id="services">`.

- Section header: `02. Services`
- h2 "Three ways we work together."
- Section lede paragraph
- Three service blocks, each with:
  - Left border: `2px solid var(--border-strong)`, padding `28px 0 28px 28px`
  - Hover: left-border turns copper; the small mono label also turns copper
  - Numbered label: `01 /` `02 /` `03 /` in mono copper + label
    (`Greenfield` / `Modernization` / `Embedded`) in mono caps soft ink
  - h3 title (Instrument Serif): `Architecture & Design` /
    `Legacy Migration & Modernization` / `Embedded Architect / Tech Lead`
  - Paragraph
  - Deliverables: 3-4 items in mono small caps with copper `→` prefix.
    The first deliverable gets `color: var(--ink); font-weight: 500;` — the
    rest stay soft.
- **Tech strip** below the services (after a `border-top: 1px solid var(--border)`):
  - Label: `Working stack` mono caps with 32px hairline rule
  - 12 pills: `Java`, `Kotlin`, `Spring Boot`, `AWS`, `TypeScript`,
    `React`, `Python`, `SQL`, `DynamoDB`, `Docker`, `Terraform`, `CI/CD`
    - Pills: `var(--mono-tag-bg)` bg, mono 12px, 8px 14px padding
    - Hover: copper-soft bg, copper text, lift 1px
  - Below the pills, two depth lines (grid `110px 1fr`):
    - **AWS depth** label (mono 10px copper) + 26 services in soft Inter,
      separated by middle dots:
      `SQS · SNS · RDS · Lambda · S3 · CloudFront · API Gateway · EC2 · ECS · ELB · VPC · Route 53 · DynamoDB · EFS · EBS · Kinesis · EventBridge · CloudFormation · CloudWatch · CloudTrail · IAM · Cognito · Secrets Manager · KMS · SSM · CDK`
    - **Spring depth** label + 10 modules:
      `Boot · Cloud · Security · Data · JPA · MVC · WebFlux · AOP · Integration · Retry`

### 4. Case Studies preview (`CaseStudies.tsx`)

Reference: `<section class="section" id="work">`.

- Section header: `03. Case Studies`
- h2 "Selected work."
- Three case study previews. Each is an `<a>` linking to
  `/case-studies/{slug}/`:
  - Top-bottom: case-tag (mono copper caps), h3 title, description,
    case-meta-row (3 columns: Role / Client / Duration with mono labels),
    Outcome row (copper-bordered hairlines, top + bottom, with serif italic
    text), case-footer (tech tag pills + `read_case_study →` arrow as
    a small bordered pill)
  - Hover: card bg shifts to `var(--bg-elev)`, h3 turns copper, arrow
    pill becomes copper-bordered with copper-soft fill, slides 4px right
- The 3 example cases, with these exact slugs (matches Step 05 content):
  - `php-to-aws-migration`
  - `iot-power-grid`
  - `serverless-financial-monitor`
- Use placeholder data inline for now; Step 05 will wire this to MDX content.

### 5. Blog preview (`BlogPreview.tsx`)

Reference: `<section class="section" id="blog">`.

- Section header: `04. Blog`
- h2 "Notes from the field."
- Section lede
- "Recent" mono label with hairline below (border-bottom)
- 6 blog entry rows, each a 3-column grid (110px / 1fr / auto):
  - Left: date as `YYYY · MM · DD` in mono soft ink
  - Middle: h3 title (Inter 17px, weight 500, ink, 2-line clamp), then
    italic Instrument Serif 16px thesis (2-line clamp)
  - Right: read time + arrow in mono cluster, padding-top 5px to align
- Hover: row slides 12px right, title + arrow turn copper
- Use placeholder data inline. Step 05 wires to MDX.
- Below the list: `All posts → archive` link in mono copper caps, links to `/blog`
- Mobile: simplify to 1-column grid, hide read time, keep arrow

### 6. Contact (`Contact.tsx`)

Reference: `<section class="section" id="contact">`.

- Section header: `05. Contact`
- h2 "Let's talk."
- Section lede
- **Prominent calendar block at the top of the section:**
  - Full-width card: 6px copper stripe on the left edge (full height),
    bg `var(--bg-elev)`, 1px border, 8px radius, 28px 32px padding,
    grid `6px 1fr auto`
  - Body has stacked items: `FAST PATH` mono copper eyebrow, large
    Instrument Serif title `Book a 15-minute intro call`, meta line in
    Inter `Pick a time that works · Cal.com · EU-hosted · No agenda required`
  - Right side: a navy pill button `Book now →`
  - Hover (whole card): copper border, copper-soft bg, lift 1px, shadow,
    title turns copper, button transitions navy → copper
  - Links to `https://cal.com/grzegorz-karolak/15min` (placeholder URL —
    user will replace) with `target="_blank" rel="noopener noreferrer"`
  - Mobile: collapses to 2-col `5px 1fr`, button drops below body
- **`OR — WRITE A MESSAGE` divider:**
  - Two thin hairlines flanking small mono caps text in soft ink
- **Two-column form area** (1fr / 240px):
  - Form (left): name, email, company (optional), message (textarea, 140px
    min height). Each field has a mono caps label above. Submit button
    `Send message →` styled like the navy pill button.
  - Form `onSubmit` for now: prevent default + show alert
    "Prototype — wire this to Lambda in Step 07."
  - Sidebar (right): bg-elev card with 6 rows: Email, LinkedIn, Based in,
    Working hours (Mon–Fri · 09:00 – 18:00 CET), Languages
    (English · Polish, Working with German clients), Response time
    (Within 2 working days · Or book a call directly →)
- Mobile: form + sidebar stack vertically

### 7. Wire it up

`app/app/page.tsx`:

```tsx
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import CaseStudies from '@/components/sections/CaseStudies'
import BlogPreview from '@/components/sections/BlogPreview'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <CaseStudies />
      <BlogPreview />
      <Contact />
    </main>
  )
}
```

Each section has `id="..."` matching the page map (`#about`, `#services`,
`#work`, `#blog`, `#contact`) so anchor links from the nav work.

### 8. Reveal animations

In a small `useReveal()` hook (`app/lib/useReveal.ts`):

- `IntersectionObserver` with threshold 0.12, rootMargin `0px 0px -40px 0px`
- On intersect: add `.visible` class, stagger via inline `transitionDelay`
  computed from the element's index among siblings (max 0.3s)

Apply by adding `className="reveal"` to elements that should fade in.

## Acceptance criteria

- [ ] `/` renders all six sections matching the mockup, light and dark mode
- [ ] Hero spec block visible above 1180px, hidden below
- [ ] All anchor links from the nav (`#about`, `#services`, `#work`, `#blog`,
  `#contact`) scroll smoothly to the right section
- [ ] Reveal animations fire as you scroll
- [ ] Hover states work on: case study cards, blog entries, AWS badges,
  service blocks, calendar block
- [ ] Mobile: hero CTAs stack, AWS badges stack, case study meta wraps,
  blog entries reflow to 1-col grid, contact form + sidebar stack
- [ ] Theme toggle works without flicker; all section colors update correctly
- [ ] Submit on contact form shows the placeholder alert (Step 07 wires it)

Commit with message: `feat(home): six-section homepage with reveal animations`.
