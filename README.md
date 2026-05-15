# Peblo Notes

A full-stack, AI-powered notes workspace. Create and organize notes, generate summaries and action items with Gemini, search and filter your library, share notes publicly, and track productivity from a simple dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)

<p align="center">
  <strong>Live locally at</strong> <code>http://localhost:3000</code>
</p>

---

## Highlights

- **Secure auth** — Signup, login, bcrypt passwords, JWT sessions in httpOnly cookies
- **Smart notes** — Auto-save, tags, categories, archive
- **AI assistant** — One-click summary, action items, and suggested titles (Google Gemini, free tier)
- **Find anything** — Keyword search, tag filters, sort by last updated
- **Public sharing** — Shareable links that work without an account
- **Insights** — Dashboard with note counts, tag usage, and AI activity

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | [Next.js 14](https://nextjs.org/) (App Router), React 18, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | SQLite + [Prisma](https://www.prisma.io/) |
| Auth | JWT ([jose](https://github.com/panva/jose)) + bcrypt |
| AI | [Google Gemini](https://ai.google.dev/) (free API key) |

The app uses a **unified Next.js** layout: UI pages and REST APIs live in one codebase, which keeps development and deployment straightforward.

---

## Getting started

### Prerequisites

- **Node.js** 18 or later  
- **npm**

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/peblo-notes.git
cd peblo-notes
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|:--------:|-------------|
| `DATABASE_URL` | Yes | Local SQLite, e.g. `file:./dev.db` |
| `JWT_SECRET` | Yes | Long random string for session signing |
| `LLM_PROVIDER` | Yes | `gemini`, `openai`, or `mock` |
| `GEMINI_API_KEY` | For AI | Free key from [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | No | Default: `gemini-2.5-flash-lite` |

**Free AI (recommended):** Sign in at [aistudio.google.com/apikey](https://aistudio.google.com/apikey), create an API key, and set `LLM_PROVIDER=gemini` and `GEMINI_API_KEY`. No credit card required.

**Demo mode:** Set `LLM_PROVIDER=mock` to run without any API key (placeholder AI text).

> Never commit `.env` or real API keys. Only `.env.example` belongs in the repo.

### 3. Database

```bash
npm run db:migrate
```

### 4. Run the dev server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production build

```bash
npm run build
npm start
```

---

## Project structure

```txt
peblo-notes/
├── prisma/                 # Database schema & migrations
├── src/
│   ├── app/
│   │   ├── api/            # REST API routes
│   │   ├── workspace/      # Notes UI
│   │   ├── dashboard/      # Productivity insights
│   │   ├── shared/         # Public note pages
│   │   ├── login/ & signup/
│   │   └── page.tsx        # Landing page
│   ├── components/         # React UI
│   ├── context/            # Auth provider
│   └── lib/                # Prisma, auth, AI helpers
├── samples/                # API examples & screenshots
├── .env.example
└── README.md
```

---

## Architecture

```
 Browser (React)
       │
       ▼  HTTP + JWT cookie
┌──────────────────────┐
│   Next.js 14 App    │
│  ┌────────────────┐  │
│  │ Pages (UI)     │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ API Routes     │  │
│  └────────┬───────┘  │
└───────────┼──────────┘
            ▼
     Prisma + SQLite
            │
            ▼
     Google Gemini API
```

**AI pipeline:** The client calls `POST /api/notes/:id/generate-summary`. The server sends note content to Gemini (with automatic fallback across free models if one is rate-limited), then persists the summary, action items, and suggested title on the note.

---

## Features in detail

### Authentication
- Email/password signup and login  
- Sessions stored as httpOnly JWT cookies (7-day expiry)  
- Middleware protects `/workspace` and `/dashboard`

### Notes workspace
- Create, edit, and delete notes  
- **Auto-save** after 600ms of inactivity  
- **Tags** (comma-separated) and **category** per note  
- **Archive** to hide notes without deleting them  
- **Markdown preview** toggle in the editor

### AI integration
- **Summary** — 2–3 sentence overview  
- **Action items** — Up to 5 concrete tasks  
- **Suggested title** — One-click apply to the note  
- Graceful fallback to demo output if the API is unavailable

### Search & filtering
- Full-text search across title and content  
- Filter by tag  
- Sort by most recently updated  
- Debounced search for responsive typing

### Public sharing
- Toggle a note public and get a unique share URL  
- `/shared/[shareId]` — readable without login  
- Private notes are never exposed on this route

### Productivity dashboard (`/dashboard`)
- Total and archived note counts  
- Recently edited notes  
- Most-used tags (with bar chart)  
- AI usage totals and weekly activity summary

---

## API reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/signup` | — | Create account |
| `POST` | `/api/auth/login` | — | Sign in |
| `POST` | `/api/auth/logout` | — | Sign out |
| `GET` | `/api/auth/me` | ✓ | Current user |
| `GET` | `/api/notes` | ✓ | List notes (`?q`, `?tag`, `?archived`, `?sort`) |
| `POST` | `/api/notes` | ✓ | Create note |
| `GET` | `/api/notes/:id` | ✓ | Get note |
| `PATCH` | `/api/notes/:id` | ✓ | Update note |
| `DELETE` | `/api/notes/:id` | ✓ | Delete note |
| `POST` | `/api/notes/:id/generate-summary` | ✓ | Generate AI insights |
| `GET` | `/api/shared/:shareId` | — | Public shared note |
| `GET` | `/api/insights` | ✓ | Dashboard statistics |

**Example responses:** [`samples/sample-api-responses.json`](samples/sample-api-responses.json)  
**Database schema:** [`samples/database-schema.md`](samples/database-schema.md)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client, migrate, and build |
| `npm start` | Run production server |
| `npm run db:migrate` | Apply database migrations |
| `npm run lint` | Run ESLint |

---

## Security

- Passwords hashed with **bcrypt** (cost factor 12)  
- **JWT** stored in httpOnly, `sameSite=lax` cookies  
- API routes validate ownership before read/write/delete  
- Public access only when `isPublic` is true and a valid `shareId` is used  

---

## License

This project was built as a portfolio / take-home demonstration. Feel free to fork and learn from it.

---

## Acknowledgments

Built as a full-stack demonstration project exploring collaborative workflows, AI-assisted writing, and modern React/Next.js patterns.
