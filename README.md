# Asrafujjaman — Developer Portfolio

**Live site: [asrafujjaman.vercel.app](https://asrafujjaman.vercel.app/)**

A personal developer portfolio for **Asrafujjaman**, a .NET & full-stack developer based in Dhaka, Bangladesh. Built with Next.js and Tailwind CSS, it showcases selected projects, a categorized technical skill set, live GitHub activity, a live local-weather panel, and a working contact form.

## Features

- **Animated skill constellation** — a hero-section component (`components/SkillConstellation.tsx`) that lays out specialization skills around the portrait, with a distinct "core" vs. "also building with" visual tier.
- **Selected work** — a grid of featured projects with tech-stack tags.
- **Live GitHub feed** — pulls real public repositories for `AsrafujjamanDeepu` via `/api/live`.
- **Live weather panel** — shows current Dhaka weather via WeatherAPI, refreshed automatically.
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

Both live integrations (`/api/live`) are cached briefly by Next.js so the site stays fast and doesn't over-request either API.

## Project structure

```
app/
  api/live/       API route powering the live GitHub + weather panel
  layout.js       Root layout, fonts, and metadata
  page.js         The entire single-page portfolio
  globals.css     Design tokens and all site styling
components/
  SkillConstellation.tsx   Hero skill-orbit component
public/
  asrafujjaman-portrait.jpg
```

## Deploy to Vercel

1. Push this repository to GitHub (already at [AsrafujjamanDeepu/Asrafujjaman](https://github.com/AsrafujjamanDeepu/Asrafujjaman)).
2. Import the repository into [Vercel](https://vercel.com/new).
3. Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, `WEATHERAPI_KEY`, and optionally `GITHUB_TOKEN` under **Project Settings → Environment Variables**.
4. Deploy — Vercel detects Next.js and pnpm automatically.
5. Check it live at **[asrafujjaman.vercel.app](https://asrafujjaman.vercel.app/)**.

## Git quick start

```bash
git init
git add .
git commit -m "Create personal portfolio"
git branch -M main
git remote add origin https://github.com/AsrafujjamanDeepu/Asrafujjaman.git
git push -u origin main
```

## Author

**Asrafujjaman** — Software Developer, .NET & Full-Stack Development, Dhaka, Bangladesh
[GitHub](https://github.com/AsrafujjamanDeepu) · [LinkedIn](https://www.linkedin.com/in/asrafujjaman) · [Live site](https://asrafujjaman.vercel.app/)
