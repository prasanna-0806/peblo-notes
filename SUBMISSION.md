# Peblo Challenge — Submission Checklist

## You must do manually

### 1. Screenshots
Add PNG files to `/samples` (see `samples/README.md`).

### 2. Demo video (5–10 min)
Record with OBS or Loom. Cover:
- [ ] Signup / login
- [ ] Create & edit notes (auto-save)
- [ ] Tags, categories, archive
- [ ] AI summary (summary + action items + title)
- [ ] Search & filter
- [ ] Public share (incognito tab)
- [ ] Dashboard insights
- [ ] (Optional) Deployment URL

### 3. GitHub
```bash
cd peblo-notes
git init
git add .
git commit -m "feat: Peblo collaborative AI notes workspace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/peblo-notes.git
git push -u origin main
```

### 4. Deploy (optional but impressive)
See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Already done in this repo

- [x] All 6 required feature areas
- [x] README with architecture & API docs
- [x] `.env.example` (no secrets)
- [x] `/samples` with API examples & schema
- [x] Dark mode UI
- [x] Markdown preview
- [x] Toast notifications
- [x] Loading skeletons
- [x] Debounced search
- [x] Free Gemini AI integration

---

## Pre-submit verification

```bash
npm run build   # must pass
```

Confirm `.env` is NOT in `git status`.
