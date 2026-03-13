# Strategic Management ePortfolio

**Laznier Mederos Santos**  
MGMT 670 — Strategic Management Capstone  
University of Maryland Global Campus  
March 2026

---

## About

This is a custom-built professional ePortfolio for the Unit 7 Comprehensive Strategic Analysis assignment. It showcases strategic management knowledge, a comprehensive Tesla strategic analysis, course artifacts, and additional work samples.

**Tech stack:** Next.js 14 · TypeScript · Tailwind CSS · Static Export · Vercel-ready

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 18+ installed
- npm (comes with Node.js)

### Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This generates a static export in the `out/` folder, ready for deployment.

---

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **"New Project"** → select your repository.
4. Vercel auto-detects Next.js. Click **Deploy**.
5. Your site will be live at a `.vercel.app` URL.

To use a custom domain, go to **Settings → Domains** in your Vercel project.

---

## How to Edit Content

All editable content is in **`src/content/`**. Edit these files to update the site without touching components or layouts:

| File | What It Controls |
|------|-----------------|
| `siteConfig.ts` | Navigation, name, footer, course info |
| `homeContent.ts` | Home page hero, intro, preview cards |
| `aboutContent.ts` | About Me bio, competencies, education |
| `analysisContent.ts` | **Strategic Analysis** — all sections, subsections, chart placeholders |
| `artifactsContent.ts` | Course artifact cards |
| `workSamplesContent.ts` | Additional work sample cards |
| `contactContent.ts` | Contact/LinkedIn info |

### Adding Images / Charts

1. Place image files in `public/images/` (e.g., `public/images/swot-chart.png`).
2. In `analysisContent.ts`, update the chart placeholder's `placeholder` field from `'placeholder'` to `'/images/swot-chart.png'`.
3. To display images instead of placeholders, update the `ChartPlaceholder` component in `src/components/ChartPlaceholder.tsx` or use standard `<img>` tags in your content.

### Adding PDF Downloads

1. Place your PDF in `public/` (e.g., `public/tesla-analysis.pdf`).
2. Update the download link in `src/app/analysis/page.tsx` to point to `/tesla-analysis.pdf`.

### Adding Artifact Links

In `artifactsContent.ts`, set the `link` field on any artifact to a URL or file path.

---

## What to Customize First

Before publishing, update these items in order of priority:

1. **`src/content/analysisContent.ts`** — Replace all `[PLACEHOLDER]` sections with your final Tesla strategic analysis content.
2. **`src/content/artifactsContent.ts`** — Add links to your actual course artifact documents.
3. **`src/content/aboutContent.ts`** — Review and refine your professional bio.
4. **`public/images/`** — Add your SWOT, PESTEL, Five Forces, and other chart images.
5. **`src/content/homeContent.ts`** — Fine-tune the home page intro text if needed.
6. **`src/content/workSamplesContent.ts`** — Update or add additional work samples.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (header + footer)
│   ├── page.tsx            # Home page
│   ├── about/page.tsx      # About Me
│   ├── analysis/page.tsx   # Strategic Analysis (centerpiece)
│   ├── artifacts/page.tsx  # Course Artifacts
│   ├── work-samples/page.tsx # Additional Work Samples
│   ├── contact/page.tsx    # Professional Connection
│   └── globals.css         # Global styles
├── components/             # Reusable UI components
│   ├── Header.tsx          # Sticky navigation header
│   ├── Footer.tsx          # Site footer
│   ├── PageHero.tsx        # Page header banner
│   ├── SectionHeading.tsx  # Section title component
│   ├── PreviewCard.tsx     # Home page navigation cards
│   ├── ArtifactCard.tsx    # Course artifact display card
│   ├── WorkSampleCard.tsx  # Work sample display card
│   ├── AnalysisSectionBlock.tsx # Strategic analysis section renderer
│   └── ChartPlaceholder.tsx     # Placeholder for charts/visuals
└── content/                # ✏️ EDITABLE CONTENT FILES
    ├── siteConfig.ts
    ├── homeContent.ts
    ├── aboutContent.ts
    ├── analysisContent.ts
    ├── artifactsContent.ts
    ├── workSamplesContent.ts
    └── contactContent.ts
```

---

## License

This project was built for academic purposes as part of MGMT 670 at UMGC.
