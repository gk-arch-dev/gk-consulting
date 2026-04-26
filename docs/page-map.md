# Page Map

Every route on the site, what's on it, what it links to. This document
defines the **information architecture**. Adding a new top-level route
should be a deliberate decision documented here first.

---

## Route inventory

```
/                              Homepage
/case-studies                  Case studies archive
/case-studies/{slug}/          Single case study
/blog                          Blog archive
/blog/{slug}/                  Single blog post
/impressum                     Legal imprint (DACH compliance)
/datenschutz                   Privacy policy (DACH compliance)
/sitemap.xml                   Auto-generated
/robots.txt                    Auto-generated
/icon.svg                      Favicon
/apple-icon.png                iOS home screen icon
```

That's the entire site. **No /about, no /services, no /contact pages** —
those are sections of the homepage. No /pricing, no /testimonials, no
/process. Each absence is intentional.

Trailing slashes are present on all routes (`trailingSlash: true` in
next.config). This matches S3 directory-style URL conventions and
prevents redirect loops.

---

## `/` — Homepage

**Purpose:** Single-page summary of the practice. The page a CTO lands
on from a LinkedIn post or cold-email link.

**Sections (in scroll order):**

| Anchor       | Section          | Content                                                                                  |
| ------------ | ---------------- | ---------------------------------------------------------------------------------------- |
| (none)       | Hero             | Brand mark, eyebrow, h1, lede, two CTAs, right-edge spec block (≥1180px)                 |
| `#about`     | § 01 About       | Portrait, name, role, prose paragraphs, pullquote, AWS badges row                        |
| `#services`  | § 02 Services    | Three numbered service blocks + tech strip (12 pills + AWS depth + Spring depth)         |
| `#work`      | § 03 Case Studies| Section header + 3 case study previews (links to /case-studies/{slug}/)                  |
| `#blog`      | § 04 Blog        | Section header + 6 most recent blog posts + "All posts → archive" link to /blog          |
| `#contact`   | § 05 Contact     | Calendar block (Cal.com), OR divider, contact form + sidebar details card                |

**Internal links from homepage:**

- Nav: `/`, `/#about`, `/#services`, `/case-studies`, `/blog`, `/#contact`
- Hero CTAs: `/#contact` (primary), `/#work` (ghost)
- AWS badges: external links to Credly (target="_blank")
- Case study previews: `/case-studies/{slug}/` (3 of them)
- Blog "All posts" link: `/blog`
- Contact calendar block: external link to `https://cal.com/...`
- Contact form: POST to `${API_URL}/contact`

**Metadata:**

- title: "GK Consulting — Java & AWS Architect for European Companies"
- description: tag-line about backend systems on AWS for European leaders
- canonical: `https://gk-consulting.eu/`
- og:image: site default OG (navy, copper "GK Consulting" wordmark)
- JSON-LD: `Person` + `ProfessionalService` + `WebSite`

---

## `/case-studies` — Archive

**Purpose:** Full inventory of selected work. Where a CTO who's seriously
evaluating you spends time after the homepage.

**Layout:**

- Compact hero: `Selected Work` eyebrow, h1 `Case studies.`, italic
  thesis lede, meta strip (`{count} studies · Across {N} industries · {year range}`)
- Filter pills: `All` / `Modernization` / `Greenfield` / `Embedded Tech Lead`
  with counts
- Flat list of case studies, sorted by year descending
- "Not shown here" block at the bottom (NDA work acknowledgment)
- CTA strip: `Have a similar problem?` / `Let's see if I can help.`
- Footer

**Per-entry layout (3-column grid):**

- Left: serif year + small mono copper engagement type
- Middle: title (Instrument Serif), italic thesis, meta line
  (`Industry · Stack · Duration` with mono caps labels)
- Right: outcome metric (italic copper serif, 28-36px) + label + arrow

**Filter behavior:** client-side, instant, no page reload. Each entry
has `data-tags` matching the filter values.

**Internal links:**

- Each entry: `/case-studies/{slug}/`
- "Not shown here" block: no links (intentional — it's a soft prompt
  to use the CTA below)
- CTA: `/#contact`, `/`

**Metadata:**

- title: "Case Studies · GK Consulting"
- og:image: site default

---

## `/case-studies/{slug}/` — Single case study

**Purpose:** Tell the story of one engagement. Match `simple` template
in `docs/mockups/gk-consulting-case-study-simple-php-aws.html`.

**Sections in order:**

1. Breadcrumb: `GK Consulting / Case Studies / {title}`
2. Case hero:
   - Tag: industry + region (mono copper caps)
   - h1 with italic copper accent on last words
   - Italic serif thesis paragraph
   - Spec table (4 cols, ink hairlines top + bottom): Role, Client, Duration, Team
3. Outcome strip: copper-bordered, 3 metric rows from frontmatter
4. Story section (single h2 "What we did"):
   - 3 prose paragraphs from MDX body
5. Stack section: pills from frontmatter
6. Closing pullquote (centered, large Instrument Serif italic)
7. CTA strip: `Have a similar problem?` / `Let's talk about your migration.`
8. Footer

**Slugs in use:**

- `php-to-aws-migration`
- `iot-power-grid`
- `serverless-financial-monitor`
- `medtech-platform-rebuild`

**Metadata:**

- title: from frontmatter `title`
- description: from frontmatter `description` (or `thesis` if absent)
- og:image: per-case-study generated OG with title + outcome metric
- JSON-LD: `Article`

---

## `/blog` — Archive

**Purpose:** Long-form writing index. Where a reader who clicked through
from a LinkedIn post can browse other posts.

**Layout:**

- Compact hero: `Archive` eyebrow, h1 `The blog.`, italic lede about
  what's covered + cadence, meta strip (`{count} posts · Updated {latest date}`)
- Filter pills: `All` plus one pill per unique tag
  (e.g. Legacy Modernization, AWS, Architecture, Kotlin & JVM,
  Serverless, Practices) with counts
- Flat list of posts (no year grouping), sorted by date descending
- CTA strip: `Want to discuss something I wrote?` / `Book a 15-min call.`
- Footer

**Per-entry layout (3-column grid: 110px / 1fr / auto):**

- Left: full date `YYYY · MM · DD` in mono soft ink
- Middle: title (Inter 17px, 2-line clamp), italic Instrument Serif
  thesis (2-line clamp), tags row with copper dot separators
- Right: read time + arrow in mono cluster

**Filter behavior:** same as case studies archive.

**Empty state:** italic serif soft-ink "No posts in this topic — yet."

**No RSS, no newsletter, no comments.** Deliberate.

**Internal links:**

- Each entry: `/blog/{slug}/`
- CTA: `/#contact`, `/`

**Metadata:**

- title: "Blog · GK Consulting"

---

## `/blog/{slug}/` — Single blog post

**Purpose:** A long-form technical post. Match
`docs/mockups/gk-consulting-blog-post-template.html`.

**Layout (2 columns ≥1100px, 1 column below):**

- Left column (the article):
  - Breadcrumb: `GK Consulting / Blog / {title}`
  - Tag pill (mono copper caps)
  - h1 (no italic copper accent — clean serif)
  - Italic Instrument Serif thesis line
  - Author/date/read-time strip (hairline above and below)
  - `.prose` wrapper containing rendered MDX body
- Right column (sticky, ≥1100px only):
  - "On this page" mono caps label
  - Auto-generated TOC from h2/h3 headings
  - Active section highlighted as you scroll
- After article body:
  - Author block: avatar + name + role + 2-line bio + Get in touch / LinkedIn
  - "Read next" — 2 most recent other posts in the same row layout
  - CTA strip: contextual ("Working through a migration?")
- Footer

**MDX components available in posts:**

- `<Note>` — copper-left-bordered callout, "NOTE" label
- `<TradeOff>` — same shape, "TRADE-OFF" label
- `<Pullquote>` — large centered serif italic, copper hairlines

**Code blocks** use Shiki at build time, theme-aware, with corner language
label.

**Metadata:**

- title: from frontmatter `title`
- description: from frontmatter `description`
- canonical: `/blog/{slug}/`
- og:image: per-post generated (title + accent)
- JSON-LD: `TechArticle`
- og:type: `article`
- article:published_time: from frontmatter `date`
- article:tag: from frontmatter `tags`

---

## `/impressum` — Legal imprint

**Purpose:** German legal requirement (Telemediengesetz §5).
Non-negotiable for DACH B2B sites.

**Layout:** Simple — breadcrumb, h1 "Impressum", prose content with the
legally-required information:

- Verantwortlich (responsible person): Grzegorz Karolak
- Adresse (address): full postal address
- Kontakt: email, optional phone
- Berufsrechtliche Angaben (if applicable): regulatory body, registration
- Umsatzsteuer-Identifikationsnummer (VAT ID, if applicable)
- Streitschlichtung (dispute resolution): EU online platform link

**Metadata:**

- title: "Impressum · GK Consulting"
- robots: noindex (no SEO value)

---

## `/datenschutz` — Privacy policy

**Purpose:** GDPR + German data protection compliance.

**Layout:** Long-form prose covering:

- Verantwortlicher (data controller)
- Erhobene Daten (data collected): site visitor data, contact form data,
  cookies (none currently), analytics (none currently), CDN access logs
- Zwecke der Verarbeitung (purposes)
- Rechtsgrundlagen (legal bases under Art. 6 GDPR)
- Speicherdauer (retention)
- Empfänger (recipients): AWS as data processor
- Drittland-Übermittlung (international transfer): if any AWS region used
  outside EU — currently no
- Betroffenenrechte (data subject rights)
- Beschwerderecht (right to complain to supervisory authority)
- Externe Dienste (third-party services): Cal.com (booking), Credly
  (badges)

**Critical:** content must be reviewed by a German lawyer or use a
verified template (e.g. eRecht24, Datenschutz-Generator) before launch.
The Step 03 placeholder must be replaced with real legal content.

**Metadata:**

- title: "Datenschutz · GK Consulting"
- robots: noindex

---

## Routes deliberately NOT included

The following routes are common on consulting sites but are
**intentionally absent**:

| Missing route   | Why                                                                |
| --------------- | ------------------------------------------------------------------ |
| `/about`        | About lives on the homepage. Separating it forces extra clicks.    |
| `/services`     | Services live on the homepage.                                     |
| `/contact`      | Contact lives on the homepage.                                     |
| `/pricing`      | Engagements scoped on a call. No public pricing.                   |
| `/process`      | Methodology pages signal junior consultants.                       |
| `/testimonials` | Real testimonials embedded inline; no separate page.               |
| `/team`         | Solo practice — no team page.                                      |
| `/portfolio`    | "Portfolio" framing is wrong; "Case Studies" is the right framing. |
| `/clients`      | No logo wall.                                                      |
| `/resources`    | Blog posts cover this.                                             |
| `/faq`          | Anti-pattern — write better service descriptions instead.          |

If you find yourself wanting to add one of these, the answer is almost
always "improve the existing homepage section instead."

---

## URL conventions

- All routes have trailing slashes (`/blog/`, not `/blog`)
- Slugs are kebab-case lowercase
- Blog post slugs do **not** include the date (the date is in frontmatter,
  not the URL — keeps URLs stable if I republish)
- Case study slugs are descriptive (`php-to-aws-migration` not
  `case-1`)
- No `/blog/category/{tag}/` pages — filtering happens client-side on
  the archive

---

## Internal linking patterns

**From homepage:**

- Nav linking to anchors uses `/#about` style (relative to current page,
  but works from any page back to homepage)
- Section CTAs always link to `/#contact` (primary path) or back to a
  detail page

**From archive pages:**

- Entries link to detail pages
- CTAs link to `/#contact` and `/`

**From detail pages:**

- Breadcrumb back up to archive
- Author / footer links back to archive
- "Read next" linking to other detail pages
- CTA to `/#contact`

**Anti-pattern to avoid:** "related case studies" sections on case study
detail pages. With only 3-8 case studies, "related" becomes "all the
others" — clutter. The CTA back to the archive is enough.
