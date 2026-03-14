# Rooster

**Portable, voice-driven command-and-control training.**

Rooster is an early-stage venture building accessible training tools that supplement scarce enterprise simulators. This repository contains the public-facing landing site.

## Tech Stack

- **Framework:** Next.js 14 (Static Export)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** GitHub Pages (automatic via Actions)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Static output is generated in the `out/` directory.

## Deployment

### GitHub Pages (automatic)

Push to `main` — GitHub Actions will build and deploy automatically.

The site will be available at `https://laznier.github.io/rooster`.

### Vercel (alternative)

1. Import the repo into Vercel
2. Set `PAGES_BASE_PATH` to empty (or remove it from `next.config.mjs`)
3. Deploy — Vercel handles the rest

## Content to Replace with Real Media

- **Hero section:** Add a logo or hero graphic (replace the `R` monogram if desired)
- **Prototype section:** Add a screenshot of the demo (replace the placeholder card)
- **Social proof section:** Consider adding a screenshot of the LinkedIn post
- **Open Graph image:** Add a `public/og-image.png` (1200×630px) for social sharing

## Project Structure

```
src/
  app/
    layout.tsx        — Root layout, metadata, SEO
    page.tsx          — Single-page site with all sections
    globals.css       — Base styles and utilities
  components/
    Header.tsx        — Sticky navigation header
    Footer.tsx        — Site footer
  content/
    siteConfig.ts     — Links, navigation, branding
public/
  robots.txt          — Disallow indexing (remove when ready)
  favicon.svg         — Site favicon
  .nojekyll           — GitHub Pages compatibility
.github/
  workflows/
    deploy.yml        — GitHub Pages deploy workflow
```

## SEO / Privacy

- Robots meta tag: `noindex, nofollow`
- robots.txt: `Disallow: /`
- No analytics or tracking
- No email addresses exposed
- Remove noindex restrictions when ready for public visibility

## License

All rights reserved.
