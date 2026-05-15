# Peblo Notes — Collaborative AI Workspace

Full-stack submission for the **Peblo Full Stack Developer Challenge**: a collaborative, AI-powered notes workspace with authentication, tagging, AI summaries, search, public sharing, and productivity insights.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748) ![Gemini](https://img.shields.io/badge/AI-Gemini%20Free-4285F4)

---

## Project overview

Peblo Notes lets users create and organize notes, generate AI-powered summaries with action items, search and filter content, share notes publicly, and view productivity analytics — all in one cohesive full-stack app.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS |
| **Backend** | Next.js API Routes (REST) |
| **Database** | SQLite + Prisma ORM |
| **Auth** | JWT (httpOnly cookies) + bcrypt |
| **AI** | Google Gemini (free tier) with model fallback |

---

## Features implemented

### Required (challenge checklist)

| Area | Status | Details |
|------|--------|---------|
| **Authentication** | ✅ | Signup, login, logout, JWT sessions, protected routes |
| **Notes workspace** | ✅ | CRUD, auto-save (600ms), tags, categories, archive |
| **AI integration** | ✅ | Summary, action items, suggested title |
| **Search & filter** | ✅ | Keyword search, tag filter, sort by updated |
| **Public share** | ✅ | `/shared/:shareId` — no login required |
| **Productivity dashboard** | ✅ | Totals, recent notes, tags, AI stats, weekly activity |

### Bonus

| Enhancement | Status |
|-------------|--------|
| Dark mode | ✅ |
| Markdown preview | ✅ |
| Toast notifications | ✅ |
| Loading skeletons | ✅ |
| Debounced search | ✅ |
| Gemini model fallback | ✅ |

---

## Project structure

```txt
peblo-notes/
├── prisma/              # Schema & migrations
├── src/
│   ├── app/             # Pages + API routes (full-stack)
│   │   ├── api/         # auth, notes, insights, shared
│   │   ├── workspace/   # Main notes UI
│   │   ├── dashboard/   # Insights
│   │   └── shared/      # Public note page
│   ├── components/      # UI components
│   ├── context/         # Auth state
│   └── lib/             # Prisma, auth, AI
├── samples/             # Submission samples & screenshots
├── .env.example
├── README.md
├── DEPLOYMENT.md
└── SUBMISSION.md
```

> **Note:** This uses a unified Next.js architecture (frontend + backend in one repo), which is a common and accepted pattern for full-stack Next.js apps.

---

## Architecture

```
┌─────────────┐     HTTP/JWT cookie     ┌──────────────────┐
│   Browser   │ ◄──────────────────► │  Next.js App      │
│  (React UI) │                       │  ├─ Pages (UI)   │
└─────────────┘                       │  └─ API Routes   │
                                      └────────┬─────────┘
                                               │
                                      ┌────────▼─────────┐
                                      │  Prisma + SQLite │
                                      └──────────────────┘
                                               │
                                      ┌────────▼─────────┐
                                      │  Google Gemini   │
                                      │  (free API)      │
                                      └──────────────────┘
```

**AI flow:** User clicks "AI Summary" → `POST /api/notes/:id/generate-summary` → Gemini API → stores summary, action items, suggested title on the note → returns JSON to UI.

---

## Setup instructions

### Prerequisites

- Node.js 18+
- npm

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/peblo-notes.git
cd peblo-notes
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | `file:./dev.db` for local SQLite |
| `JWT_SECRET` | Yes | Long random string |
| `LLM_PROVIDER` | Yes | `gemini`, `openai`, or `mock` |
| `GEMINI_API_KEY` | For AI | Free key from [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | No | Default `gemini-2.5-flash-lite` |

### 3. Database

```bash
npm run db:migrate
```

### 4. Run

```bash
npm run dev
```

Open **http://localhost:3000**

### 5. Production build

```bash
npm run build
npm start
```

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Current user |
| `GET` | `/api/notes` | List notes (`?q=&tag=&archived=&sort=`) |
| `POST` | `/api/notes` | Create note |
| `GET` | `/api/notes/:id` | Get note |
| `PATCH` | `/api/notes/:id` | Update note |
| `DELETE` | `/api/notes/:id` | Delete note |
| `POST` | `/api/notes/:id/generate-summary` | AI insights |
| `GET` | `/api/shared/:shareId` | Public note (no auth) |
| `GET` | `/api/insights` | Dashboard stats |

Example responses: [`samples/sample-api-responses.json`](samples/sample-api-responses.json)

---

## Testing guide

1. **Auth** — Sign up at `/signup`, log out, log in
2. **Notes** — Create note, type content (watch "Saved"), add tags/category
3. **AI** — Click **✨ AI Summary** → see summary, action items, apply suggested title
4. **Search** — Search by keyword, filter by tag, toggle archived
5. **Share** — Click Share → copy link → open in incognito
6. **Dashboard** — Visit `/dashboard` for insights

---

## Screenshots

Add screenshots to `/samples` before submitting (see [`samples/README.md`](samples/README.md)).

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Railway (recommended) and Vercel + Neon instructions.

---

## Submission

See **[SUBMISSION.md](./SUBMISSION.md)** for the full checklist including demo video outline.

---

## Security

- Passwords hashed with bcrypt
- JWT in httpOnly cookies
- Never commit `.env` or API keys
- Public notes only accessible via `shareId` when `isPublic=true`

---

Built for the Peblo Full Stack Developer Challenge.
