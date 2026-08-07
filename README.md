# AK TECH – CareerPath AI (React)

React (Vite) version of the original single-file `career_prediction.html` app,
with login/signup, resume-based suggestions, SEO tags, and deploy configs added.

## Features

- **Login / Sign Up** – real client-side auth (localStorage-backed). Demo accounts:
  - `arun552@gmail.com` / `123` (admin)
  - `demo@aktech.ai` / `demo123` (user)
- **Home** – landing page with feature highlights + demo preview image
- **Dashboard** – academic/skill profile form → AI-style career match predictions
  - **Resume upload/paste** – drop a `.txt` resume or paste text; a client-side
    keyword scanner suggests the best-matching career domain and detected
    programming languages (runs fully in the browser — nothing is uploaded
    anywhere)
- **Courses** – filterable catalog of 50+ online courses + nearby Chennai colleges
- **AI Advisor** – rule-based chatbot with voice input (SpeechRecognition) and
  text-to-speech ("Listen" button)
- **Admin** – user management (add/delete), activity log, password change
- **Logout** button in the navbar

## Project structure

```
src/
  App.jsx                 – layout, auth gate, page routing
  App.css                 – all styles (original + auth/resume additions)
  assets/demo-preview.svg – hero preview image
  data/
    careerData.js         – careerDB + defaultCareers (prediction data)
    coursesData.js        – COURSES catalog
    chatbotKB.js           – chatbot knowledge base
    users.js               – built-in users, localStorage helpers, auth functions
  components/
    Login.jsx              – login/signup forms
    Navbar.jsx
    Home.jsx
    Dashboard.jsx
    ResumeUpload.jsx        – resume paste/upload + keyword analysis
    Courses.jsx
    Chatbot.jsx
    Admin.jsx
```

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (typically http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

---

## Deploying online (free)

### Option A — Vercel (recommended, easiest)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **New Project** → select the repo.
3. Vercel auto-detects Vite and sets the build command (`vite build`) and output
   dir (`dist`) — just click **Deploy**.
4. `vercel.json` (already included) handles SPA routing so page refreshes work correctly.

CLI alternative:
```bash
npm i -g vercel
vercel        # first deploy, follow prompts
vercel --prod # promote to production URL
```

### Option B — Netlify

1. Push to GitHub.
2. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → pick the repo.
3. `netlify.toml` (already included) sets the build command, publish dir, and SPA redirect — Netlify picks it up automatically.

### Option C — GitHub Pages

Works for static hosting but needs a `base` path in `vite.config.js` matching
your repo name, and client-side routing needs a 404→index.html workaround.
Vercel/Netlify are simpler for this project.

### Custom domain

Once deployed on Vercel or Netlify, you can attach a custom domain
(e.g. `aktechcareer.com`) for free in the project's **Domains** settings —
you only pay for the domain registration itself.

---

## Next-level upgrades (need your own accounts/API keys)

These weren't wired in because they require credentials only you can provide:

- **Real database instead of localStorage** — swap `src/data/users.js`'s
  localStorage calls for a service like **Firebase Auth + Firestore** or
  **Supabase**. Create a free project on either, add your config to `.env`
  (see `.env.example`), and replace the functions in `users.js` with SDK calls.
- **Real AI chatbot** (instead of the fixed keyword-based bot) — create a small
  serverless function (Vercel/Netlify Functions) that calls the Anthropic or
  OpenAI API server-side (never expose an AI API key in client code), and have
  `Chatbot.jsx` call that function's URL (`VITE_AI_BACKEND_URL` in `.env`)
  instead of `getBotReply()`.
- **Real resume parsing (PDF/DOCX)** — the current `ResumeUpload.jsx` handles
  `.txt`/pasted text with client-side keyword matching. For PDF/DOCX, either
  add `pdfjs-dist`/`mammoth` client-side, or send the file to a backend
  function for parsing.

## Notes on the conversion

- All inline `onclick`/DOM-manipulation logic from the original vanilla JS was
  rewritten using React state (`useState`/`useEffect`).
- Pages stay mounted at all times (visibility toggled via `.pg`/`.pg.active`
  CSS classes, same as the original), so chat history, prediction results, and
  admin tab selection persist as you navigate.
- User accounts and session still live in `localStorage`, under the same
  `aktech_registered` key as before, plus a new `aktech_session` key for login state.
