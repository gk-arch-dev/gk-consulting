# Architecture & Design Decisions

This is the north-star document for the GK Consulting site. It captures
**why** the project is built the way it is, so that decisions stay coherent
across steps and contributors. Read this before making structural changes.

---

## 1. Positioning

**Practice:** GK Consulting — a solo consulting practice operated by
Grzegorz Karolak, a Java & AWS architect based in Poland.

**Target buyer:** Engineering leadership (CTO, VP Engineering, Head of
Engineering) at mid-market companies in DACH (Germany, Austria, Switzerland)
and broader EU. Decision-makers who allocate budgets in the
€20k–€200k range for technical engagements.

**What's sold:** Three productized service shapes, in order of frequency:

1. **Modernization** — incremental migration of legacy systems to
   cloud-native architectures on AWS, using the Strangler Fig pattern
2. **Greenfield** — designing and building new backend systems on AWS
   from scratch
3. **Embedded Tech Lead** — joining a client's team for 2–6 months as
   architect or tech lead

**What's NOT sold:** Body-shopping, generic "AWS consulting," prescriptive
methodologies, training-only engagements, MVP-in-two-weeks.

**Trust signals (in priority order):**

1. AWS Solutions Architect Professional + Associate certifications
2. Industry breadth (fintech, real estate, medtech, industrial IoT)
3. Concrete case-study outcomes with named industries
4. Long-form writing demonstrating architectural thinking

**Anti-trust signals deliberately avoided:** logo walls, fake testimonials,
"X+ years of experience," buzzword positioning, prescriptive frameworks,
methodology trademarks.

---

## 2. Voice and editorial tone

The site reads as if **a senior engineer wrote it for other senior
engineers**, not as if a marketer wrote it for a buyer.

**Apply across the site:**

- First person singular ("I", never "we")
- Direct nouns, not metaphors. "Architecture" not "deep dive into the heart
  of architecture."
- Concrete numbers when defensible. Never inflated.
- Trade-offs acknowledged explicitly, not hidden
- One short, opinionated thesis per page or post — not multiple competing
  pitches

**Avoid:**

- Passive voice ("solutions are delivered")
- Modal helpers when not needed ("we can help you to ...")
- Triple-stacked adjectives ("scalable, resilient, performant")
- Stock phrases ("at the end of the day", "leveraging synergies", "deep
  expertise", "thought leadership")
- Em-dashes used as emotional emphasis (use them for clauses only)

**Calibration anchor:** if you wouldn't say it to a CTO in a 15-minute
discovery call without sounding like a deck, don't write it on the site.

---

## 3. Design system

### Palette

The site is grounded in a **warm-paper / deep-navy** palette with a
**copper** accent. Two themes (light + dark) with persisted user preference
that respects OS preference on first visit.

**Light theme tokens:**

| Token              | Value                          | Use                       |
| ------------------ | ------------------------------ | ------------------------- |
| `--bg`             | `#f5f2eb`                      | Page background           |
| `--bg-elev`        | `#fbf9f3`                      | Cards, elevated surfaces  |
| `--ink`            | `#0b1222`                      | Primary text, headings    |
| `--ink-muted`      | `#4a5566`                      | Body prose                |
| `--ink-soft`       | `#7a8294`                      | Captions, soft labels     |
| `--border`         | `#e3ddd0`                      | Section dividers          |
| `--border-strong`  | `#c9c2b1`                      | Emphasized borders        |
| `--accent`         | `#b87333`                      | Copper — links, accents   |
| `--accent-hover`   | `#9c5e24`                      | Hover state               |
| `--accent-soft`    | `rgba(184, 115, 51, 0.1)`      | Soft fills, hover bg      |
| `--mono-tag-bg`    | `#ebe6d8`                      | Tag pill background       |
| `--mono-tag-ink`   | `#3d4658`                      | Tag pill text             |

Dark theme uses parallel tokens with deep navy background and slightly
warmer copper accent (`#d49760`). Full token table in `app/styles/tokens.css`.

### Typography

Three typefaces, each with a single role:

| Family               | Use                                               |
| -------------------- | ------------------------------------------------- |
| **Instrument Serif** | Headings (h1–h3), pullquotes, italic accents      |
| **Inter**            | Body prose, captions, UI text                     |
| **JetBrains Mono**   | Labels, tags, dates, code, navigation             |

The italic Instrument Serif in copper (`<em>` inside `<h1>`) is the
**signature gesture**. It appears on the homepage hero, case study heroes,
and blog archive hero — always on the last word or two of the headline.

### Layout

- **Spine width:** 920px max, 32px horizontal padding (24px on mobile,
  20px below 380px). All content uses this spine.
- **No card grids.** Editorial single-column layout from top to bottom.
- **Section numbering:** `01.` `02.` `03.` style with copper number,
  40px copper rule, then mono caps section label.
- **Reveal animations:** subtle fade-up on scroll via `IntersectionObserver`,
  staggered max 0.3s.
- **Paper texture:** subtle SVG noise overlay, multiply blend in light,
  overlay blend in dark.

### Why this aesthetic

DACH technical buyers respond to **document-feel sites that signal
seriousness**, not marketing-funnel sites optimized for conversion.
Single-column editorial layout, generous whitespace, hairline rules, and
restrained color use signal *engineering rigor* rather than *sales energy*.

This is also the opposite of what most freelance AWS architect sites look
like (dark mode, neon green, AWS icon collages, "scale your business
infinitely" copy). Differentiation is the secondary benefit.

---

## 4. Information architecture

See `page-map.md` for the full route inventory. The high-level structure:

```
/                              Homepage — hero + 5 sections (single-page summary)
├── /case-studies              Archive of case studies, filtered by engagement type
│   └── /case-studies/{slug}   Individual case study (template: simple)
├── /blog                      Blog archive, filtered by tag, no year grouping
│   └── /blog/{slug}           Individual blog post with TOC
├── /impressum                 Legal (DACH compliance)
└── /datenschutz               Privacy (DACH compliance)
```

**No `/about` page.** The About section lives on the homepage. Adding a
separate About page is a common consultant-site mistake — it forces buyers
through more clicks for information that should be available on first
load.

**No `/services` page.** Same reasoning — Services live on the homepage.

**No `/contact` page.** Contact is the final section on the homepage, with
both a calendar booking link (Cal.com EU, 15-min) and a form.

---

## 5. Content strategy

### Case studies

- **3–8 case studies** is the sweet spot. Fewer feels thin; more feels
  unfocused.
- Each case study has **one outcome metric** — the headline number that
  appears in the archive (e.g. "200K+", "99.95%", "<€200/mo"). This is
  the single most important visual element on the page.
- Case studies are **redactable**. If a client doesn't allow naming, the
  industry + outcome metric is enough. The "Not shown here" block on the
  archive page acknowledges NDA work explicitly.
- Every case study has **at least one honest reflection** — a sentence
  about what would be done differently. This is unusual on consulting
  sites and is the strongest trust signal.

### Blog posts

- **Long-form, ~1500–3000 words.** Sub-1000-word posts on this site
  signal "marketing content"; long-form signals "actually thought about
  this".
- **One post every two weeks** is the cadence target. Don't ship faster
  unless quality holds.
- **Multiple tags per post** — most architectural topics belong to 2–3
  buckets.
- **Code blocks with real syntax highlighting**, not styled text.
- **No comments.** DACH technical readers email when they have something
  to say. Comments duplicate channels and invite low-signal noise.

### Voice consistency check

For both case studies and blog posts: if the opening paragraph could be
swapped between an article on the Pragmatic Engineer blog and this site
without anyone noticing, the voice is right. If it sounds like a consulting
deck — rewrite.

---

## 6. Tech stack rationale

### Frontend: Next.js (latest LTS) with `output: 'export'`

**Why Next.js, not plain React?** SEO and link previews. The site needs
fully-rendered HTML on first load so crawlers (Google, LinkedIn preview,
Slack, etc.) see real content, not a skeleton waiting for JS.

**Why static export, not SSR?** The hosting target is S3 + CloudFront —
a static file host. Static export produces `.html` files at build time;
no server runs at request time. Cheaper, faster, simpler.

**Why not Astro / 11ty / Hugo?** Future-proofing. We may want client-side
interactivity (filter pills, theme toggle, contact form) and Next.js
handles the gradient from static to dynamic without a framework switch.

### Styling: Plain CSS with design tokens

**Why no Tailwind?** The mockups use semantic classes (`.case-hero`,
`.outcome-metric`) and CSS custom properties for theme switching. Tailwind
would force us to either (a) extend with arbitrary values everywhere,
(b) define equivalent design tokens twice. The cost of a custom CSS layer
is small for a 5-page site.

**Why no CSS-in-JS?** No runtime cost, no hydration mismatch, no learning
surface. CSS modules + global tokens does everything we need.

### Content: MDX with frontmatter

**Why MDX, not just Markdown?** A few blog posts use custom components
(`<Note>`, `<Pullquote>`, `<TradeOff>`). MDX lets us drop them inline
without escaping. Pure markdown can't.

**Why files in the repo, not a CMS?** Single source of truth. Version
control. No third-party runtime dependency. Deployment is `git push`.

### Backend: Lambda (Python latest LTS) + SES

**Why Python, not Node?** The frontend already uses Node. Splitting the
runtime forces clearer separation between site and backend. Python's
standard library is also slightly better for the tiny "validate-and-send"
shape of the contact handler.

**Why SES?** AWS-native, cheap (~free at our volume), and integrates with
the same DNS we already manage in Route 53.

### Infrastructure: AWS CDK (TypeScript)

**Why CDK, not Terraform?** TypeScript matches the rest of the project,
no separate language to maintain. CDK's higher-level constructs cover
S3 + CloudFront + WAF cleanly.

**Why a single repo for site + infra + backend?** Three packages that
deploy together belong together. A monorepo of three folders is simpler
than three repos that need to be coordinated.

### Spam protection: AWS WAF

User explicitly chose WAF over honeypot/Turnstile. WAF gives us:

- AWS-native, no third-party dependency
- Managed rule sets that update automatically
- Geographic blocking (EU + selected English-speaking countries)
- Rate limiting per IP
- Request inspection without leaking data to a third-party service

The trade-off is cost (~$5/month minimum) and complexity in CDK.
Acceptable.

### Analytics: none (deliberate)

User chose to skip analytics for now. The site can ship without them.
If added later: **Plausible (EU-hosted) is the right pick** — GDPR-clean,
no cookie banner needed, doesn't undermine the privacy-first positioning.

### Comments: none

Discussed and decided against. DACH technical readers email when they
have something to say. The trust-cost of moderating a comment section
exceeds the value of the substantive replies it generates.

---

## 7. SEO and link previews

The site needs to perform well on:

- **Google search** for queries like "AWS migration consultant DACH",
  "Java AWS architect Europe", "Strangler Fig pattern in practice"
- **LinkedIn link previews** — primary client acquisition channel
- **Slack / Discord previews** — when CTOs share posts internally

Implementation:

- Pre-rendered HTML on every route (static export gives this for free)
- Per-page metadata via Next.js `metadata` API
- Open Graph images generated at build time (1200×630 PNG per page)
- Twitter Card metadata
- JSON-LD structured data:
  - Homepage: `Person` + `ProfessionalService` + `WebSite`
  - Blog posts: `TechArticle`
  - Case studies: `Article`
- Canonical URLs on every page
- Sitemap auto-generated from MDX content
- robots.txt allowing all, referencing the sitemap
- `theme-color` meta for browser chrome theming

OG image template: navy background, Instrument Serif title in cream,
copper accent on last word, blueprint grid texture. Generated dynamically
per page via Next.js `opengraph-image.tsx`.

---

## 8. Performance budget

- Lighthouse Performance score ≥ 90 on every page
- LCP < 2.5s on a slow 4G connection
- CLS < 0.1
- Total page weight < 200KB compressed for the homepage
- Self-hosted fonts via `next/font/google` (no third-party blocking)
- No client-side JS frameworks beyond React itself
- No analytics scripts (currently)

The mockups already meet this budget. Don't add dependencies that
would put it at risk.

---

## 9. Accessibility

- WCAG AA contrast ratios on all text (verified for both themes)
- `:focus-visible` outline on every interactive element (copper, 2px
  offset)
- Keyboard navigation works on every page (test by tabbing through)
- aria-labels on icon-only buttons
- aria-expanded toggling on the mobile menu
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Heading hierarchy is correct (no skipped levels)
- `alt` text on all images (especially the AWS badges)
- Color is never the only signal (e.g. error states have text + color,
  not just color)
- Reduced motion: animations respect `prefers-reduced-motion`

---

## 10. What this site is not

- **Not a portfolio.** A portfolio is "look at all the things I've made."
  This is "here are 3-4 carefully chosen engagements with concrete outcomes."
- **Not a content-marketing funnel.** No newsletter signup, no lead
  magnets, no exit-intent popups, no retargeting pixels.
- **Not a productized-service storefront.** No pricing tiers, no
  "Book Now" buttons next to packages. Engagements are scoped on a call.
- **Not a personal brand site.** First person, but the brand is
  GK Consulting, not "Greg." The wordmark, footer, and Impressum reflect
  this.

If a proposed change pushes the site toward any of those four shapes,
push back before implementing.
