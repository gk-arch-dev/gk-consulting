# Step 03 — Site shell: nav, mobile menu, footer, route placeholders

> Paste this entire prompt as one message into Claude Code.

---

## Context

You've completed Steps 01 and 02. Now build the global shell components and
all route placeholders.

**Read first:**

- `docs/page-map.md` — every route, what it does, where it links
- `docs/mockups/gk-consulting-main.html` — `<nav>`, `<div class="mobile-menu">`,
  `<footer>` blocks
- `docs/architecture.md` — section "Voice" (for the small placeholder copy
  on the Impressum / Datenschutz pages)

## What to do

### 1. Nav component

Create `app/components/Nav.tsx`:

- Fixed at top, `z-index: 100`, padding 18px 28px
- Translucent background: `color-mix(in srgb, var(--bg) 82%, transparent)`
  with `backdrop-filter: saturate(1.4) blur(14px)`
- Inner: max-width 1160px, flex space-between, gap 24px
- **Logo (left):** "GK Consulting" in Instrument Serif 22px + a small
  `/gk` mark in JetBrains Mono 11px copper, transform translateY(-2px).
  Links to `/`.
- **Nav links (center, hidden ≤820px):** mono lowercase 12px,
  `var(--ink-muted)`, copper hover. Links:
  - `/#about` — about
  - `/#services` — services
  - `/case-studies` — case_studies
  - `/blog` — blog
  - `/#contact` — contact
- **Right side:** ThemeToggle + a "book_a_call" pill button (mono 12px,
  navy bg / paper text, copper hover) linking to `/#contact`. On
  ≤820px, replace with a hamburger menu button.
- **Scroll state:** add `.scrolled` class when `window.scrollY > 8`,
  which adds a `border-bottom: 1px solid var(--border)` for separation.
- **Active route:** use `usePathname()`. Add `.current` class (copper color)
  to:
  - `case_studies` link when path is `/case-studies` or `/case-studies/*`
  - `blog` link when path is `/blog` or `/blog/*`
- aria-label="Primary navigation"

This is a Client Component (uses hooks). Mark with `'use client'`.

### 2. Mobile menu

Create `app/components/MobileMenu.tsx`:

- Renders below the nav on ≤820px
- Slide/fade panel: position fixed, `top: 72px`, full width
- Header row inside: small "Menu" mono caps label + circular close button
  (X icon, 32×32, 1px border)
- Same links as desktop nav, plus the `book_a_call` button styled as a
  full pill at the bottom
- Tapping any link closes the menu
- aria-expanded toggling on the hamburger button (in `Nav.tsx`)
- Hamburger and mobile menu state lives in a small shared store — easiest
  is React Context in a `Providers.tsx` Client Component, or pass state
  via props from a common parent.

**Tap states (mobile-only, since hover doesn't fire reliably):**

- Each link: `:active` and `:hover` both set color to copper, padding-left
  to 10px, border-color to copper
- The book button: `:active` and `:hover` both transition navy → copper

### 3. Footer

Create `app/components/Footer.tsx`:

- 48px 28px 56px padding, `border-top: 1px solid var(--border)`
- Inner: max-width 920px, centered, flex space-between, baseline aligned,
  wraps on narrow
- Three children, all in JetBrains Mono 11px `var(--ink-soft)`:
  - **Left:** `© 2026 GK Consulting · Grzegorz Karolak` (year is
    dynamic — use `new Date().getFullYear()`)
  - **Middle:** `Built with Next.js on AWS<span class="footer-meta-mark">· EU-hosted</span>`
    where `.footer-meta-mark` is `var(--accent)` with 8px left margin
  - **Right:** Two links, `/impressum` and `/datenschutz`, gap 20px
- **Mobile (≤820px):** stack vertically, left-aligned, gap 10px. The
  legal links cluster gets `border-top: 1px solid var(--border)` and
  `padding-top: 12px` so it visually separates from the build credit.

### 4. Root layout integration

Update `app/app/layout.tsx`:

- Import and render `<Nav />` at the top of `<body>`
- Render the `{children}` slot
- Render `<Footer />` at the bottom
- Mobile menu state can live inside Nav or in a Providers wrapper —
  use whatever's simplest

### 5. Route placeholders

Create empty pages for every route in the page map. Each one for now is
just a single h1 inside a `<main className="spine">` with reasonable
top-padding to clear the fixed nav (≈140px top padding):

- `app/app/page.tsx` — "GK Consulting — Homepage" (this gets replaced in Step 04)
- `app/app/case-studies/page.tsx` — "Case Studies" (Step 05 builds it out)
- `app/app/case-studies/[slug]/page.tsx` — "Case Study Detail" (Step 05)
  - Add `generateStaticParams()` that returns an empty array for now
- `app/app/blog/page.tsx` — "Blog" (Step 05)
- `app/app/blog/[slug]/page.tsx` — "Blog Post" (Step 05)
  - `generateStaticParams()` returns empty array
- `app/app/impressum/page.tsx` — "Impressum"
  - Include a one-paragraph placeholder note: *"Imprint content to be added.
    Required for German legal compliance."*
- `app/app/datenschutz/page.tsx` — "Datenschutz"
  - Same placeholder pattern

These pages should each export a `metadata` object with at least `title`
and `description` (Step 06 expands them).

## Acceptance criteria

- [ ] Visit each of the 7 routes — nav and footer render consistently
- [ ] Click each nav link — they go to the right route
- [ ] Resize to ≤820px — desktop links disappear, hamburger appears
- [ ] Tap hamburger — mobile menu opens with slide/fade
- [ ] Tap close button — menu closes
- [ ] Tap any link in mobile menu — menu closes and route changes
- [ ] On `/case-studies` and `/case-studies/anything`, the `case_studies`
  nav link is copper
- [ ] On `/blog` and `/blog/anything`, the `blog` nav link is copper
- [ ] Scroll past 8px — nav gets a visible bottom border
- [ ] Theme toggle still works on every page
- [ ] Footer year is current
- [ ] On mobile, footer legal links are visually separated from build credit

Commit with message: `feat(shell): nav, mobile menu, footer, route placeholders`.
