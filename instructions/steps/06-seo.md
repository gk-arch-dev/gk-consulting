# Step 06 — SEO: metadata, OG images, sitemap, structured data

> Paste this entire prompt as one message into Claude Code.

---

## Context

You've completed Steps 01–05. Now make the site search-engine-friendly and
shareable.

**Read first:**

- `docs/architecture.md` — section "SEO and link previews"
- `docs/page-map.md` — confirm canonical URLs for each page

## What to do

### 1. Per-page metadata

Use Next.js's `metadata` API (App Router). Each page exports either a
static `metadata` object or `generateMetadata()` for dynamic routes.

**Site defaults** (in `app/app/layout.tsx`):

```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gk-consulting.eu'),
  title: { default: 'GK Consulting', template: '%s · GK Consulting' },
  description: '...',
  authors: [{ name: 'Grzegorz Karolak' }],
  creator: 'Grzegorz Karolak',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1020' }
  ],
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: '/' },
  openGraph: { /* defaults */ },
  twitter: { card: 'summary_large_image' },
  icons: { /* see below */ }
}
```

**Per-page overrides:**

- `/` (homepage): use the title from the mockup head
- `/case-studies`: title "Case Studies", description from mockup
- `/case-studies/[slug]`: from frontmatter (title, description, dates)
- `/blog`: title "Blog", description
- `/blog/[slug]`: from frontmatter, with `openGraph.type: 'article'`
  and `article:published_time`, `article:tag` etc.
- `/impressum`, `/datenschutz`: simple titles, `robots: { index: false }`
  (Impressum doesn't need to rank)

For the dynamic routes (`[slug]`), use `generateMetadata({ params })`
to pull from `getBlogPost(slug)` / `getCaseStudy(slug)`.

### 2. Favicon (inline SVG)

Use the inline SVG favicon from the mockups (navy square, copper italic
"GK"). In Next.js App Router, `app/icon.tsx` (or `app/icon.svg`) is the
convention.

Create:

- `app/icon.svg` with the navy + copper "GK" mark
  ```xml
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="6" fill="#0b1222"/>
    <text x="16" y="22" font-family="Georgia,serif" font-size="18"
          font-style="italic" fill="#b87333" text-anchor="middle">GK</text>
  </svg>
  ```
- `app/apple-icon.svg` with a 180×180 variant (use the same content,
  scaled).

Next.js automatically exposes these at `/icon.svg` and `/apple-icon.png`.

### 3. Open Graph images

Generate dynamic OG images at build time.

In Next.js with `output: 'export'`, the `next/og` `ImageResponse` works
with the `opengraph-image.tsx` file convention because it produces static
PNG files at build.

Create:

- `app/opengraph-image.tsx` — site default OG (1200×630)
  - Navy background, copper "GK Consulting" wordmark in Instrument Serif,
    smaller copper subline "Java & AWS Architect", subtle blueprint grid
- `app/blog/[slug]/opengraph-image.tsx` — per-post OG
  - Same template, but the post title in big serif type, plus the
    italic-copper accent on the last word
  - Read frontmatter via `getBlogPost(params.slug)`
  - export `generateImageMetadata()` if you need multiple sizes
  - Don't over-complicate: ~80 lines of JSX is enough
- `app/case-studies/[slug]/opengraph-image.tsx` — per-case-study OG
  - Same template, case study title + outcome metric

**Font note:** OG image generation runs in a separate runtime; you may
need to provide font binaries. Bundle Instrument Serif and Inter from
`node_modules/@fontsource/...` or fetch from the Google Fonts API at
build time. Document the chosen approach inline.

### 4. Structured data (JSON-LD)

**Homepage** — inject these three blocks via a `<script type="application/ld+json">`
inside the homepage component (or root layout for site-wide):

- `Person` (Grzegorz Karolak) with: name, jobTitle, sameAs (LinkedIn),
  knowsAbout (skills array), hasCredential (the two AWS certs as
  `EducationalOccupationalCredential`)
- `ProfessionalService` for GK Consulting with: name, description,
  areaServed (DACH countries + EU), serviceType, founder reference
- `WebSite` with: url, name, description

The homepage mockup (`docs/mockups/gk-consulting-main.html`) has the
exact JSON-LD blocks already. Port them to React, with values made
dynamic where appropriate.

**Blog post pages** — `TechArticle` schema with: headline, description,
author, datePublished, datePublished, publisher.

**Case study pages** — `Article` schema (Schema.org has no `CaseStudy`
type; `Article` is the closest fit) with: headline, description, author,
datePublished, articleSection: 'Case Study'.

Render these via a small `<JsonLd data={...} />` component to keep the
markup clean.

### 5. Sitemap

Create `app/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { getAllBlogPosts, getAllCaseStudies } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gk-consulting.eu'
  const now = new Date()

  const staticPages = [
    { url: `${baseUrl}/`, lastModified: now, priority: 1.0 },
    { url: `${baseUrl}/case-studies/`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/blog/`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/impressum/`, lastModified: now, priority: 0.1 },
    { url: `${baseUrl}/datenschutz/`, lastModified: now, priority: 0.1 },
  ]

  const blog = getAllBlogPosts().map(p => ({
    url: `${baseUrl}/blog/${p.slug}/`,
    lastModified: new Date(p.date),
    priority: 0.7,
  }))

  const cases = getAllCaseStudies().map(c => ({
    url: `${baseUrl}/case-studies/${c.slug}/`,
    lastModified: new Date(`${c.year}-12-31`),
    priority: 0.8,
  }))

  return [...staticPages, ...blog, ...cases]
}
```

Next.js outputs this as `/sitemap.xml` at build.

### 6. robots.txt

Create `app/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gk-consulting.eu'
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### 7. Environment variable

Add to `app/.env.local.example`:

```
NEXT_PUBLIC_SITE_URL=https://gk-consulting.eu
```

Document in `docs/deployment.md` that this should be set in CI/CD to the
real production domain at build time.

## Acceptance criteria

- [ ] `view-source:` on each page shows correct, unique meta tags
- [ ] Each page has a unique `<title>` in the format `Page · GK Consulting`
- [ ] Open Graph tags are present and correct on every page
- [ ] OG images generate at build time (check `out/` for PNG files
  matching each route)
- [ ] Test OG preview at <https://opengraph.xyz/> after deploying (or use
  Facebook's debugger)
- [ ] Test rich result preview at
  <https://search.google.com/test/rich-results> for the homepage
  (Person + ProfessionalService should appear) and a blog post (TechArticle)
- [ ] `/sitemap.xml` lists all routes including dynamic ones
- [ ] `/robots.txt` references the sitemap
- [ ] Favicon shows correctly in browser tab and matches the mockup
- [ ] Apple touch icon shows correctly when site is added to iOS home screen

Commit with message: `feat(seo): metadata, OG images, sitemap, JSON-LD`.
