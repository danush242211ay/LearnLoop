# LearnLoop — Frontend

A dark-theme React frontend built specifically against the LearnLoop Express/MongoDB
backend. Vite + React + React Router + Tailwind CSS, no UI kit — the whole visual
language (colors, type, the "loop ring" motif) is custom to this brand.

## Stack
- **Vite + React 18** — build tool & UI
- **React Router v6** — client-side routing
- **Tailwind CSS** — styling, theme defined in `tailwind.config.js`
- **axios** — API client with cookies (`withCredentials: true`)
- **react-hot-toast** — notifications
- **lucide-react** — icons
- **Razorpay Checkout.js** — loaded dynamically at checkout time, no SDK dependency

## Setup

```bash
npm install
cp .env.example .env   # then edit it, see below
npm run dev
```

Runs at `http://localhost:5173` by default.

### Environment variables (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API. Default assumes `http://localhost:3000/api`. |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay **public** key id (safe to expose client-side). Checkout won't open without it. |

### Running against the backend

This frontend expects the **patched** backend (see `../Backend-Patches/PATCHES.md`
if it was provided alongside this project) because:
- It calls `GET /api/auth/me` to restore the session on refresh — the original
  backend doesn't have this route.
- It calls `POST /api/enrollment/enroll` and `GET /api/enrollment/mycourses` —
  these routes weren't wired up in the original backend.
- It relies on CORS being enabled with `credentials: true` — the original backend
  had no CORS middleware at all, so a separate-origin frontend couldn't
  authenticate.

If you're running the original, unpatched backend, register/login/browsing will
work, but "My Learning," checkout completion, and session persistence across
refreshes will not.

Make sure the backend's `CLIENT_URL` env var matches wherever this frontend is
actually running (`http://localhost:5173` for the default dev setup).

## Project structure

```
src/
  components/   Reusable UI: Navbar, CourseCard, LoopRing (brand motif), route guards…
  context/      AuthContext (session/me) and CartContext (cart state + badge count)
  lib/          api.js (every backend endpoint in one place), format.js, razorpay.js
  pages/        One file per route
```

## Design notes

- **Dark theme only** — no light mode toggle, this is intentional.
- The ring motif ("LearnLoop" → a loop) recurs as the logo mark, the hero graphic,
  the loading spinner, and the enrolled-course indicator on My Learning — see
  `src/components/LoopRing.jsx`.
- Fonts: **Fraunces** (display/headlines), **Inter** (body/UI), **JetBrains Mono**
  (prices, categories, durations, lesson numbers) — loaded via Google Fonts in
  `index.html`.
- The course detail page is intentionally honest about what the backend can tell
  it: for non-enrolled visitors it shows however many preview lessons the API
  returns and nothing more, rather than faking a locked curriculum with an
  invented lesson count.

## Known backend-shaped limitations

These aren't frontend bugs — they're limits of what the API (even patched)
exposes today:
- No single-course-by-id endpoint, so the course detail page fetches the full
  catalog and finds the course client-side. Fine at small scale, worth adding a
  `GET /course/:id` route if the catalog grows.
- No lesson-completion tracking, so "My Learning" shows enrollment, not
  progress — there's nothing to base a percentage on yet.
