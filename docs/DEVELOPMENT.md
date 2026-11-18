# Development notes

Setup, content, artwork, SEO, deployment and code structure for the portfolio site.

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview
```

## Before deploying: what's still open

Content comes from the resume (Nov 2026). Remaining gaps:

| What | Where |
|---|---|
| Repository / demo links for the other projects | `src/data/projects.ts` (`github`, `demo`, `packageUrl`) |
| AI Requirements Analyst and the souls-like demo are marked in development; update their features and links (and remove `status`) when they ship | `src/data/projects.ts` |
| Repository links for the additional projects & experiments | `src/data/inventory.ts` |
| Resume PDF | `public/resume.pdf` (replace when the resume changes) |

All content lives in `src/data/`. Sections render whatever is there, so adding a project, mission or skill is a data edit only.

- `business.ts`: the Impact results; each has a measured value with its `basis` and links to the case study that explains it.
- `projects.ts`: `featured: true` puts a project in the Projects showcase; the others are listed in the experiments collection (`inventory.ts`, via `projectId`) and keep their own `/projects/:id` page. Case-study `contributions` carry an `area` that groups their detailed write-ups into collapsible sections. Every project needs a `status` (production / published / in-development / experimental / discontinued), a `problem` and `demonstrates`. Case-study metrics carry a `basis` (production, load-test, internal, public) that is shown next to the number, so test results are never presented as production figures.
- `inventory.ts`: the additional projects & experiments shown below the showcase. Don't repeat featured projects here.
- `experience.ts`: `awards` render as "Awards & recognition" under the entry and feed the JSON-LD `award` field. Keep names and years exactly as awarded.
- Chapter numbers follow `navigation.ts` order automatically. Retired sections (`/build`, `/inventory`) are mapped in `LEGACY_SECTIONS` and redirected in `firebase.json`.

## Adding your artwork

Every image or video under `src/assets/` is picked up automatically. If a file exists, it replaces the drawn-in-code artwork; if not, the procedural art is used. Theme variants are optional: name a file `sunrise-<name>` / `dusk-<name>` (or `<name>-sunrise` / `<name>-dusk`).

| Slot | File name (any of webp/avif/png/jpg) | Notes |
|---|---|---|
| Hero backdrop | `hero/hero.webp` or `hero/sunrise-hero.webp` + `hero/dusk-hero.webp` | Full-bleed, ~2400px wide; focal point around 50% / 60% |
| Hero backdrop (mobile) | `hero/hero-mobile.webp` | Optional portrait crop for phones |
| Hero character | `portraits/hero-character.png` | Transparent cut-out; replaces the silhouette |
| About portrait | `portraits/portrait.webp` | 4:5 crop |
| Project key art | `projects/<project-id>.webp` | e.g. `projects/splurge-art.webp`, ~16:11 |

Project ids: `splurge-art`, `personal-collection`, `story-framework`, `ai-requirements-analyst`, `souls-like-demo`.

## SEO

- **Site URL**: set once in `.env` (`VITE_SITE_URL`). It feeds the canonical link, Open Graph/Twitter tags, JSON-LD, `robots.txt` and `sitemap.xml`.
- **Routing** ([wouter](https://github.com/molefrog/wouter), URL scheme in `src/app/routes.ts`): no `#` fragments. Sections live at `/about`, `/projects`… and the address bar follows the section being read (replaceState, no history entries). A project's case study lives at `/projects/:id`: opening one pushes a history entry, so browser Back closes the overlay; Prev/Next replace it. Old `/#section` links are rewritten on load.
- **Prerendering**: `npm run build` also renders every route to static HTML (`src/entry-server.tsx` → `scripts/prerender.mjs`): `index.html`, one `<section>.html` per section (canonical stays `/`) and `projects/<id>.html` per project with its own title, description, canonical and Open Graph tags plus the case study in the HTML. Crawlers and link-preview bots get the full content without running JavaScript. The browser then does a normal client render on top.
- **Structured data**: `src/seo/structuredData.ts` builds Person + WebSite + ProfilePage JSON-LD from `src/data/`, so it stays in sync with the content.
- **Generated at build**: `dist/robots.txt` and `dist/sitemap.xml` (lastmod = build date).
- **Share image**: `public/og-image.jpg` (1200×630), rendered from `assets-source/og/og-image.html` with the live hero art. After changing the hero, character or logo, run `npm run og-image` (needs Chrome or Edge and Python Pillow).
- **Hosting**: `firebase.json` serves `dist/` with long-lived caching for hashed `/assets/**`. `cleanUrls` maps `/about` → `about.html` and `/projects/x` → `projects/x.html`; unknown paths get `404.html`.
- **Deploy (GitHub Actions)**: `.github/workflows/firebase-hosting.yml` builds and deploys to the live channel on every push to `main`, and to a 7-day preview channel (URL commented on the PR) for pull requests. Repo setup, once:
  - Firebase project and site come from `.firebaserc` (project `personal-portfolio-fb746`) and `firebase.json` (`"site": "christianlloydsalon"`).
  - Secret `FIREBASE_SERVICE_ACCOUNT`: run `npx firebase-tools init hosting:github` (creates it for you), or paste a service account JSON key with the *Firebase Hosting Admin* role.
  - Variable `VITE_SITE_URL`: the production origin (falls back to `https://christianlloydsalon.web.app`).
- After the first deploy: add the site to Google Search Console, submit `sitemap.xml`, and check the share card with LinkedIn Post Inspector.

## Themes

Dusk (default) and Sunrise. Tokens are in `src/styles/themes.css`. Colors are registered with `@property`, so the scene, UI and artwork recolor together. The saved choice is stored in `localStorage` (`cs:theme`), and an inline script in `index.html` applies it before first paint, so the wrong theme never flashes. Switching uses a View Transitions circular reveal where supported and falls back to color interpolation.

## Motion

- Loading screen plays on every visit (skipped under reduced motion); any key or click skips to the end, where the logo flies into the hero.
- Hero: staged entrance, pointer parallax (mouse and trackpad only), and a pinned scroll "camera push" on desktop.
- Projects: pinned horizontal gallery on desktop (1024px and up), vertical cards on smaller screens; each card opens a full-screen presentation (Esc closes, arrow keys move between projects).
- `prefers-reduced-motion` turns off the intro, smooth scrolling, pinning, parallax and reveals; all content stays visible.

## Structure

```
src/
  app/            App shell
  animations/     GSAP setup, Lenis smooth scroll, reveal helpers, magnetic effect
  components/     navigation, brand, scene (procedural landscape), buttons, typography, transitions
  data/           all content
  features/theme/ ThemeProvider, ThemeToggle, config
  hooks/          media queries, active section, focus trap, scoped GSAP
  lib/assets.ts   asset registry and theme-variant resolution
  sections/       Hero, About, Projects, Experience, Arsenal, OpenSource, Contact
  styles/         tokens, themes, globals
```
