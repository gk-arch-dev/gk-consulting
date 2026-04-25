# Step 05 — MDX content layer + blog & case studies pages

> Paste this entire prompt as one message into Claude Code.

---

## Context

You've completed Steps 01–04. Now wire the content layer. Blog posts and case
studies become MDX files in `content/`, rendered as static HTML at build time.

**Read first:**

- `docs/content-guide.md` — frontmatter spec for blog posts and case studies
- `docs/mockups/gk-consulting-blog-archive.html` — `/blog` archive page
- `docs/mockups/gk-consulting-blog-post-template.html` — single blog post page
- `docs/mockups/gk-consulting-case-studies-archive.html` — `/case-studies`
  archive page
- `docs/mockups/gk-consulting-case-study-simple-php-aws.html` — single case
  study page (the **simple** template — this is the primary one)
- `docs/page-map.md` — confirm slugs and routing

The richer case study mockup (`gk-consulting-case-study-php-aws.html`) is
**not** built in this step. The simple template is the default for all
case studies.

## What to do

### 1. Install dependencies

In `app/`, install (latest LTS-compatible versions):

- `gray-matter` — frontmatter parsing
- `next-mdx-remote` — MDX rendering for App Router with static export
  (or `@next/mdx` if Claude Code judges it cleaner — pick one and stay
  consistent; `next-mdx-remote` works better with our directory layout
  outside `app/`)
- `rehype-slug` — adds id="..." to headings for anchor links
- `rehype-pretty-code` — syntax highlighting via Shiki at build time
- `shiki` — the highlighter
- `remark-gfm` — GitHub-flavored markdown (tables, strikethrough)
- `reading-time` — auto-compute reading time from post content

### 2. Content reading library

Create `app/lib/content.ts`:

```ts
export type BlogPost = {
  slug: string
  title: string
  date: string           // ISO YYYY-MM-DD
  tags: string[]         // multiple per post
  thesis: string
  description: string
  readTime: string       // computed
  draft?: boolean
  content: string        // raw MDX
}

export type CaseStudy = {
  slug: string
  title: string
  year: number
  engagement: 'greenfield' | 'modernization' | 'embedded'
  industry: string
  role: string
  duration: string
  team: string
  tag: string
  thesis: string
  outcomeMetric: string  // headline number for archive page
  outcomeLabel: string
  stack: string[]
  metrics: { num: string; label: string }[]
  closingQuote?: string
  content: string        // raw MDX
}
```

Functions:

- `getAllBlogPosts(): BlogPost[]` — reads `content/blog/*.mdx`, parses
  frontmatter via gray-matter, computes readTime via `reading-time`,
  filters out drafts in production, sorts by date desc
- `getBlogPost(slug: string): BlogPost | null`
- `getAllTags(): { tag: string; count: number; slug: string }[]` — derives
  unique tags across non-draft posts. The slug is a lowercased,
  hyphenated version (e.g. `Legacy Modernization` → `legacy-modernization`)
- `getAllCaseStudies(): CaseStudy[]` — reads `content/case-studies/*.mdx`,
  sorted by year desc
- `getCaseStudy(slug: string): CaseStudy | null`

These run at build time only (server side). Don't expose to client bundles.

### 3. MDX components

Create `app/components/mdx/`:

- `Note.tsx` — copper-left-bordered callout, "NOTE" mono caps label.
  Uses `var(--bg-elev)`, 3px copper left border, 4px radius.
- `TradeOff.tsx` — same as Note but "TRADE-OFF" label
- `Pullquote.tsx` — large centered serif italic, copper hairlines top
  and bottom (matching the blog-post-template mockup)
- `CodeBlock.tsx` — wraps `<pre>` with `data-lang` attribute so the corner
  language label can render. Used by the rehype-pretty-code pipeline.

Export them as a `mdxComponents` object that can be passed to MDX:

```ts
export const mdxComponents = {
  Note,
  TradeOff,
  Pullquote,
  // h2, h3, code, pre, ul, ol, blockquote etc. inherit prose styling
  // from the surrounding .prose container
}
```

### 4. Blog archive page

Replace `app/app/blog/page.tsx` with the full archive.

Reference: `docs/mockups/gk-consulting-blog-archive.html`.

Structure:

- Hero: `Archive` eyebrow, h1 `The blog.` (with italic copper "blog."),
  italic serif lede, meta strip `{N} posts · Updated {latest date}`
- Filter pills row: `All ({total})` plus one pill per unique tag from
  `getAllTags()`, each with a count
  - The `All` pill is active by default
  - Filtering is client-side: each entry has `data-tags="tag1 tag2"` and
    a small vanilla-JS click handler toggles `.hidden` on non-matching
    entries
- Flat list of posts (no year grouping). Each entry:
  - Date: full `YYYY · MM · DD`
  - Middle column: title (2-line clamp), italic serif thesis (2-line clamp),
    multi-tag row with copper dot separators
  - Right column: read time + arrow
  - Hover: slide 12px right, title + arrow turn copper
- Empty state: italic serif soft-ink "No posts in this topic — yet." that
  appears when filtering hides all entries
- CTA strip at the bottom: "Want to discuss something I wrote? / Book a 15-min call."
- **No RSS feed, no newsletter signup**

### 5. Single blog post page

Replace `app/app/blog/[slug]/page.tsx`.

Reference: `docs/mockups/gk-consulting-blog-post-template.html`.

Implementation notes:

- `generateStaticParams()` returns all post slugs from `getAllBlogPosts()`
- `generateMetadata()` builds per-post metadata from frontmatter
  (Step 06 expands this further)
- Layout: 2-column grid on ≥1100px (`minmax(0, 1fr) 220px`), single
  column below
- Left: `<article>` with breadcrumb, post tag, h1, italic thesis,
  author/date/read-time strip, then `.prose` wrapper containing the MDX
  body (rendered via `next-mdx-remote/rsc`'s `<MDXRemote>`)
- Right: sticky table of contents auto-built from h2/h3 headings in the
  post. Use rehype-slug to generate ids, then extract the heading
  structure during build (utility function in `app/lib/toc.ts`).
  TOC scrolls within itself if longer than viewport. Highlights
  active section using IntersectionObserver as the user scrolls.
- Code blocks: rehype-pretty-code with two themes (one for light, one
  for dark) that switch via the `data-theme` attribute. Use
  `theme: { light: 'github-light', dark: 'github-dark-dimmed' }` (or
  similar Shiki themes that match the warm-paper / deep-navy palette;
  Claude Code can pick the closest fit). The corner language label is
  driven by a `[data-lang]` attribute that rehype-pretty-code adds to
  the `<pre>`.
- After the article body:
  - **Author block:** GK avatar placeholder (copper italic "GK" in a
    circular gradient div), name, role (mono caps), 2-line bio,
    "Get in touch →" + "LinkedIn ↗" links
  - **Read next:** 2 most recent other posts, in the same row layout
    as the homepage blog preview (date / title / arrow)
  - **CTA strip:** contextual copy "Working through a migration? /
    Let's talk about your strangler." (the second line is generic;
    Claude Code can use a static copy for now)

### 6. Case studies archive

Replace `app/app/case-studies/page.tsx`.

Reference: `docs/mockups/gk-consulting-case-studies-archive.html`.

Structure:

- Hero: `Selected Work` eyebrow, h1 `Case studies.` (italic copper),
  italic serif lede, meta strip `{N} studies · Across {industries} industries · {first year}—{last year}`
- Filter pills: `All` / `Modernization` / `Greenfield` / `Embedded Tech Lead`
  with counts. Filter by `engagement` frontmatter.
- 3-column entry layout (`110px / 1fr / 200px`):
  - Left: serif year (28px) + small mono copper engagement type
  - Middle: title (Instrument Serif), italic thesis, comma-separated meta
    line (industry · stack · duration) with mono caps labels (Industry,
    Stack, Duration)
  - Right: outcome metric (italic copper Instrument Serif 28-36px) + label
    + `read_case →` arrow
- Hover: row slides 28px right, bg shifts to elev, title + arrow turn copper
- **"Not shown here" block** at the bottom: copper-left-bordered
  bg-elev card explaining redacted/NDA work. Use the exact copy from the
  mockup (italics for tone), then a subtle soft transition into the CTA
- CTA strip: "Have a similar problem? / Let's see if I can help."
- Mobile: 1-column stack with year + type side-by-side at top, outcome
  metric reflows below the meta as a horizontal row

### 7. Single case study page

Replace `app/app/case-studies/[slug]/page.tsx`.

Reference: `docs/mockups/gk-consulting-case-study-simple-php-aws.html`.

Sections in order:

1. Breadcrumb: `GK Consulting / Case Studies / {title}`
2. Case hero: case-tag, h1 (with italic copper "on AWS." or similar
   from frontmatter — use a regex to italicize the last 2-3 words if
   they match a pattern, or store explicitly in frontmatter as
   `titleAccent: "on AWS."`. Keep it simple — explicit field is fine.)
3. Italic thesis paragraph
4. Spec table (4 cols, `border-top` and `border-bottom` solid ink): Role,
   Client (industry), Duration, Team
5. Outcome strip: copper-bordered hairlines with 3 metrics from
   `frontmatter.metrics`
6. Story section: "The story" mono label + h2 "What we did." + 3 prose
   paragraphs (the MDX body — rendered via `<MDXRemote>`)
7. Stack section: pills strip
8. Closing pullquote (centered Instrument Serif italic) — pulled from
   `frontmatter.closingQuote`
9. CTA strip
10. Footer

`generateStaticParams()` returns all case study slugs.

### 8. Seed content

Create the MDX files. Frontmatter spec is in `docs/content-guide.md`.

**Blog posts** (in `content/blog/`):

The Strangler Fig post needs **real content** matching the blog-post
mockup so syntax highlighting + TOC + callouts can be verified visually.
Use the content from `docs/mockups/gk-consulting-blog-post-template.html`'s
`<article>` body. The other 5 posts can be 3-paragraph placeholders.

Files to create (titles and dates from the blog-archive mockup):

- `2026-03-18-strangler-fig-in-practice.mdx` — full content
- `2026-02-24-api-gateway-authorization.mdx` — placeholder
- `2026-02-06-event-driven-aws.mdx` — placeholder
- `2026-01-20-kotlin-over-java.mdx` — placeholder
- `2025-12-11-cdk-vs-terraform.mdx` — placeholder
- `2025-11-28-serverless-ceiling.mdx` — placeholder

Add older entries from the archive too if you want to populate the
filter counts realistically.

**Case studies** (in `content/case-studies/`):

Files matching the slugs used in the homepage and archive:

- `php-to-aws-migration.mdx` — full content from
  `docs/mockups/gk-consulting-case-study-simple-php-aws.html` (the 3
  story paragraphs)
- `iot-power-grid.mdx` — placeholder content
- `serverless-financial-monitor.mdx` — placeholder content
- `medtech-platform-rebuild.mdx` — placeholder content (4th case
  used in the archive page)

### 9. Rewire homepage previews

Update homepage components to read from MDX:

- `BlogPreview.tsx`: `getAllBlogPosts().slice(0, 6)` and render the rows
- `CaseStudies.tsx`: `getAllCaseStudies().slice(0, 3)` and render the previews

These become Server Components (no `'use client'`). Any interactive bits
(reveal animations) stay in their own small client wrappers.

## Acceptance criteria

- [ ] `/blog` renders the full archive matching the mockup
- [ ] Filter pills filter the list client-side without page reload
- [ ] Empty state shows when filter has no matches
- [ ] `/blog/strangler-fig-in-practice` renders the full post with:
  - TOC visible on right (≥1100px), hidden below
  - Active section highlighted in TOC as you scroll
  - Code blocks have syntax highlighting in both themes
  - `<Note>` and `<Pullquote>` components render correctly
  - Author block + Read next + CTA all present
- [ ] `/case-studies` renders the archive with 4 cases and "Not shown here"
  block
- [ ] `/case-studies/php-to-aws-migration` renders the case study with
  spec table, outcome, story, stack, closing
- [ ] Engagement filter on case studies archive works
- [ ] Adding a new MDX file (try a temp one) and running `npm run build`
  shows it in the relevant archive
- [ ] Homepage blog and case study sections now pull from MDX content
- [ ] No console errors

Commit with message: `feat(content): MDX layer, blog and case study pages`.
