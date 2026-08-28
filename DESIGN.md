---
name: Zafar Sandhu — Artist Homepage
description: Black/white studio world cut by the Z's diagonal, with one red reserved for action.
colors:
  ink: "#0D0D0D"
  plaid-red: "#DC372D"
  cognac: "#B4652F"
  studio-white: "#FFFFFF"
  warm-paper: "#F5F1EC"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(36px, 5vw, 72px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(24px, 2.6vw, 40px)"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  display-sm:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1
  title-lg:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
  title-sm:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.2
  body-sm:
    fontFamily: "Archivo, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: "Archivo, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.16em"
  label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.24em"
  label-sm:
    fontFamily: "Archivo, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.18em"
  label-xs:
    fontFamily: "Archivo, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    letterSpacing: "0.24em"
  gurmukhi:
    fontFamily: "Noto Sans Gurmukhi, sans-serif"
    fontSize: "clamp(26px, 3vw, 42px)"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  none: "0px"
spacing:
  tile-gap: "14px"
  gutter: "clamp(20px, 4vw, 56px)"
  section-y: "clamp(56px, 7vw, 110px)"
  section-gap: "clamp(28px, 4vw, 72px)"
components:
  button-cta:
    backgroundColor: "{colors.plaid-red}"
    textColor: "{colors.studio-white}"
    rounded: "{rounded.none}"
    height: "52px"
    padding: "0 44px 0 30px"
  button-cta-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.studio-white}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.studio-white}"
    rounded: "{rounded.none}"
    height: "52px"
    padding: "0 40px 0 24px"
  button-ink-hover:
    backgroundColor: "{colors.plaid-red}"
    textColor: "{colors.studio-white}"
  tile:
    backgroundColor: "{colors.studio-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "28px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.studio-white}"
    rounded: "{rounded.none}"
    height: "48px"
---

# Design System: Zafar Sandhu — Artist Homepage

## Overview

**Creative North Star: "The White Studio"**

Everything happens in one bright room. The page is the white studio from the hero photograph: white ground, hard black type, daylight flatness — and through it, one hard diagonal of light, the Z from the wordmark. That diagonal is the system's only decoration. It cuts button edges, tile corners, image crops, progress-fill tips, and the hero photo's left edge. Nothing is rounded, nothing glows, nothing is drawn that couldn't be cut.

Two rooms sit inside the studio: the black sections (player, community, mobile menu, mini-player) are the booth — lights down, music up — and the single cognac section is the leather-couch corner where the story is told. Red appears only when something demands action or is live right now: a CTA, a playing track, a focus ring. Its rarity is the entire reason it works.

The system is derived, not styled: every rule traces back to the supplied wordmark PNG. The design handoff at `zafar-handoff/design_handoff_zafar_homepage/` is locked and final; this file documents it, it does not reopen it.

**Key Characteristics:**
- One motif: the Z's hard diagonal, always via `clip-path`
- Black/white studio world; cognac for one story room; red only for action and liveness
- Uppercase, wide-tracked Archivo labels against massive Archivo Black display
- Flat as a poster — depth comes from ink borders and room changes, never shadows
- Motion is transform + opacity only, on one signature easing

## Colors

A near-monochrome studio palette where the two warm colors are artifacts of the photography: cognac from the leather couch, red from a 35mm plaid film scan.

### Primary
- **Plaid Red** (#DC372D): CTAs and live states ONLY — LISTEN, JOIN, PRESAVE, TICKETS hover, playing-state fills and `NOW PLAYING` labels, focus rings. The source red was deepened slightly so white CTA labels pass WCAG AA. Named for the 35mm plaid film scan it was pulled from. At most one red bento tile per page (config default: TOP RELEASE).

### Secondary
- **Cognac** (#B4652F): the story section background, and nothing else. The leather-couch room.

### Neutral
- **Ink** (#0D0D0D): all text on white; the ground of black sections (player, community, mobile menu, mini-player).
- **Studio White** (#FFFFFF): dominant page ground; text on black and red.
- **Warm Paper** (#F5F1EC): hover ground of the hero mini-player plate — the only off-white in the system.
- **Muted ink** (rgba(13,13,13,0.55–0.6)): overlines and captions on white.
- **Muted white** (rgba(255,255,255,0.4–0.72)): secondary text on black; borders on black use lower alphas (0.22–0.5).

Amber (#C98A3B, from the denim shoot) is in the palette but deliberately unused — reserved for future warm surfaces. Do not introduce it without a decision.

### Contrast floors

Muted text is tinted by opacity, which is where every contrast failure in this
system comes from. The floors, measured against the real composited grounds:

- **On white:** `ink/60` (5.11:1). Never go lighter for text.
- **On ink:** `white/55` (6.25:1). Never go lighter for text.
- **On cognac:** pure `#000` (4.84:1). This is the one place the system uses
  black rather than Ink — Ink lands at 4.48:1 and no white passes at all
  (white is 4.34:1), so the 4.5:1 floor is simply unreachable otherwise. The
  H2 and the Gurmukhi name stay white because both are large text (3:1).

**Two known exceptions**, both forced by the pinned red and both needing a
product decision rather than a code change: white on Plaid Red measures
**4.36:1** and Plaid Red on Ink measures **4.46:1**, against a 4.5:1
requirement for text under 18.66px bold. Darkening the red breaks the brand
law; enlarging CTA labels to 18.66px bold breaks the button system. They are
recorded here rather than silently accepted.

### Named Rules
**The One Red Rule.** Plaid Red means "act" or "live, right now" — nothing else, ever. If red appears somewhere that is neither a CTA nor a playing/live state, it is a defect. Max one red bento tile.

**The Three Rooms Rule.** White studio (default), black booth (music and community), cognac corner (story). No fourth room; no gradients between rooms — sections change color at a hard edge.

## Typography

**Display Font:** Archivo Black (sans-serif fallback)
**Body/UI Font:** Archivo 400/500/600 (sans-serif fallback)
**Accent Font:** Noto Sans Gurmukhi 600/700 — Punjabi script only

**Character:** Gig-poster confidence. Display is huge, uppercase, and tight (`line-height: 0.95`); everything functional is small, semibold, uppercase, and tracked wide open (0.14em–0.24em). The gap between the two sizes IS the hierarchy — there is almost no middle register.

### Hierarchy
- **Display** (Archivo Black, clamp(36px, 5vw, 72px), lh 0.95, ls -0.01em, `text-wrap: balance`): section H2s — FIRST TRANSMISSIONS, IN FRAME, THE CIRCLE.
- **Headline** (Archivo Black, clamp(24px, 2.6vw, 40px)): current-track title in the player.
- **Title** (Archivo Black, 17–21px): track rows, tile titles, plate titles, mobile menu links (34px).
- **Body** (Archivo 400, 15–16px, lh 1.6–1.7): paragraphs; bio, community copy, panel copy.
- **Label** (Archivo 600, 11–13px, uppercase, tracking 0.14em–0.24em): overlines, nav, captions, buttons. The tighter the tracking, the more nav-like; the wider, the more overline-like (overline = 12px/0.24em). One sanctioned exception below the 11px floor: the hero plate's `TOP SINGLE` / `NOW PLAYING` label is 10px/600/0.24em, specified that size by the handoff. It is the only 10px functional text in the system; a scanner flagging it is reading intent as drift.
- **Gurmukhi** (Noto Sans Gurmukhi 700, clamp(26px, 3vw, 42px)): the story headline "ਜ਼ਫ਼ਰ ਸੰਧੂ"; 600/17px/lh 2.0 for lyrics columns.

### Named Rules
**The Tabular Rule.** `font-variant-numeric: tabular-nums` on every timecode and date, no exceptions (utility class `.tnum`).

**The Three Fonts Rule.** Archivo, Archivo Black, Noto Sans Gurmukhi. A fourth font is a defect.

**The Section Header Rule.** Every section opens with the same pair: numbered overline (`0N — SECTION NAME`, 12px/600/0.24em, 55% opacity) over a Display H2. Numbering is sequential across the page: 01 MUSIC … 07 WORK WITH ZAFAR.

## Layout

One long-scrolling page, desktop-first at 1440px, verified to 390px. Sections are full-bleed color fields with a shared horizontal gutter (`clamp(20px, 4vw, 56px)`) and vertical padding (`clamp(56px, 7vw, 110px)`); inner content maxes at 1240px in the music section, 760px centered in community.

Rhythm is fluid: nearly every gap, padding, and size is a `clamp()`. The one fixed rhythm is the 14px grid gap shared by the gallery and bento grids. The gallery runs a 12-column grid with `grid-auto-rows: 76px`; the bento is 4 columns; both collapse to a single column at the 760px breakpoint — the page's only breakpoint. Below it: the hero stacks `column-reverse` so the content block leads and the photo follows beneath it, its diagonal moving to its top edge (`polygon(0 9vw, 100% 0, 100% 100%, 0 100%)`) to cut the seam between them; nav becomes a full-screen black hamburger overlay, the player grid stacks, tour rows wrap, forms stack.

Density is generous on white, tighter in the booth: black sections pack ledger rows at 56px min-height with hairline borders.

## Elevation & Depth

No shadows, anywhere. The world is poster-flat; depth is conveyed by room changes (white → black → cognac), 1px ink or alpha-white borders, and layering order (sticky nav at `z-100` over content, mini-player fixed above that, mobile menu at `z-300`). The nav's `backdrop-filter: blur(8px)` over `rgba(255,255,255,0.94)` is the single translucency in the system.

### Named Rules
**The Flat World Rule.** If an element needs to come forward, it inverts color, gains a 1px border, or moves (`translateY(-4px)`) — it never casts a shadow.

## Shapes

Sharp corners everywhere; `border-radius: 0` is absolute. The only permitted deviation from the rectangle is the Z's diagonal, applied via `clip-path` in four canonical recipes (utility classes in `app/globals.css`):

- **Right-edge cut** (`.cut-r`): `polygon(0 0, 100% 0, calc(100% - var(--cut, 16px)) 100%, 0 100%)` — buttons, progress-fill tips, small thumbs. The offset scales with element size (4px on a progress tip, 8–10px on small squares, 14–20px on buttons).
- **Corner cut** (`.cut-corner`): bottom-right corner sliced at `var(--cc, 32px)` — bento tiles, bookings panels, story/gallery images.
- **Large crop** (`.cut-crop`): double-diagonal bottom-right, 44px deep / 88px wide — featured video frame, large gallery images.
- **Hero edge**: the photo's left edge, `polygon(clamp(48px, 8vw, 132px) 0, 100% 0, 100% 100%, 0 100%)`; flips to a top-edge cut (`polygon(0 9vw, 100% 0, 100% 100%, 0 100%)`) when the hero stacks on mobile.

Borders are always 1px (ink on white; alpha-white on black), except the 2px underline that marks link hover and the 2px red focus outline.

### Named Rules
**The Blade Rule.** All decoration is the diagonal. If an ornament is not a clip-path cut at the Z's angle family, it does not belong: no radius, no gradients, no emoji, no icons beyond the ▶ / ❚❚ / ↗ / ↓ / ✕ glyph set.

## Components

Philosophy: **cut, not drawn.** Every component reads as if sliced from the page by the Z's blade — hard 1px borders, a diagonal exit on the action edge, and full color inversion (never tinting) on hover.

### Buttons
- **Shape:** rectangle with diagonal right edge (`.cut-r`, offset 14–20px); sharp everywhere else. Min-height 44–56px by importance (CTA 52px, transport 56px, TICKETS 44px).
- **CTA (red):** Plaid Red ground, white uppercase label (13–14px/600/0.16–0.18em); hover → ink ground + `translateX(4px)`.
- **Ink:** ink ground, white label; hover → red ground. Used for LATEST VIDEO, PRESS KIT, BOOK A SHOW.
- **Outline:** white/transparent ground, 1px border (ink on white, 50% white on black); hover inverts — TICKETS goes red on hover, LYRICS and the ✕ close invert to white/ink.
- **Focus:** 2px solid Plaid Red outline, 3px offset — universal for links, buttons, inputs.

### Tiles (bento)
- **Corner Style:** bottom-right corner cut (32px); 1px ink border.
- **Structure:** overline (11px/600/0.22em, 60%) → Archivo Black title → bottom action line (13px/600/0.14em with →).
- **Hover:** lift `translateY(-4px)`; no shadow, no color change.
- **Red variant:** exactly one tile per page (config `redTile`, default NEXT SHOW): red ground, white text.

### Bordered panels
- **Corner Style:** bottom-right corner cut (32px); 1px ink border; padding 32px 28px.
- **Structure:** overline (11px/600/0.22em, 60%) → body copy (15px/lh 1.6, max-width 420px, `text-wrap: pretty`) → action button → mailto meta line (12px/0.12em, 55%).
- **Static at rest:** unlike bento tiles, panels do not lift on hover — only the button inside them responds. Used for LIVE BOOKINGS, COLLABORATIONS, and the full-width PRESS panel, which swaps the copy stack for a quote (Archivo Black, clamp(18px, 1.8vw, 24px), `text-wrap: balance`) beside its button.

### Gallery figures
- **Grayscale by default** (`filter: grayscale(1)`); hover restores color (0.45s ease) and scales the image `1.02` (0.8s signature easing). Color arrives as a reward for attention.
- **Captions:** absolute bottom-left (12px/14px inset), 11px/600/0.18em uppercase, white with `mix-blend-mode: difference` so they stay legible over any photograph without a scrim.
- **Cropping:** most cells are plain rectangles; selected cells carry the 44/88px double-diagonal crop. Cells sit on a 12-column grid with `grid-auto-rows: 76px`, collapsing to full-width, 320px-min rows below 760px.

### Inputs / Fields
- **Style:** transparent, borderless except a 1px 50%-white bottom border; white text; placeholder 38% white; min-height 48px. (Inputs exist only in the black community room.)
- **Focus:** the universal red outline.

### Ledger rows (tracklist, releases, tour)
- Flex rows over 1px hairline bottom borders (22–30% white on black; 25% ink on white), 56px min-height, tabular numerals for numbers/dates/durations.
- **Hover:** text brightens to full ink/white + a `padding-left` slide (14–16px). Active track: red number, white title.
- Per-row ↗ stream/ticket affordance at the right edge.

### Navigation
- Sticky 64px bar, `rgba(255,255,255,0.94)` + 8px blur, 1px ink bottom border. Logo PNG at 22px tall left; 12px/600/0.14em uppercase links right; hover = 2px ink underline; 44px min hit areas.
- **≤760px:** hamburger (three 2px ink bars, middle 70% width) → full-screen fixed black overlay: diagonal-cut ✕, Archivo Black 34px white links, small inverted logo bottom-left.

### The Scrubber (signature)

The diagonal tip is the handle. Because the fill is full width inside a
clipping track and slides by `translateX`, the Z's cut keeps a constant angle
at every position, which is exactly what lets it read as a grab point rather
than a decoration. The track appears at two sizes — 34px in the booth, 18px in
the mini-player — and both sit inside a 44px hit area, so the control is
thumb-sized without redrawing the bar.

- **Pointer:** click anywhere to seek; drag to scrub with pointer capture. The
  fill drops its transition while dragging so it sits under the finger rather
  than easing toward it, and the audio is only committed on release.
- **Keyboard:** ←/→ and ↑/↓ move 5s, PageUp/PageDown 30s, Home/End jump to the
  ends. All clamped to the track.
- **Screen reader:** `role="slider"` with `aria-valuemin/max/now`, an
  `aria-valuetext` of `m:ss of m:ss`, and `aria-orientation="horizontal"`.
- **While scrubbing**, the left timecode reads the *target* position and turns
  red — the one place red marks intent rather than playback.
- The hero plate's 4px strip stays a pure indicator: it is inside the plate's
  own button, and a control within a control is neither valid nor operable.

### The Player family (signature)
One shared state drives three faces: the hero **plate** (white, 1px ink border, diagonal right edge, 4px progress strip pinned to its bottom), the **main transport** (black room: 56px diagonal-cut play button, 34px-tall bordered progress bar whose fill tip is diagonal-cut), and the fixed bottom **mini-player** (appears after first play, slides up, persists). Playing state is always the same signal: fills and labels go red, `NOW PLAYING` replaces the idle label. Paused fills are white (on black) or ink (on white). Progress width transitions 0.25s linear; everything else uses the signature easing.

### Motion grammar
- Signature easing `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-zaf`); transform + opacity only.
- Load-in (once): logo slides along the diagonal (`translate3d(-52px, 26px, 0)` → none, 0.9s); photo fades from `scale(1.025)`; tagline/buttons/plate stagger up at 0.3–0.6s delays.
- Scroll reveals: `opacity 0 / translateY(26px)` → none, 0.75s, IntersectionObserver at ~0.12, once each; first-viewport elements don't animate.
- Hovers: buttons `translateX(4px)`, tiles `translateY(-4px)`, rows `padding-left` slide, gallery de-grayscales (`filter 0.45s ease`) + `scale(1.02)` (0.8s signature easing).
- `prefers-reduced-motion: reduce` is an intentional alternative, not a blanket
  kill: the entrance choreography and scroll reveals are removed outright, and
  hover/state travel resolves instantly, but colour and opacity keep
  transitioning so state changes stay legible — and the player's fill keeps
  moving, because progress is information rather than ornament.
- **Progress fills slide, they do not grow.** The fill is always full width
  inside a clipping track and moves by `translateX`, so the diagonal tip keeps
  a constant angle at every position. Growing the element (animating `width`)
  bends it, because the clip-path is measured on the element's own box — near
  0% the cut consumes the whole element and the bar degenerates into a wedge.
  Scaling it (`scaleX`) bends it the same way. The slide is also the only one
  of the three that stays on the compositor. Row hovers keep `padding-left`,
  which is a genuine layout animation but hover-only and confined to one row;
  `translateX` there would move the row's border rather than its content.

### The logo
Always the supplied PNG (`public/img/logo-black.png`), black on white or `filter: invert(1)` on black. Never redrawn, retyped, restacked, or recolored. Sizes: nav 22px tall, hero `clamp(320px, 60vw, 880px)` wide, community `clamp(180px, 24vw, 280px)` inverted, footer 20px, mobile menu 140px inverted.

## Do's and Don'ts

### Do:
- **Do** derive every decorative choice from the diagonal: `.cut-r` on action edges, `.cut-corner` on tiles/panels, `.cut-crop` on large media.
- **Do** invert colors fully on hover (red↔ink, white↔ink) and pair it with a small transform; tinting or opacity-fading a button is off-system.
- **Do** keep labels uppercase Archivo 600 at 11–13px with 0.14–0.24em tracking, and timecodes/dates tabular.
- **Do** keep the section-header pair (numbered overline + Display H2) on every new section, continuing the sequence.
- **Do** keep all motion transform+opacity on `cubic-bezier(0.16, 1, 0.3, 1)`, gated by `prefers-reduced-motion`.
- **Do** keep hit targets ≥44px and the red `:focus-visible` outline universal.

### Don't:
- **Don't** use border-radius, gradients, shadows, or emoji — anywhere, ever.
- **Don't** let Plaid Red touch anything that is not a CTA or a live/playing state; never more than one red bento tile.
- **Don't** use Cognac outside the story section, or introduce Amber (#C98A3B) without a decision.
- **Don't** add a fourth font, a fifth glyph, or any icon library.
- **Don't** redraw, retype, restack, or recolor the logo — supplied PNG only, black or inverted white.
- **Don't** replace `[BRACKETED]` placeholder copy with invented facts; brackets are the honest state until real content lands (all copy lives in `content/site.ts`).
