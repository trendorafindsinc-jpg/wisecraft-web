# WISECRAFT V2 — UI workspace package

**Product:** WISECRAFT by Trendora Inc  
**Role of this package:** Modern AI mentor **UI shell** prepared for integration into the existing production/prototype repo.

> This is **not** a full replacement of https://github.com/trendorafindsinc-jpg/wisecraft-web.git  
> Backend truth remains the existing deployment until deliberately compared and merged.

## Product principle

- **TrendoraTools** — know where you are  
- **WISECRAFT** — know what to do next  
- **Trendorafinds** — learn from knowledge and stories  

## Tech stack

- Vite + React 19 + TypeScript  
- Tailwind CSS v4 (CSS-native `@theme` tokens)  
- React Router  
- Zustand + localStorage persistence adapter  
- Lucide icons  
- Server: existing `/api/chat` (NVIDIA NIM + Trendorafinds RAG)

## Structure

```
src/
  components/layout|chat
  pages/          Home Chat Goals Plans Progress Tools Knowledge Settings
  stores/         Zustand app store
  lib/api         sendChat() → /api/chat
  lib/persistence localStorage adapter
  types/
  styles/globals.css
api/chat.js       CANDIDATE serverless handler (do not auto-overwrite production)
```

## Local development

```bash
npm install
npm run dev
```

## Environment

See `.env.example`. On Vercel, set:

- `NVIDIA_API_KEY` (required, server-only)
- `NVIDIA_MODEL` (optional)

## API architecture

```
User → /api/chat → Trendorafinds retrieval → NVIDIA NIM → response (+ sources)
```

Frontend never sees the API key.  
`sendChat` is **non-streaming** (full JSON response). Real SSE streaming is not claimed.

## Persistence

- Conversations + goals: `localStorage` via `persistence` adapter  
- Designed so a future Trendora ID / cloud layer can replace the adapter  
- Reads legacy `wisecraft_profile` for display only when present  

## Security notes

- No secrets in client bundles  
- Permissive `Access-Control-Allow-Origin: *` removed from candidate API  
- Rate limiting, auth, and output safety layers are **not** fully implemented here  

## Deployment

- `vercel.json` SPA rewrite for non-API routes  

## Intentionally not implemented (honest placeholders)

- Cloud sync / Trendora ID  
- Real-time token streaming  
- Plans / Progress engines  
- Full Tools suite (integrate from existing repo)  
- Community / social  
- Fake analytics or financial data  

## Integration into existing repo

1. Keep production `api/chat.js` until diffed against `api/chat.js` in this package.  
2. Merge UI: AppShell, routes, store, persistence.  
3. Port existing Onboarding + Tools pages into new routes.  
4. Re-apply PWA icons/manifest/service worker from production if stronger.  
5. Run production build on Vercel with existing `NVIDIA_API_KEY`.  
