# Scroll Motion + Lenis: Design Spec

**Date:** 2026-07-02
**Status:** Draft for review
**Scope:** `portfolio_FE` (Astro site)

## 1. Overview

Add a smooth, "hyper" scroll feel to the portfolio and layer scroll-driven motion
and a few living content pieces on top, so the site feels alive to move through -
without abandoning the multi-page structure or the terminal/ASCII/Catppuccin identity.

The site stays four routes (`/`, `/projects`, `/about`, `/contact`). Navigation is
unchanged (sidebar links still route between pages via Astro `ClientRouter`). What
changes is how it *feels* to scroll each page.

## 2. Goals

- Buttery inertia scrolling site-wide via Lenis.
- Reveal-on-scroll for existing content (reuse the current `fade-up` animation).
- Parallax depth on the background layers (particles + glow blobs).
- Sticky/pinned section prompts.
- One tasteful scroll-scrubbed element (progress bar + a single hero accent).
- Three on-brand content additions: a music-to-code journey timeline (About),
  count-up stat tiles, and a footer system-status line.

## 3. Non-goals

- No merging of pages into a single-page app. The four routes remain.
- No replacement of the existing `ClientRouter` view-transition navigation.
- No heavy animation framework (no GSAP). Lenis is the only new dependency.
- No copyrighted content in the timeline (factual milestones only).

## 4. Chosen approach

**Lenis smooth scroll + effects driven off Lenis scroll events.** Native scroll is
the reduced-motion / touch fallback. Rejected alternatives: native-only (less
"liquid" than requested) and GSAP ScrollTrigger (heavier dep than needed here).

## 5. Architecture

### 5.1 `src/lib/smoothScroll.ts` (new)

Single module that owns one Lenis instance, the RAF loop, and all scroll
subscriptions (parallax, progress bar, scrub, count-up triggers). Exposes
`initSmoothScroll()` and `destroySmoothScroll()`.

Lenis config: `lerp ~0.1`, `smoothWheel: true`, `smoothTouch: false` (touch keeps
native scroll to avoid mobile jank), `wheelMultiplier ~1`.

### 5.2 Lifecycle with ClientRouter (critical)

`ClientRouter` swaps the DOM on every navigation, so Lenis and its observers must be
recreated per page:

- `astro:page-load` (fires on first load and after each navigation): destroy any
  existing instance, `initSmoothScroll()`, reset scroll to top, (re)bind the
  `IntersectionObserver`s for reveal/count-up.
- `astro:before-swap`: `destroySmoothScroll()` (destroy Lenis, cancel RAF, disconnect
  observers) to avoid a leaked loop across transitions.

Wired once from `BaseLayout.astro` via an inline module script so it is site-wide.

### 5.3 Reduced-motion guard

At init: if `matchMedia('(prefers-reduced-motion: reduce)').matches`, skip Lenis
entirely (native scroll), mark all `data-reveal` elements visible immediately, and
skip parallax/scrub/snap. One guard, checked once per init.

## 6. Effects

### 6.1 Reveal on scroll (reuses existing animation)

- Elements get `data-reveal` (+ optional `data-reveal-delay="N"` replacing
  `stagger-N`). Base state: `opacity: 0` + small translateY.
- An `IntersectionObserver` (threshold ~0.15) adds `.is-visible`, which triggers the
  existing `fade-up` motion. One-shot: unobserve after firing.
- Migrate current `opacity-0 animate-fade-up stagger-N` usages on Home / About /
  Projects to `data-reveal`. Same visual motion, now scroll-triggered instead of
  load-triggered.

### 6.2 Parallax

- `lenis.on('scroll')` translates layers with `data-parallax-speed` via
  `transform: translate3d(...)` (GPU-composited, no layout).
- Layers: global `ParticleBg`, home glow blobs.

### 6.3 Sticky / pinned

- Pure CSS `position: sticky` on per-page section prompts (`$ cat about.txt`,
  `$ ls projects/`) so the label pins near the top while its content scrolls past.
  No JS; degrades gracefully.

### 6.4 Scroll-scrubbed

- Fixed top **scroll-progress bar**, width driven by Lenis progress. Cheap, always-on.
- **One** hero accent on Home tied to scroll progress (glow intensity / subtle ASCII
  drift). Deliberately limited to a single scrubbed element to stay tasteful.

## 7. Content experiments (balanced latitude; keep/cut live)

### 7.1 A - Music-to-code journey timeline (About)

Vertical timeline that draws itself on scroll: the connecting line grows and nodes
reveal as they enter view; year labels use sticky. Nodes source from existing About
copy (music career → Nackademin → Sigma Connectivity, BLE/LE Audio). **Content input
needed from Andreas:** exact years/dates per node. Factual only - no lyrics or
copyrighted text. Pairs with reveal + sticky.

### 7.2 B - Count-up stat tiles

Mono stat tiles whose numbers tick up when scrolled into view (behind reduced-motion
guard: show final value immediately). Candidate stats: years in music, languages
shipped, BLE devices bench-tested. **Content input needed:** the real numbers.

### 7.3 D - Footer system-status line

Fixed bottom mono bar: short build hash, a "since"/uptime figure, and a Catppuccin
green `● online` dot. Build hash injected at build time (git short SHA via Astro env);
"since" is a static launch date. Subtle, always-on dev flourish.

## 8. Stretch experiments (optional, "not a must" - Phase 2, cuttable)

- **Scroll snapping:** snap between major sections or per-card in a gallery, using
  Lenis snap. Prototype by feel; cut if it fights the inertia feel.
- **Horizontal-scroll section:** pin the Projects gallery and translate it
  horizontally as the user scrolls vertically (transform-driven, off Lenis). Highest
  effort/risk item; explicitly last and the first to cut if it isn't paying off.

Both are prototyped live and kept only if they clearly improve the feel.

## 9. Per-page effect map

| Page     | Reveal              | Parallax            | Sticky              | Scrubbed              | Content        |
|----------|---------------------|---------------------|---------------------|-----------------------|----------------|
| Home     | hero stagger        | glow blobs + particles | -                | progress bar + hero accent | -         |
| About    | cards + stack icons | particles           | `cat about.txt`     | progress bar          | Timeline (A), Stats (B) |
| Projects | project cards       | particles           | `ls projects/`      | progress bar          | (Horizontal stretch) |
| Contact  | form block          | particles           | -                   | progress bar          | -              |
| Global   | -                   | -                   | -                   | -                     | Footer status (D) |

## 10. Dependencies

- Add `lenis` (pinned to a specific version). No other runtime deps.

## 11. Accessibility & performance guardrails

- `prefers-reduced-motion: reduce` → native scroll, content visible, no motion.
- Scroll-driven writes limited to `transform`/`opacity`, batched in the RAF tick - no
  layout thrash.
- Touch devices use native scroll (`smoothTouch: false`).
- In-page/anchor and keyboard scrolling routed through `lenis.scrollTo` so links stay
  smooth and functional.

## 12. Testing / verification

- `npm run build` passes.
- Manually drive each page at localhost: scroll feel, reveal timing, parallax,
  progress bar.
- Navigate between all four pages repeatedly to confirm Lenis teardown/re-init under
  `ClientRouter` (primary risk: leaked instance or dead scroll after navigation).
- Reduced-motion emulation in DevTools: verify motion disabled and content visible.
- Trackpad + touch sanity check.

## 13. Rollout order (one coherent change, reviewable steps)

1. Lenis lifecycle module + progress bar.
2. Reveal migration (`data-reveal`).
3. Parallax.
4. Sticky prompts.
5. Hero scrub.
6. Content: footer status (D), count-up stats (B), journey timeline (A).
7. Stretch (optional, by feel): snapping, horizontal Projects.

## 14. Open questions

- Timeline (A) exact years and stat (B) real numbers - needed from Andreas before
  those two land; everything else can proceed without them.

---

# Revision 2 (same day): One-page "terminal session" rebuild

Approved direction change after seeing v1: bigger, immersive, single-scroll.

## R2.1 Structure
- `/` becomes ONE continuous page: hero -> about -> journey -> tech marquee ->
  projects -> contact (footer reveal). Old routes (`/about`, `/projects`,
  `/contact`) become meta-refresh redirects to `/#<section>`.
- Sidebar links become smooth Lenis anchor jumps with a scroll-spy active state.
- Lenis snap (`lenis/snap`, proximity) on major section starts; no snap inside
  the horizontal journey zone.

## R2.2 Showpieces
- **Journey**: pinned section, vertical scroll drives milestone boxes
  horizontally (terminal-card filmstrip). Vertical stack fallback on mobile.
- **Tech marquee**: devicons in an infinite marquee; drifts idle, accelerates and
  skews with scroll velocity.
- **Hero dissolve**: ASCII ROOS scales/blurs/fades through into about.
- **Projects**: sticky stacking cards (replaces carousel presentation).
- **Footer reveal**: page lifts at the end to expose the contact panel.
- Ghost oversized section numerals (01/02/03) with counter-parallax.
- Section prompts type themselves (command typing + caret) on entry.
- Per-word masked text reveals in about paragraphs.

## R2.3 Particle background rework (performance)
- Replace the always-animating canvas `ParticleBg` with 3-4 STATIC particle
  layers (each painted once per resize, Catppuccin-tinted, different sizes and
  densities) that move only via scroll parallax (`translate3d` + modulo wrap).
  Zero idle cost, compositor-only during scroll.

## R2.4 Cuts
- Count-up stat tiles (v1 section 7.2): removed entirely per Andreas.
- Vertical About timeline (v1 7.1): replaced by the horizontal journey.
