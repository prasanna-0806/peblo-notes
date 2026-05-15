# Deployment Guide

## Option A: Railway (recommended — SQLite works)

1. Push repo to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your `peblo-notes` repo
4. Add environment variables:

```env
DATABASE_URL=file:/data/dev.db
JWT_SECRET=<long-random-string>
LLM_PROVIDER=gemini
GEMINI_API_KEY=<your-free-key>
GEMINI_MODEL=gemini-2.5-flash-lite
```

5. Add a **Volume** mounted at `/data` (for SQLite persistence)
6. Set build command: `npm install && npx prisma migrate deploy && npm run build`
7. Start command: `npm start`

---

## Option B: Vercel + Neon PostgreSQL

SQLite does not persist on Vercel serverless. Use free Postgres:

1. Create DB at [neon.tech](https://neon.tech) (free tier)
2. Copy `postgresql://...` connection string
3. Change `prisma/schema.prisma` datasource to `postgresql`
4. Run `npx prisma migrate dev`
5. Deploy on [vercel.com](https://vercel.com):
   - Import GitHub repo
   - Set env vars: `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.
   - Deploy

---

## Option C: Local only (demo video)

Run locally and record your screen — fully acceptable for the challenge if deployment is difficult.

```bash
npm install
npm run db:migrate
npm run dev
```
