# Asrafujjaman

A responsive personal portfolio built with React, Next.js, and Tailwind CSS. It presents Asrafujjaman's full-stack work, technical profile, real GitHub repositories, a live Dhaka weather panel, and a direct contact flow through Web3Forms.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env.local` to the access key from [Web3Forms](https://web3forms.com). Web3Forms' free plan is designed for this browser-side integration; its access keys are intended to be public and are protected by the provider's anti-spam controls.

## Live integrations

- **GitHub**: Public repositories for `AsrafujjamanDeepu` load via `/api/live`. It works without a key; add `GITHUB_TOKEN` to increase GitHub's rate limit. Keep this token private.
- **WeatherAPI**: Add a free `WEATHERAPI_KEY` from [WeatherAPI](https://www.weatherapi.com) to display live weather in Dhaka. The key is fetched only on the server and is never exposed to visitors.

Both services are cached briefly by Next.js so the site remains quick and does not make unnecessary API requests.

## Deploy to Vercel

1. Create a GitHub repository named `Asrafujjaman` and push this folder.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, `WEATHERAPI_KEY`, and optionally `GITHUB_TOKEN` under **Project Settings → Environment Variables**.
4. Deploy. Vercel detects Next.js automatically.

## Git quick start

```bash
git init
git add .
git commit -m "Create personal portfolio"
git branch -M main
git remote add origin https://github.com/AsrafujjamanDeepu/Asrafujjaman.git
git push -u origin main
```
