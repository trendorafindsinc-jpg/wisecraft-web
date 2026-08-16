# WISECRAFT

**AI Mentor for Income, Business & Financial Growth**  
Flagship product of **Trendora Inc**

> Web-first · Vercel · Capacitor-ready later

## Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS v4
- Lucide icons
- Trendora Design System (TDS) — dark glass, violet + cyan

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/chat` | AI Mentor conversation |
| `/onboarding` | Personalization (goals, capital, time) |
| `/goals` | Goal tracking |
| `/tools` | Practical tools (placeholders) |
| `/settings` | Profile & product info |

## Setup

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Create a new GitHub repo (e.g. `wisecraft`)
2. Push this project
3. Import in Vercel → Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy

## Current status

- ✅ UI shell following TDS
- ✅ Chat interface (placeholder responses)
- ✅ Onboarding flow (saves to localStorage)
- ✅ Goals / Tools / Settings screens
- ⬜ Real AI + RAG over Trendorafinds
- ⬜ PWA polish
- ⬜ Capacitor (Android / iOS)

## Brand

Part of the Trendora product family with **TrendoraTools (LUCIA)** and **Trendorafinds** content.  
Design follows **Trendora Design System (TDS) v1**.

## NVIDIA NIM (LLM)

WISECRAFT uses NVIDIA NIM free inference (OpenAI-compatible).

1. Create a free account at https://build.nvidia.com
2. Generate an API key (starts with `nvapi-`)
3. In Vercel → Project → Settings → Environment Variables:
   - `NVIDIA_API_KEY` = your key
   - Optional: `NVIDIA_MODEL` = `meta/llama-3.1-70b-instruct` (default)
4. Redeploy

Local testing of `/api/chat` requires `vercel dev` or deploying to Vercel.
