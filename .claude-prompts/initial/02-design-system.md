# Step 02 — Design system, typography, theme toggle

> Paste this entire prompt as one message into Claude Code.

---

## Context

You've completed Step 01. Now build the design foundation.

**Read first:**

- `docs/architecture.md` — section "Design system"
- `docs/mockups/gk-consulting-main.html` — read the entire `<style>` block;
  this is the source of truth for tokens, typography, layout

## What to do

### 1. Design tokens

Create `app/styles/tokens.css` with two `:root` selectors driven by a
`data-theme` attribute on `<html>`:

**Light theme** (`:root[data-theme="light"]`):

```
--bg: #f5f2eb
--bg-elev: #fbf9f3
--ink: #0b1222
--ink-muted: #4a5566
--ink-soft: #7a8294
--border: #e3ddd0
--border-strong: #c9c2b1
--accent: #b87333
--accent-hover: #9c5e24
--accent-soft: rgba(184, 115, 51, 0.1)
--mono-tag-bg: #ebe6d8
--mono-tag-ink: #3d4658
--shadow: 0 1px 2px rgba(11, 18, 34, 0.04), 0 6px 16px rgba(11, 18, 34, 0.06)
--noise-opacity: 0.32
--btn-primary-bg: #0b1222
--btn-primary-ink: #f5f2eb
```

**Dark theme** (`:root[data-theme="dark"]`):

```
--bg: #0a1020
--bg-elev: #0f172a
--ink: #f0ece0
--ink-muted: #9aa3b7
--ink-soft: #6b7389
--border: #1d2740
--border-strong: #2a3554
--accent: #d49760
--accent-hover: #e4a870
--accent-soft: rgba(212, 151, 96, 0.12)
--mono-tag-bg: #182140
--mono-tag-ink: #b5bccf
--shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 6px 16px rgba(0, 0, 0, 0.32)
--noise-opacity: 0.14
--btn-primary-bg: #d49760
--btn-primary-ink: #1a1408
```

### 2. Global styles

Create `app/styles/globals.css`:

- CSS reset (the `*, *::before, *::after { box-sizing: border-box; ... }` block
  from the mockup)
- `html` with `scroll-behavior: smooth` and font smoothing
- `body` with Inter, 17px base, 1.65 line-height, theme-aware bg + ink, smooth
  color transitions
- The `body::before` paper-noise texture (SVG data-URI, `mix-blend-mode`
  multiply for light / overlay for dark)
- `a` with `var(--accent)` color, hover state
- `::selection` styling
- `:focus-visible` outline using accent
- `h1`, `h2`, `h3` with Instrument Serif, 400 weight, tight letter-spacing
- `em` styled as italic copper

Pull all rules verbatim from the `<style>` block in the main mockup —
these have been iterated and are correct.

### 3. Utilities

Create `app/styles/utilities.css`:

- `.spine` — max-width 920px, padding 0 32px, centered, position: relative,
  z-index 2
- `.reveal` — initial state opacity 0 + translateY(16px), transition, with
  `.reveal.visible` clearing both
- Mobile breakpoints: 1180px, 820px, 380px (only the `.spine` padding rules
  for this file — section-specific responsive lives with components)

### 4. Font loading

Use `next/font/google` in `app/app/layout.tsx`:

```ts
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
```

- Inter: weights 400, 500, 600, 700; subset 'latin'; variable `--font-inter`
- Instrument Serif: weight 400; styles 'normal' + 'italic'; subset 'latin';
  variable `--font-instrument-serif`
- JetBrains Mono: weights 400, 500, 600; subset 'latin'; variable
  `--font-jetbrains-mono`

In `globals.css`, set:

```css
body { font-family: var(--font-inter), -apple-system, sans-serif; }
.serif, h1, h2, h3 { font-family: var(--font-instrument-serif), Georgia, serif; }
.mono { font-family: var(--font-jetbrains-mono), 'SF Mono', monospace; }
```

### 5. Theme toggle component

Create `app/components/ThemeToggle.tsx`:

- Renders a 38×38 circular button with sun + moon SVGs (paths from the mockup)
- Both icons absolutely positioned, swapped via opacity + rotate transitions
- Read initial theme from `localStorage.getItem('gk-theme')` on mount;
  fall back to `prefers-color-scheme`
- On click: toggle `data-theme` on `<html>`, persist to localStorage
- aria-label updates ("Switch to dark theme" / "Switch to light theme")
- Hover state: copper border + soft fill
- Focus-visible state from globals applies automatically

**Critical:** to avoid a flash of wrong theme on first paint, inject a
synchronous `<script>` in the `<head>` of the root layout that runs before
React hydrates:

```js
(function() {
  try {
    var t = localStorage.getItem('gk-theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
```

In Next.js App Router this goes inside the root layout's `<head>` via a
`<Script strategy="beforeInteractive">` or a raw `<script>` tag with
`dangerouslySetInnerHTML`.

### 6. Root layout

`app/app/layout.tsx`:

- Imports `tokens.css`, `globals.css`, `utilities.css` (in that order)
- Wraps `<html lang="en">` with the font variables on `<body>`
- Includes the inline theme-init script in the `<head>`
- Exports a basic `metadata` object (title, description — placeholders;
  Step 06 expands this)

### 7. Temporary smoke test

Replace `app/app/page.tsx` content with a minimal page that contains:

- The `ThemeToggle` component centered
- A single h1 "Design system check"
- A paragraph using all three font families
- A copper-bordered button

This is just to verify the design system. It will be replaced in Step 03/04.

## Acceptance criteria

- [ ] `cd app && npm run dev` shows a warm-paper background page in light mode
- [ ] Theme toggle switches to deep navy in dark mode without flicker
- [ ] No flash-of-wrong-theme on hard reload (the inline script works)
- [ ] First visit on a fresh browser respects OS dark/light preference
- [ ] After clicking the toggle once, choice persists across reloads
- [ ] All three fonts (Instrument Serif, Inter, JetBrains Mono) render correctly
- [ ] No CLS on font load — `next/font` is configured with `display: swap`
- [ ] `--accent`, `--ink`, `--bg` etc. all resolve correctly when inspected
  in DevTools

Commit with message: `feat(design): tokens, typography, theme toggle`.
