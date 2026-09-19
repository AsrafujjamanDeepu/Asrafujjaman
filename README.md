# Asrafujjaman — Developer Portfolio

**Live site: [asrafujjaman.vercel.app](https://asrafujjaman.vercel.app/)**

A personal developer portfolio for **Asrafujjaman**, a .NET & full-stack developer based in Dhaka, Bangladesh. Built with Next.js and Tailwind CSS, it showcases selected projects, a categorized technical skill set, live GitHub activity and a contribution heatmap, a live local-weather panel, a small API playground (NASA picture of the day, quotes, jokes, cat facts), and a working contact form.

## Features

- **Animated skill constellation** — a hero-section component (`components/SkillConstellation.tsx`) that lays out specialization skills around the portrait, with a distinct "core" vs. "also building with" visual tier.
- **Selected work** — a grid of featured projects with tech-stack tags.
- **Live GitHub feed** — pulls real public repositories for `AsrafujjamanDeepu` via `/api/live`.
- **Live weather panel** — shows current Dhaka weather via WeatherAPI, refreshed automatically.
- **Contribution heatmap** — a GitHub-style yearly heatmap with streak stats, drawn natively from `/api/contributions` (no key needed).
- **Playground** — NASA's Astronomy Picture of the Day (`/api/apod`), plus a random quote, programming joke, and cat fact (`/api/fun`) that refresh on click. The keyless APIs fall back to a built-in list if they're down.
- **Themed project photos** — optional Unsplash or Pexels photos on the project cards, searched by each project's theme and credited on the card.
- **Toolbox** — the full technical skill set, grouped by category (Languages, Backend, Frontend, Data, Tools & APIs) with core specializations highlighted.
- **Contact form** — sends messages directly from the site using Web3Forms, no backend required.
- **Social links** — icon links to GitHub, LinkedIn, Facebook, WhatsApp, and Telegram in the footer.
- Scroll-triggered reveal animations, a responsive layout, and a subtle grain overlay for texture.

## Tech stack

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 15 (App Router) |
| UI         | React 19, Tailwind CSS |
| Language   | JavaScript, with a TypeScript component for the skill constellation |
| Icons      | react-icons |
| Analytics  | Vercel Analytics |
| Forms      | Web3Forms |
| Weather    | WeatherAPI |
| Live extras | GitHub contributions API, NASA APOD, Quotable / DummyJSON, JokeAPI, Cat Facts, Unsplash / Pexels |
| Package manager | pnpm |
| Hosting    | Vercel |

## Getting started

This project uses **pnpm** (see `packageManager` in `package.json`).

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

## Environment variables

Set these in `.env.local` for local development, and under **Project Settings → Environment Variables** on Vercel for production. See `.env.example` for the full template.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Yes, for the contact form to send | Public access key from [Web3Forms](https://web3forms.com). Safe to expose in browser code; Web3Forms' free plan is designed for this. |
| `WEATHERAPI_KEY` | Optional | Free key from [WeatherAPI](https://www.weatherapi.com) to power the live Dhaka weather card. Used server-side only. |
| `GITHUB_TOKEN` | Optional | Raises the GitHub API rate limit for the live-repos panel. Used server-side only — keep it private. |
| `NASA_API_KEY` | Optional | Free key from [api.nasa.gov](https://api.nasa.gov) for the Astronomy Picture of the Day card. Falls back to NASA's heavily rate-limited `DEMO_KEY`. Server-side only. |
| `UNSPLASH_ACCESS_KEY` | Optional | Access Key from [Unsplash](https://unsplash.com/developers) for themed project-card photos. Server-side only. |
| `PEXELS_API_KEY` | Optional | Alternative to Unsplash: free key from [Pexels](https://www.pexels.com/api/). Used only if no Unsplash key is set. |

The contribution heatmap, quotes, jokes, and cat facts need no key. Every integration degrades gracefully: with a key missing or an API down, the related card shows a fallback instead of breaking the page. Responses are cached by Next.js (and at the CDN) so the site stays fast and doesn't over-request any API.

## Project structure

```
app/
  api/live/       API route powering the live GitHub + weather panel
  api/contributions/   GitHub contribution calendar for the heatmap
  api/apod/       NASA Astronomy Picture of the Day
  api/fun/        Random quote / joke / cat fact, with built-in fallbacks
  api/project-images/  Themed Unsplash or Pexels photos for project cards
  layout.js       Root layout, fonts, and metadata
  page.js         The entire single-page portfolio
  globals.css     Design tokens and all site styling
components/
  SkillConstellation.tsx   Hero skill-orbit component
  ContributionHeatmap.tsx  Yearly GitHub contribution heatmap
  ApodCard.tsx             NASA picture-of-the-day card
  FunCards.tsx             Quote, joke, and cat-fact cards
lib/
  http.js         Small fetch helper (timeout + null on failure)
public/
  asrafujjaman-portrait.jpg
```

## Author

**Asrafujjaman** — Software Developer, .NET & Full-Stack Development, Dhaka, Bangladesh
[GitHub](https://github.com/AsrafujjamanDeepu) · [LinkedIn](https://www.linkedin.com/in/asrafujjaman) · [Live site](https://asrafujjaman.vercel.app/)
