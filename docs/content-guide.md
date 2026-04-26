# Content Guide

How to add new content to the site. Read this when you sit down to write
a new blog post or case study.

---

## File locations

```
content/
├── blog/                                          # Blog posts
│   ├── 2026-03-18-strangler-fig-in-practice.mdx
│   ├── 2026-02-24-api-gateway-authorization.mdx
│   └── ...
└── case-studies/                                  # Case studies
    ├── php-to-aws-migration.mdx
    ├── iot-power-grid.mdx
    └── ...
```

**File naming:**

- **Blog posts:** `YYYY-MM-DD-{slug}.mdx`. The date prefix is for sorting
  in the file system; the **URL slug comes from frontmatter**, not the
  filename. So a file dated 2026-03-18 with slug `strangler-fig-in-practice`
  becomes `/blog/strangler-fig-in-practice/`, not `/blog/2026-03-18-...`.
- **Case studies:** `{slug}.mdx`. No date prefix because case studies are
  rare; sorting by frontmatter `year` is fine.

Slugs are kebab-case, lowercase, ASCII only. No emoji, no umlauts in URLs.

---

## Adding a blog post

### 1. Create the file

Pick a date and a slug. Filename: `content/blog/YYYY-MM-DD-{slug}.mdx`.

### 2. Write frontmatter

```yaml
---
title: "Strangler Fig in Practice: Lessons from a Real Migration"
slug: "strangler-fig-in-practice"
date: "2026-03-18"
tags: ["modernization", "architecture"]
thesis: "Why most strangler-fig projects stall at 60% — and how to plan around it from day one."
description: "A field report from an 18-month PHP-to-AWS migration."
draft: false
---
```

**Field reference:**

| Field          | Required | Description                                                                |
| -------------- | -------- | -------------------------------------------------------------------------- |
| `title`        | yes      | The post title. Will appear in `<h1>`, `<title>`, og:title.                |
| `slug`         | yes      | URL slug. Should match the slug part of the filename.                      |
| `date`         | yes      | ISO `YYYY-MM-DD`. Used for sorting and the rendered date.                  |
| `tags`         | yes      | Array of tag slugs. See "tag conventions" below.                           |
| `thesis`       | yes      | One-sentence promise. Appears under the h1 and in the archive list.        |
| `description`  | yes      | Search-engine description (50–160 chars). Used for OG and meta.            |
| `draft`        | no       | `true` to hide in production. Useful for work-in-progress.                 |

**`readTime` is auto-computed** from word count using the `reading-time`
package. Don't set it manually.

### 3. Write the body

Below the frontmatter `---`, write standard markdown. MDX components
are available inline (see "MDX components" below).

### 4. Test locally

```
cd app && npm run dev
```

Visit `http://localhost:3000/blog/{your-slug}/`. Check:

- The post renders without errors
- Code blocks have syntax highlighting in both themes
- Headings appear in the TOC
- Images (if any) load
- Read time looks correct

### 5. Commit and push

```
git add content/blog/...
git commit -m "post: strangler fig in practice"
git push origin main
```

GitHub Actions builds and deploys. Live in ~5 minutes.

---

## Tag conventions

Tags are the categorical labels for blog posts. They drive the filter
pills on `/blog`.

**Current tag vocabulary:**

| Tag slug          | Display name           | Use for                                           |
| ----------------- | ---------------------- | ------------------------------------------------- |
| `modernization`   | Legacy Modernization   | Migration patterns, legacy systems, refactoring   |
| `aws`             | AWS                    | AWS-specific deep dives, service comparisons      |
| `architecture`    | Architecture           | Architectural decisions, system design            |
| `kotlin`          | Kotlin & JVM           | Kotlin, Spring, JVM-specific posts                |
| `serverless`      | Serverless             | Lambda, API Gateway, serverless patterns          |
| `practices`       | Practices              | Engineering practices, team patterns, processes   |

**Rules:**

- Most posts have **2–3 tags**. One tag is rare (usually means the post
  is too narrow); 4+ tags is rare (usually means the post is unfocused).
- Don't invent new tags casually. Adding a tag should be a deliberate
  decision — update this table when you do.
- Tag slugs are lowercase, kebab-case. Display names are in `app/lib/content.ts`
  (or wherever the tag-to-display mapping lives).

---

## Adding a case study

### 1. Create the file

Filename: `content/case-studies/{slug}.mdx`.

Slugs should be descriptive: `php-to-aws-migration`, not `case-1`.

### 2. Write frontmatter

```yaml
---
title: "Legacy PHP Monolith → Cloud-Native on AWS"
slug: "php-to-aws-migration"
year: 2024
engagement: "modernization"
industry: "Real Estate · DE"
role: "Architecture & Delivery Lead"
duration: "18 months"
team: "5 engineers"
tag: "Legacy Modernization · Real Estate · DE"
thesis: "Eighteen months. Two hundred thousand active users. A decade of accumulated PHP debt, modernized into a Kotlin platform on AWS without a single missed product release."
outcomeMetric: "200K+"
outcomeLabel: "users migrated · zero downtime"
stack: ["Kotlin", "Spring Boot", "AWS", "PostgreSQL", "React"]
metrics:
  - num: "200K+"
    label: "active users migrated without service interruption"
  - num: "0 minutes"
    label: "of unplanned downtime during the cutover window"
  - num: "~40%"
    label: "reduction in monthly infrastructure spend"
closingQuote: "A decade of accumulated PHP debt — paid down in eighteen months without missing a release."
description: "An 18-month migration of a 200K-user PHP monolith to a Kotlin & Spring Boot platform on AWS for a German real estate company."
---
```

**Field reference:**

| Field           | Required | Description                                                              |
| --------------- | -------- | ------------------------------------------------------------------------ |
| `title`         | yes      | The case study title.                                                    |
| `slug`          | yes      | URL slug.                                                                |
| `year`          | yes      | The year the engagement ended (or current year if ongoing).              |
| `engagement`    | yes      | One of: `greenfield`, `modernization`, `embedded`. Drives archive filter.|
| `industry`      | yes      | "Industry · Country" e.g. "Fintech · EU", "Real Estate · DE".            |
| `role`          | yes      | Your role. Use contribution language, not job title — see below.         |
| `duration`      | yes      | E.g. "18 months", "4 months".                                            |
| `team`          | yes      | E.g. "5 engineers", "Solo Delivery".                                     |
| `tag`           | yes      | The case-tag pill text on the detail hero.                               |
| `thesis`        | yes      | One-paragraph italic-serif sentence summarizing the engagement.          |
| `outcomeMetric` | yes      | Headline number for the archive (e.g. "200K+", "99.95%", "<€200/mo").    |
| `outcomeLabel`  | yes      | One-line caption under the headline number on the archive.              |
| `stack`         | yes      | Array of tech pills, ordered by importance.                              |
| `metrics`       | yes      | 3 detailed metrics for the outcome strip on the detail page.             |
| `closingQuote`  | no       | The italic centered closing pullquote. If absent, no closing.            |
| `description`   | yes      | Search/OG description.                                                   |

### Role naming convention

**Don't use job titles.** "Senior Software Engineer" describes a contract,
not a contribution.

**Use contribution language:**

- ✅ "Architecture & Delivery Lead"
- ✅ "Backend Architect"
- ✅ "Solo Architect & Builder"
- ✅ "Embedded Tech Lead"
- ❌ "Senior Software Engineer"
- ❌ "Lead Developer"
- ❌ "Consultant"

This also keeps roles consistent across case studies — readers don't
silently rank you by title.

### 3. Write the body

The case study body is **3 paragraphs of markdown** matching the "story"
section pattern from
`docs/mockups/gk-consulting-case-study-simple-php-aws.html`:

- **Para 1:** the situation (what kind of company, why they engaged,
  what was hurting)
- **Para 2:** the approach (named pattern + 2-3 key decisions, folded
  inline as bolded phrases)
- **Para 3:** what shipped + one honest reflection sentence ending in
  `<em>` italic copper

Keep it tight. Total word count: 250–400 words. The detail page is
**not** a long-form essay — it's a structured story.

### 4. Test, commit, push

Same as blog posts.

---

## MDX components

Available inside any `.mdx` file:

### `<Note>`

```mdx
<Note>
Don't confuse the Strangler Fig pattern with Branch by Abstraction.
They look similar on a whiteboard but solve different problems.
</Note>
```

Renders as: copper-left-bordered callout box on `var(--bg-elev)`
background, "NOTE" label in mono caps copper, content in slightly
smaller body text.

### `<TradeOff>`

```mdx
<TradeOff>
The strangler fig pattern shines for monoliths that are organisationally
impossible to freeze. Its cost is real engineering complexity. Pick it
when the alternative is worse, not because the pattern is fashionable.
</TradeOff>
```

Same shape as `<Note>` but with "TRADE-OFF" label. Use this when calling
out an explicit cost-benefit trade.

### `<Pullquote>`

```mdx
<Pullquote>
Boundaries that aren't enforced in code aren't boundaries — they're aspirations.
</Pullquote>
```

Renders as: large centered Instrument Serif italic, copper hairlines top
and bottom. Use sparingly — once per post, max twice. The pullquote is a
typographic signal that *this is the memorable line*. If you have two,
neither will be.

---

## Code blocks

Standard markdown fenced code blocks with language hints:

````mdx
```kotlin
sealed class LeadIntakeEvent {
    abstract val leadId: LeadId
    abstract val occurredAt: Instant
}
```
````

The build pipeline (Shiki via rehype-pretty-code) handles syntax
highlighting in both themes. The corner language label is added
automatically from the language hint.

**Supported languages** (most common):

- `typescript`, `javascript`, `tsx`, `jsx`
- `kotlin`, `java`
- `python`
- `bash`, `sh`
- `sql`
- `yaml`, `json`, `toml`
- `dockerfile`, `nginx`
- `hcl` (Terraform)
- `mdx`, `markdown`

If you use a language not in Shiki's default bundle, the build will
warn — install the grammar or use `text` for plain.

**Inline code** is handled automatically: `` `like this` `` renders in
the mono-tag-bg color used elsewhere on the site.

---

## Images in posts

Place images in `public/images/blog/{post-slug}/{image-name}.{ext}`.

Reference in MDX:

```mdx
![Alt text describing the image](/images/blog/strangler-fig-in-practice/architecture.svg)
```

For figures with captions, use the markdown image inside an HTML
`<figure>`:

```mdx
<figure>
  ![Architecture before and after migration](/images/blog/.../arch.svg)
  <figcaption>
    Before and after the strangler-fig migration.
  </figcaption>
</figure>
```

The `.prose figure` styles handle the rest (background, border, caption
styling).

**Image format guidance:**

- Diagrams: SVG preferred (scalable, theme-aware if you use CSS variables
  for colors, smaller file size)
- Photos: WebP at 1600px max width
- Screenshots: PNG, with 2x density if for retina (use `width="800"` to
  display at half native size)

Always include alt text. It's an accessibility requirement and helps
SEO.

---

## Drafting workflow

Use `draft: true` in frontmatter to hide a post in production while you
work on it:

```yaml
---
title: "Work in progress"
draft: true
---
```

Drafts:

- Don't appear on `/blog`
- Don't appear in the homepage blog preview
- Don't generate OG images
- Are not in the sitemap

Drafts **do** render in dev mode (`npm run dev`) so you can preview them.

When ready to publish, delete the `draft` field (or set to `false`),
update the date if needed, commit, and push.

---

## Editorial checklist before publishing

For blog posts:

- [ ] Title is specific and promises something (not "Some thoughts on X")
- [ ] Thesis is one sentence and makes a claim
- [ ] First paragraph is the strongest hook in the post
- [ ] At least one trade-off is acknowledged explicitly
- [ ] No buzzwords, no metaphors that don't earn their keep
- [ ] Code examples actually compile (or are clearly pseudocode)
- [ ] Headings tell the story (someone reading only h2/h3 should understand
      the argument)
- [ ] Read time feels right (target 7–14 min for substantive posts)
- [ ] Tags are 2–3, not 1 or 5

For case studies:

- [ ] One outcome metric earns the headline position
- [ ] Industry is named (or NDA-redacted with the soft hint)
- [ ] At least one honest reflection is in para 3
- [ ] Stack list is curated (not 30 items)
- [ ] No client name unless explicit permission
- [ ] Engagement type matches the actual work shape

---

## Common mistakes to avoid

- **Long titles.** Target ~70 characters max. The 2-line clamp on the
  archive page will truncate longer titles.
- **Theses that describe the topic instead of the takeaway.** "A look at
  AWS Lambda cold starts" is the topic. "Why provisioned concurrency is
  rarely worth it" is the takeaway. Always write the takeaway.
- **Multiple competing arguments in one post.** If a post has two
  claims, it's two posts.
- **Code blocks without language hints.** No language = no highlighting,
  no language label.
- **Images without alt text.** Accessibility regression and SEO loss.
- **Skipping the closing reflection in case studies.** It's the strongest
  trust signal on the page. Don't sanitize the case study.
