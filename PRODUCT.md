# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: prospective and existing fans of Punjabi music discovering ZAFAR SANDHU — arriving from social, streaming profiles, or word of mouth, on mobile as often as desktop. Their job: hear the music fast, then go deeper (video, story, shows).

Secondary (confirmed): industry — bookers, collaborators, and press reaching the site to evaluate and contact (bookings, collabs, press kit).

## Product Purpose

Single-page artist homepage for ZAFAR SANDHU, a Punjabi singer. Promotion and conversion: streaming/presaves first (confirmed top goal), then mailing-list signups ("The Circle"), tour tickets, and industry contact. Success = a visitor plays a track or follows a streaming link.

## Positioning

The entire visual identity derives from the artist's wordmark: one hard diagonal cut (the Z), a black/white studio world, and a single red accent. No neighboring artist site could truthfully carry this system — it is the logo, systematized.

## Operating Context

- One route (`/`), long-scrolling, desktop-first at 1440px, verified to 390px.
- All copy is centralized in `content/site.ts`. Every `[BRACKETED]` string is an intentional placeholder awaiting real facts (titles, dates, emails, lyrics, bio). The bracket convention must be preserved; never invent copy to fill them.
- `public/audio/track-{1,2,3}.mp3` are silent placeholders for unreleased masters; the player is deliberately wired for real files later.
- The Circle form's submit handler is a deliberate stub pending a mailing-list API (Mailchimp/Klaviyo/etc.; captures email + city).
- Dev server: `npm run dev` on port 3400.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router) + TypeScript + Tailwind v4. React 19.
- Shared player state (hero plate, main player, fixed mini-player): `{ currentTrack, playing, elapsed, started }`; mini-player appears after first play; auto-advance on track end (configurable), stop after last.
- Config facts: `redTile: 'release' | 'show' | 'community' | 'merch'` (default `'show'`); `autoAdvance` default true.
- Undecided (awaiting real facts, not to be invented): single/track titles, release dates, tour dates, emails, lyrics, bio, press quote, WhatsApp/streaming URLs.

## Brand Commitments

The design handoff at `/Users/preemayall/Claude/zafar-handoff/design_handoff_zafar_homepage/README.md` (pixel reference: `Zafar Homepage.dc.html`) is LOCKED AND FINAL — colors, type, spacing, clip-paths, and interactions are final design intent, not a starting point. Pinned guardrails:

- One motif only: the Z's hard diagonal, via clip-path. Sharp corners everywhere. NO border-radius, NO gradients, NO emoji.
- Red `#E03A2F` reserved for CTAs and live/playing states ONLY; max one red bento tile.
- Cognac `#B4652F` is the story section background only. Amber `#C98A3B` is in-palette but currently unused.
- Exactly three fonts: Archivo (400/500/600), Archivo Black, Noto Sans Gurmukhi (600/700). No others; no neon/purple/blue.
- Never redraw, retype, or restack the logo — always the supplied PNG (`public/img/logo-black.png` lineage), black on white or inverted white on black.
- Voice: uppercase, terse, wide-tracked labels; numbered section headers (01 MUSIC … 07 WORK WITH ZAFAR).

## Evidence on Hand

- Photography: `public/img/hero-studio.jpg`, `couch.jpg`, `denim.jpg`, `film-red.jpg` (full-res originals in the handoff's `uploads/`).
- Logo: `public/img/logo-black.png` (trimmed wordmark, ~2.8:1).
- Featured video embed: `youtube-nocookie.com/embed/XGt6oHjTFn8`.
- Absent (must not be fabricated): real testimonials/press quotes, tour dates, release metadata, bio facts, contact emails, audio masters.

## Product Principles

1. Music first: the fastest path to hearing a track outranks every other element.
2. Placeholders are honest: bracketed stand-ins over invented facts, always.
3. The logo is the design system: every decoration traces to the Z's diagonal; anything else is off-brand.
4. Red means act: scarcity of the accent is what gives CTAs and live states their power.
5. Motion is transform+opacity only, always honoring reduced-motion.

## Accessibility & Inclusion

WCAG 2.1 AA (confirmed). The handoff's provisions are floor, not ceiling: `:focus-visible` red rings, `prefers-reduced-motion` kills all animation and smooth scroll, all hit targets ≥44px, tabular numerals on timecodes/dates.
