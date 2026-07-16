# 🌟 Aprende Conmigo

Bilingual (ES/EN) maths + English learning web app for Leo (6) and Grace (4).
A 5–15 minute daily play session that quietly builds number sense and English
vocabulary, where the kid feels like they're playing, not studying.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

Deployable as a static site (Vercel/Netlify free tier — `npm run build`, publish `dist/`).

## What's inside (v1 = PRD Phases 1–3)

- **Profile picker** — two big avatar buttons (Leo 🦖 / Grace 🦄), no passwords.
- **Exercise engine** — one exercise on screen at a time, single "next" flow.
- **Maths in Spanish**
  - Grace: counting objects (1–10), which has more, shape matching, patterns.
  - Leo: addition/subtraction to 20, number comparison to 100, missing-number sequences (incl. counting by tens).
- **English, audio-first** (Web Speech API — neither child reads English)
  - Grace: "Tap the dog" (audio → picture), colors, numbers 1–10.
  - Leo: larger vocabulary, "What color is the strawberry?", numbers to 20.
- **Adaptive difficulty** — 3–4 tiers per template. 3 correct in a row → tier up;
  2 wrong in a row → tier down (encouraging, never a fail state). Sessions start
  one tier below last mastery as a warm-up.
- **Star economy + collection** — every completed exercise earns a star; stars
  unlock 12 silly animal companions. Confetti and spoken praise on every win.
- **No timers, no penalties** — wrong answers get a gentle spoken hint and a retry.
  The kid taps "He terminado" whenever they want; the closing screen celebrates the day.
- **Parent area** — behind a hold-3-seconds gate: per-child stars, exercise counts,
  per-template mastery tiers, voice toggle, progress reset.
- **Progress** — localStorage, per device (v1 decision; no backend, no accounts).

## Architecture notes

- **Templates, not AI, generate answers.** All exercise logic is deterministic and
  hand-designed (`src/exercises/`) so a maths answer can never be wrong. The PRD's
  AI content variation (Phase 4) will only ever swap surface content (themes,
  characters, word lists) — never answer logic.
- **Visual layer is isolated** in `src/content/vocabulary.js`: emoji today,
  illustrated characters later, without touching exercise logic.
- **Stack:** React + Vite + Tailwind, Web Speech API TTS (Spanish voice for maths,
  English voice for English exercises), PWA-ready manifest.

## Not in v1 (per PRD)

Accounts/auth, device sync, written English (v2), Claude API themed content packs
and richer parent dashboard (Phase 4), native apps, speech recognition.
