import Lenis from "lenis";

/**
 * Scroll engine for the one-page "terminal session" site.
 *
 * Owns the Lenis instance, its RAF loop, snap points, and every scroll-driven
 * effect: progress bar, hero dissolve, wrapped particle parallax, relative
 * parallax (ghost numerals), the pinned horizontal journey, the velocity
 * marquee, typed prompts, reveal-on-scroll, and the sidebar scroll spy.
 *
 * Astro's ClientRouter swaps the DOM per navigation, so everything is torn
 * down on `astro:before-swap` and rebuilt on `astro:page-load`.
 */

let lenis: Lenis | null = null;
let rafId = 0;
/** True while an anchor-click scroll is in flight (section walls stand down). */
let anchorBypass = false;
const observers: IntersectionObserver[] = [];
const cleanups: Array<() => void> = [];

const prefersReducedMotion = (): boolean =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isDesktop = (): boolean =>
    window.matchMedia("(min-width: 768px)").matches;

function nativeProgress(): number {
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    return max > 0 ? el.scrollTop / max : 0;
}

/* ------------------------------------------------------------------ */
/* Reveal on scroll (one-shot)                                         */
/* ------------------------------------------------------------------ */

function setupReveal(): void {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;

    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
            }
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));
    observers.push(io);
}

/* ------------------------------------------------------------------ */
/* Typed command prompts                                               */
/* ------------------------------------------------------------------ */

/**
 * `<span data-type-cmd="cat about.txt"></span>` types itself out when it
 * scrolls into view, with a blinking caret while typing.
 */
function setupTypedPrompts(reduced: boolean): void {
    const els = document.querySelectorAll<HTMLElement>("[data-type-cmd]");
    if (!els.length) return;

    if (reduced) {
        els.forEach((el) => (el.textContent = el.dataset.typeCmd ?? ""));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const el = entry.target as HTMLElement;
                io.unobserve(el);

                const text = el.dataset.typeCmd ?? "";
                el.classList.add("is-typing");
                let i = 0;
                const interval = window.setInterval(() => {
                    el.textContent = text.slice(0, ++i);
                    if (i >= text.length) {
                        window.clearInterval(interval);
                        el.classList.remove("is-typing");
                        el.classList.add("is-typed");
                    }
                }, 45);
                cleanups.push(() => window.clearInterval(interval));
            }
        },
        { threshold: 0.6 },
    );

    els.forEach((el) => io.observe(el));
    observers.push(io);
}

/* ------------------------------------------------------------------ */
/* Sidebar scroll spy                                                  */
/* ------------------------------------------------------------------ */

function setupScrollSpy(reduced: boolean): void {
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    if (!sections.length) return;

    const dock = document.getElementById("dock-cmd");
    const sigil = document.getElementById("dock-sigil");
    let dockTimer = 0;
    let currentActive = "";

    // (The dock sits at a fixed left inside the sidebar column - see
    // BaseLayout - so no measurement is needed.)

    /** Re-type the active section's command into the docked prompt. */
    const dockType = (section: HTMLElement) => {
        const cmd = section.dataset.cmd;
        if (!dock || cmd == null) return;
        if (sigil) sigil.style.color = section.dataset.cmdColor ?? "#a6e3a1";
        window.clearInterval(dockTimer);
        if (reduced) {
            dock.textContent = cmd;
            return;
        }
        let i = 0;
        dock.textContent = "";
        dockTimer = window.setInterval(() => {
            dock.textContent = cmd.slice(0, ++i);
            if (i >= cmd.length) window.clearInterval(dockTimer);
        }, 40);
    };
    cleanups.push(() => window.clearInterval(dockTimer));

    const setActive = (section: HTMLElement) => {
        const name = section.dataset.section ?? "";
        if (name === currentActive) return;
        currentActive = name;
        document.querySelectorAll<HTMLElement>("[data-spy]").forEach((link) => {
            link.classList.toggle("spy-active", link.dataset.spy === name);
        });
        // Lets CSS react to focus (e.g. ghost numerals brightening).
        sections.forEach((s) => s.classList.toggle("section-active", s === section));
        dockType(section);
    };

    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                setActive(entry.target as HTMLElement);
            }
        },
        // A narrow band around the viewport center decides the active section.
        { rootMargin: "-40% 0px -50% 0px" },
    );

    sections.forEach((el) => io.observe(el));
    observers.push(io);

    // The contact panel is a fixed element, so the center-band observer never
    // fires for it - activate it by overall scroll progress instead.
    const contactSec = document.querySelector<HTMLElement>('[data-section="contact"]');
    if (contactSec && lenis) {
        const onSpyScroll = () => {
            if (lenis && lenis.progress > 0.985) setActive(contactSec);
        };
        lenis.on("scroll", onSpyScroll);
    }
}

/* ------------------------------------------------------------------ */
/* Card-stack journey (pinned coaster pile)                            */
/* ------------------------------------------------------------------ */

type CardStack = {
    section: HTMLElement;
    cards: HTMLElement[];
    top: number;
    /** Vertical scroll spent per landing card. */
    per: number;
    /** Total scrubbed travel (cards after the first). */
    distance: number;
    buffer: number;
    offX: number;
    offY: number;
};

function measureCardStacks(): CardStack[] {
    if (!isDesktop()) return [];
    const result: CardStack[] = [];

    for (const section of document.querySelectorAll<HTMLElement>("[data-cardstack]")) {
        const cards = Array.from(
            section.querySelectorAll<HTMLElement>("[data-stack-card]"),
        );
        if (cards.length < 2) continue;

        // Generous read-time: each coaster owns ~0.9 viewport of scroll.
        const per = Math.round(window.innerHeight * 0.9);
        const distance = (cards.length - 1) * per;
        // Cushion on entry and exit: pinned, but the pile holds still for
        // this much vertical scroll before/after the landing sequence.
        const buffer = Math.round(window.innerHeight * 0.45);
        // Cascade offset per card; keep in sync with .journey-stack CSS vars.
        const offX = parseFloat(section.dataset.offX ?? "26");
        const offY = parseFloat(section.dataset.offY ?? "48");

        section.style.height = `${window.innerHeight + distance + buffer * 2}px`;
        const top = section.getBoundingClientRect().top + window.scrollY;
        result.push({ section, cards, top, per, distance, buffer, offX, offY });
    }
    return result;
}

/* ------------------------------------------------------------------ */
/* Pinned dwell sections                                               */
/* ------------------------------------------------------------------ */

/**
 * `data-pin="0.6"` gives a section 60vh of extra height; its `.pin-viewport`
 * child sticks for that dwell, so every page holds you (journey-style)
 * before releasing - without any horizontal travel.
 */
function applyPins(): void {
    for (const section of document.querySelectorAll<HTMLElement>("[data-pin]")) {
        // Mobile skips pins unless the section opts in (data-pin-mobile,
        // e.g. the hero so its explosion plays on a held screen).
        if (!isDesktop() && !section.hasAttribute("data-pin-mobile")) {
            section.style.height = "";
            continue;
        }
        const dwell = parseFloat(section.dataset.pin ?? "0.6");
        section.style.height = `${Math.round(window.innerHeight * (1 + dwell))}px`;
    }
}

/* ------------------------------------------------------------------ */
/* Pinned horizontal filmstrips (featured projects showcase)           */
/* ------------------------------------------------------------------ */

type HScroll = {
    section: HTMLElement;
    track: HTMLElement;
    /** Optional headline: rides in with the track, then docks centered. */
    headline: HTMLElement | null;
    /** Viewport x of the first card's leading edge at zero travel. */
    cardEdge: number;
    /** Docked (centered) viewport x for the headline. */
    dockLeft: number;
    /** Track x of the last card's trailing edge (for the shared exit). */
    cardsEnd: number;
    headlineW: number;
    /** Chapter-cover mark that the first card pushes out to the left. */
    pushEl: HTMLElement | null;
    /** Track travel at which the first card touches the mark's right edge. */
    pushStart: number;
    /** Travels at which each spotlight card pauses (pinned), and for how long. */
    pausePoints: number[];
    pauseLen: number;
    /** Spotlight cards + the headline sigil that adopts their accent color. */
    spotlightEls: HTMLElement[];
    sigilEl: HTMLElement | null;
    /** Detached finale arrow: rides its virtual track position, then docks. */
    arrowEl: HTMLElement | null;
    arrowEntry: number;
    top: number;
    distance: number;
    buffer: number;
};

function measureHScrolls(): HScroll[] {
    if (!isDesktop()) return [];
    const result: HScroll[] = [];

    for (const section of document.querySelectorAll<HTMLElement>("[data-hscroll]")) {
        const track = section.querySelector<HTMLElement>("[data-hscroll-track]");
        if (!track) continue;

        const viewport = section.querySelector<HTMLElement>(".hscroll-viewport");
        const visible = viewport?.clientWidth ?? window.innerWidth;

        // Cushion on entry and exit: pinned, but the track holds still for
        // this much vertical scroll before/after the sideways travel.
        const buffer = Math.round(window.innerHeight * 0.4);
        // Every spotlight card pauses (pinned) at the same stage position so
        // each project gets its moment under the docked headline.
        const dockX = Math.round(window.innerWidth * 0.19);
        const pauseLen = Math.round(window.innerHeight * 0.45);
        const spotlights = Array.from(
            track.querySelectorAll<HTMLElement>("[data-spotlight]"),
        );
        const pausePoints = spotlights
            .map((el) => el.offsetLeft - dockX)
            .filter((p) => p > 0)
            .sort((a, b) => a - b);
        // The detached arrow trails well behind the last card (a beat of
        // scroll before it reveals) and docks under the headline; travel
        // ends exactly at its dock, with the last card long gone by then.
        const lastSpot = spotlights[spotlights.length - 1];
        const lastRight = lastSpot ? lastSpot.offsetLeft + lastSpot.offsetWidth : 0;
        const arrowEl = section.querySelector<HTMLElement>("[data-hscroll-arrow]");
        const arrowEntry = lastRight + Math.round(window.innerWidth * 0.45);
        const distance = lastSpot
            ? Math.max(lastRight + 32, arrowEntry - dockX)
            : Math.max(0, track.scrollWidth - visible * 0.45);
        if (distance <= 0) continue;
        section.style.height =
            `${window.innerHeight + distance + pausePoints.length * pauseLen + buffer * 2}px`;
        const top = section.getBoundingClientRect().top + window.scrollY;
        const headline = section.querySelector<HTMLElement>("[data-hscroll-headline]");
        // Track pads the first card 92vw in; the headline's left edge rides
        // flush with that card's edge and docks exactly where the card's
        // left edge sits during its pause - they stop aligned.
        const cardEdge = Math.round(window.innerWidth * 0.92);
        const headlineW = headline?.offsetWidth ?? 0;
        // The headline docks at the spotlight position, aligned with every
        // paused card's left edge.
        const dockLeft = dockX;
        // Last card's right edge in track coordinates (right pad is 6vw).
        const cardsEnd = Math.round(track.scrollWidth - window.innerWidth * 0.06);
        // The chapter cover's mark (a sibling block in the same section) gets
        // pushed out by the first card: contact at its right edge.
        const pushEl =
            section.closest("section")?.querySelector<HTMLElement>("[data-cover-content]") ?? null;
        // Keep an air gap: the push begins while the card is still this far
        // from the mark, so they travel together without touching.
        const PUSH_GAP = 56;
        const pushStart = pushEl
            ? Math.round(cardEdge - pushEl.getBoundingClientRect().right - PUSH_GAP)
            : 0;
        const sigilEl = section.querySelector<HTMLElement>("[data-headline-sigil]");
        result.push({
            section, track, headline, cardEdge, dockLeft, cardsEnd, headlineW,
            pushEl, pushStart, pausePoints, pauseLen, arrowEl, arrowEntry,
            spotlightEls: spotlights, sigilEl, top, distance, buffer,
        });
    }
    return result;
}

/* ------------------------------------------------------------------ */
/* Chapter covers (title slides that fade into the docked prompt)      */
/* ------------------------------------------------------------------ */

type Cover = { content: HTMLElement; top: number; dist: number };

/** `[data-cover]` blocks pin (via data-pin) while their `[data-cover-content]`
 *  fades and lifts away over the pin's dwell distance. */
function measureCovers(): Cover[] {
    if (!isDesktop()) return [];
    const result: Cover[] = [];
    for (const el of document.querySelectorAll<HTMLElement>("[data-cover]")) {
        const content = el.querySelector<HTMLElement>("[data-cover-content]");
        if (!content) continue;
        const dist = Math.max(1, el.offsetHeight - window.innerHeight);
        const top = el.getBoundingClientRect().top + window.scrollY;
        result.push({ content, top, dist });
    }
    return result;
}

/* ------------------------------------------------------------------ */
/* Entry hold (for sections too tall to pin, e.g. the projects grid)   */
/* ------------------------------------------------------------------ */

type Hold = { content: HTMLElement; top: number; dist: number };

/**
 * `data-hold="0.9"`: on arrival the section's `[data-hold-content]` counter-
 * translates against the scroll for 0.9 viewport - visually frozen, like a
 * pin dwell - then releases into normal scrolling. The section gets matching
 * bottom margin so the released content doesn't spill into the next section.
 */
function measureHolds(): Hold[] {
    if (!isDesktop()) {
        document
            .querySelectorAll<HTMLElement>("[data-hold]")
            .forEach((s) => (s.style.marginBottom = ""));
        return [];
    }
    const result: Hold[] = [];
    for (const section of document.querySelectorAll<HTMLElement>("[data-hold]")) {
        const content = section.querySelector<HTMLElement>("[data-hold-content]");
        if (!content) continue;
        const dist = Math.round(
            window.innerHeight * parseFloat(section.dataset.hold ?? "0.9"),
        );
        section.style.marginBottom = `${dist}px`;
        // Engage 15vh early, while the block's top edge is still in view -
        // otherwise the first rows scroll past before the hold catches.
        const top =
            section.getBoundingClientRect().top +
            window.scrollY -
            Math.round(window.innerHeight * 0.15);
        result.push({ content, top, dist });
    }
    return result;
}

/* ------------------------------------------------------------------ */
/* Relative parallax (ghost numerals etc.)                             */
/* ------------------------------------------------------------------ */

type RelParallax = { el: HTMLElement; speed: number; base: number };

function measureRelParallax(): RelParallax[] {
    const result: RelParallax[] = [];
    for (const el of document.querySelectorAll<HTMLElement>("[data-parallax-rel]")) {
        const speed = parseFloat(el.dataset.parallaxRel ?? "0.15");
        const base = el.getBoundingClientRect().top + window.scrollY;
        result.push({ el, speed, base });
    }
    return result;
}

/* ------------------------------------------------------------------ */
/* Scroll-driven frame update                                          */
/* ------------------------------------------------------------------ */

function bindScrollDriven(reduced: boolean): void {
    const bar = document.getElementById("scroll-progress");
    const hue = document.getElementById("bottom-hue");
    const heroScrub = reduced
        ? null
        : document.querySelector<HTMLElement>("[data-hero-scrub]");
    const wrapLayers = reduced
        ? []
        : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-wrap]"));

    // Order matters: pins add height, which shifts everything below them,
    // so they must be applied before any position is measured.
    if (!reduced) applyPins();
    let stacks = reduced ? [] : measureCardStacks();
    let hscrolls = reduced ? [] : measureHScrolls();
    let holds = reduced ? [] : measureHolds();
    let covers = reduced ? [] : measureCovers();
    let relParallax = reduced ? [] : measureRelParallax();

    // Section walls: scroll momentum dies exactly at each section start; the
    // next gesture continues past it. No snap animation, just a stop.
    // Desktop only: braking scrollTo calls fight native touch momentum.
    const measureWalls = (): number[] =>
        !isDesktop() ? [] :
        Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"))
            .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
            // The first section starts ~100px in; a wall there would halt the
            // very first scroll gesture for nothing.
            .filter((w) => w > window.innerHeight * 0.5)
            .sort((a, b) => a - b);
    let walls = reduced ? [] : measureWalls();
    let lastScroll = window.scrollY;
    let braking = false;

    if (!reduced) {
        let resizeTimer = 0;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                for (const s of stacks) s.section.style.height = "";
                for (const h of hscrolls) h.section.style.height = "";
                applyPins();
                stacks = measureCardStacks();
                hscrolls = measureHScrolls();
                holds = measureHolds();
                covers = measureCovers();
                relParallax = measureRelParallax();
                walls = measureWalls();
            }, 200);
        };
        window.addEventListener("resize", onResize);
        cleanups.push(() => {
            window.removeEventListener("resize", onResize);
            window.clearTimeout(resizeTimer);
        });
    }

    const vhOf = () => window.innerHeight || 1;

    // Depth-of-field cards: sharp near the viewport center, increasingly
    // blurred toward the edges (about cards use this to take turns in focus).
    // Desktop only: per-frame blur filters are too heavy for phones.
    const focusEls = reduced || !isDesktop()
        ? []
        : Array.from(document.querySelectorAll<HTMLElement>("[data-focus]"));

    const onScroll = () => {
        const progress = lenis ? lenis.progress : nativeProgress();
        let scroll = lenis ? lenis.scroll : window.scrollY;
        const vh = vhOf();

        // Hit a wall this frame? Brake into the boundary with a short eased
        // stop instead of a dead halt. (Skipped during anchor jumps.)
        if (lenis && !anchorBypass && !braking) {
            for (const w of walls) {
                const crossed =
                    (lastScroll < w && scroll > w) || (lastScroll > w && scroll < w);
                if (crossed) {
                    braking = true;
                    // Failsafe: a user gesture can interrupt the brake and
                    // swallow onComplete - never leave the walls disabled.
                    const failsafe = window.setTimeout(() => (braking = false), 700);
                    lenis.scrollTo(w, {
                        duration: 0.45,
                        easing: (t: number) => 1 - Math.pow(1 - t, 3),
                        onComplete: () => {
                            window.clearTimeout(failsafe);
                            braking = false;
                        },
                    });
                    break;
                }
            }
        }
        lastScroll = scroll;

        if (bar) bar.style.transform = `scaleX(${progress || 0})`;

        // Bottom hue: faint for most of the ride, blooming as the end nears,
        // then fading out completely during the reveal - the panel takes over
        // the indigo, and the form is never sitting under the overlay.
        if (hue) {
            const bloom = Math.max(0, Math.min(1, (progress - 0.68) / 0.2));
            const fade = Math.max(0, Math.min(1, (progress - 0.88) / 0.08));
            const o = Math.min(1, 0.62 + bloom * 0.38) * (1 - fade);
            hue.style.opacity = o.toFixed(3);
        }

        if (heroScrub) {
            // A little scroll starts the dissolve while the hero is still
            // pinned, revealing the about section underneath.
            const raw = (scroll - vh * 0.08) / (vh * 0.55);
            const t = Math.max(0, Math.min(1, raw));
            heroScrub.style.setProperty("--scrub", String(t * t));
        }

        // Particle layers: slow upward drift, wrapped every viewport-height so
        // the pre-painted pattern tiles forever. Keeps drifting during the
        // journey pin - the background stays alive while the cards slide.
        for (const layer of wrapLayers) {
            const speed = parseFloat(layer.dataset.parallaxSpeed ?? "0.1");
            const y = (scroll * speed) % vh;
            layer.style.transform = `translate3d(0, ${-y}px, 0)`;
        }

        // Ghost numerals: drift down relative to their section (reads as depth).
        for (const p of relParallax) {
            const local = scroll - p.base + vh;
            if (local < -vh || local > vh * 6) continue;
            p.el.style.transform = `translate3d(0, ${local * p.speed}px, 0)`;
        }

        // Depth-of-field focus (see focusEls above). A dead zone around the
        // center keeps the active card fully sharp, and outgoing cards
        // (above center) defocus far more slowly than incoming ones.
        for (const el of focusEls) {
            const r = el.getBoundingClientRect();
            if (r.bottom < -150 || r.top > vh + 150) continue;
            const mid = r.top + r.height / 2;
            const delta = mid - vh / 2;
            const norm =
                delta >= 0
                    ? delta / (vh / 2)
                    : (-delta / (vh / 2)) * 0.4;
            const d = Math.max(0, Math.min(1, norm) - 0.25) / 0.75;
            el.style.filter = d < 0.02 ? "none" : `blur(${(d * 5).toFixed(2)}px)`;
            el.style.opacity = (1 - d * 0.35).toFixed(3);
        }

        // (Chapter-cover exit is driven by the filmstrip below: the first
        // card physically pushes the mark out via pushEl.)

        // Pinned filmstrips (cushioned: the track waits out the buffer).
        // While inside one, the particle background lights up (CSS reacts
        // to the .in-showcase class).
        let inShowcase = false;
        for (const h of hscrolls) {
            const local = scroll - h.top - h.buffer;
            // Raw travel includes all pause slots; the track's x holds still
            // during each (spotlight card pinned) while the pushed mark and
            // the scroll keep going.
            const totalPause = h.pausePoints.length * h.pauseLen;
            const raw = Math.max(0, Math.min(h.distance + totalPause, local));
            let x = raw;
            for (const p of h.pausePoints) {
                if (x <= p) break;
                x = Math.max(p, x - h.pauseLen);
            }
            h.track.style.transform = `translate3d(${-x}px, 0, 0)`;
            if (h.headline) {
                // Three phases: flush with the first card's edge on the way
                // in, docked at center, then leaving right-edge-aligned with
                // the last card once its trailing edge passes.
                const tx = Math.min(
                    Math.max(h.dockLeft, h.cardEdge - x),
                    h.cardsEnd - h.headlineW - x,
                );
                h.headline.style.transform = `translate3d(${tx}px, 0, 0)`;
            }
            if (h.pushEl) {
                // The first card shoves the chapter mark out on contact; the
                // mark rides the RAW timeline, so it keeps sliding out even
                // while the card holds its pause.
                const push = Math.max(0, raw - h.pushStart);
                h.pushEl.style.transform = `translate3d(${-push}px, 0, 0)`;
            }
            if (h.sigilEl && h.spotlightEls.length) {
                // The headline's // adopts the color of whichever card holds
                // the spotlight (CSS transition handles the fade between).
                let active = -1;
                for (let i = 0; i < h.pausePoints.length; i++) {
                    if (raw >= h.pausePoints[i] + i * h.pauseLen) active = i;
                    else break;
                }
                if (active >= 0 && h.spotlightEls[active]) {
                    const fc = h.spotlightEls[active].style.getPropertyValue("--fc").trim();
                    if (fc) h.sigilEl.style.color = `rgb(${fc})`;
                }
            }
            if (h.arrowEl) {
                // Trails the last card at track speed, then docks under the
                // headline and stays while the card finishes clearing out.
                const ax = Math.max(h.dockLeft, h.arrowEntry - x);
                h.arrowEl.style.transform = `translate3d(${ax}px, 0, 0)`;
            }
            if (scroll > h.top - vh * 0.2 && scroll < h.top + h.distance + h.buffer * 2) {
                inShowcase = true;
            }
        }
        document.documentElement.classList.toggle("in-showcase", inShowcase);

        // Entry holds: content counter-scrolls (appears frozen) for the hold
        // distance after the section arrives, then rides along normally.
        for (const h of holds) {
            const y = Math.max(0, Math.min(h.dist, scroll - h.top));
            h.content.style.transform = `translate3d(0, ${y}px, 0)`;
        }

        // Pinned card stacks: each card slides up from below and lands on the
        // pile with a cascading offset, one per scroll segment (cushioned).
        for (const s of stacks) {
            const local = scroll - s.top - s.buffer;
            s.cards.forEach((card, i) => {
                const rx = i * s.offX;
                const ry = i * s.offY;
                if (i === 0) {
                    card.style.transform = `translate3d(0, 0, 0)`;
                    return;
                }
                const t = Math.max(0, Math.min(1, (local - (i - 1) * s.per) / s.per));
                const eased = 1 - Math.pow(1 - t, 3);
                // Cards fly in from the right and land on the pile.
                const slide = (1 - eased) * (window.innerWidth * 0.9);
                card.style.transform = `translate3d(${rx + slide}px, ${ry}px, 0)`;
            });
        }
    };

    if (lenis) {
        lenis.on("scroll", onScroll);
    } else {
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }
    onScroll();
}

/* ------------------------------------------------------------------ */
/* Velocity marquee (ticks every frame, so it lives in the RAF loop)   */
/* ------------------------------------------------------------------ */

type Marquee = {
    track: HTMLElement | null;
    offset: number;
    skew: number;
    retry: number;
};

const marquee: Marquee = { track: null, offset: 0, skew: 0, retry: 0 };

function tickMarquee(): void {
    // The marquee is a hydrated React island; it may appear after init.
    if (!marquee.track || !marquee.track.isConnected) {
        if (marquee.retry++ % 30 === 0) {
            marquee.track = document.querySelector<HTMLElement>("[data-marquee-track]");
        }
        if (!marquee.track) return;
    }

    const half = marquee.track.scrollWidth / 2;
    if (half <= 0) return;

    const velocity = lenis?.velocity ?? 0;
    marquee.offset += 1.4 + Math.min(Math.abs(velocity) * 0.25, 10);

    // Skew with scroll velocity, ease back to rest.
    const targetSkew = Math.max(-10, Math.min(10, velocity * 0.35));
    marquee.skew += (targetSkew - marquee.skew) * 0.12;

    marquee.track.style.transform =
        `translate3d(${-(marquee.offset % half)}px, 0, 0) skewX(${marquee.skew.toFixed(2)}deg)`;
}

/* ------------------------------------------------------------------ */
/* Anchor jumps                                                        */
/* ------------------------------------------------------------------ */

function setupAnchors(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>(
        'a[href^="#"], a[href^="/#"]',
    );
    links.forEach((a) => {
        const handler = (e: Event) => {
            const href = a.getAttribute("href") ?? "";
            const hash = href.startsWith("/#") ? href.slice(1) : href;
            if (hash === "#" || (href.startsWith("/#") && location.pathname !== "/")) return;
            const target = document.querySelector<HTMLElement>(hash);
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                // Walls stand down for the jump (safety timeout in case the
                // scroll gets interrupted and onComplete never fires).
                anchorBypass = true;
                const failsafe = window.setTimeout(() => (anchorBypass = false), 2000);
                lenis.scrollTo(target, {
                    offset: 0,
                    onComplete: () => {
                        window.clearTimeout(failsafe);
                        anchorBypass = false;
                    },
                });
            } else {
                target.scrollIntoView();
            }
            history.replaceState(null, "", hash);
        };
        a.addEventListener("click", handler);
        cleanups.push(() => a.removeEventListener("click", handler));
    });
}

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

export function destroySmoothScroll(): void {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    anchorBypass = false;
    lenis?.destroy();
    lenis = null;
    marquee.track = null;
    observers.forEach((o) => o.disconnect());
    observers.length = 0;
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
}

export function initSmoothScroll(): void {
    destroySmoothScroll();
    const reduced = prefersReducedMotion();

    if (!reduced) {
        // Low lerp + slightly damped wheel = heavier, more deliberate glide.
        lenis = new Lenis({ lerp: 0.065, smoothWheel: true, wheelMultiplier: 0.85 });

        const raf = (time: number) => {
            lenis?.raf(time);
            tickMarquee();
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        setupReveal();
    } else {
        document
            .querySelectorAll("[data-reveal]")
            .forEach((el) => el.classList.add("is-visible"));
    }

    setupTypedPrompts(reduced);
    setupScrollSpy(reduced);
    setupAnchors();
    // Applies pin/stack heights and registers the section walls against the
    // final stretched layout.
    bindScrollDriven(reduced);
}

/** Bind once; ClientRouter fires page-load on initial load and every navigation. */
export function wireSmoothScroll(): void {
    document.addEventListener("astro:page-load", initSmoothScroll);
    document.addEventListener("astro:before-swap", destroySmoothScroll);
}
