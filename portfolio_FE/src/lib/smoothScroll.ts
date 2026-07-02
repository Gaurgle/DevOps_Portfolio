import Lenis from "lenis";
import Snap from "lenis/snap";

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
let snap: Snap | null = null;
let rafId = 0;
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

function setupScrollSpy(): void {
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    if (!sections.length) return;

    const setActive = (name: string) => {
        document.querySelectorAll<HTMLElement>("[data-spy]").forEach((link) => {
            link.classList.toggle("spy-active", link.dataset.spy === name);
        });
    };

    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                setActive((entry.target as HTMLElement).dataset.section ?? "");
            }
        },
        // A narrow band around the viewport center decides the active section.
        { rootMargin: "-40% 0px -50% 0px" },
    );

    sections.forEach((el) => io.observe(el));
    observers.push(io);
}

/* ------------------------------------------------------------------ */
/* Horizontal journey (pinned filmstrip)                               */
/* ------------------------------------------------------------------ */

type HScroll = {
    section: HTMLElement;
    track: HTMLElement;
    top: number;
    distance: number;
};

function measureHScroll(): HScroll[] {
    if (!isDesktop()) return [];
    const result: HScroll[] = [];

    for (const section of document.querySelectorAll<HTMLElement>("[data-hscroll]")) {
        const track = section.querySelector<HTMLElement>("[data-hscroll-track]");
        if (!track) continue;

        const distance = track.scrollWidth - window.innerWidth;
        if (distance <= 0) continue;

        // The section gets exactly enough height for the sideways travel.
        section.style.height = `${window.innerHeight + distance}px`;
        const top = section.getBoundingClientRect().top + window.scrollY;
        result.push({ section, track, top, distance });
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
    const heroScrub = reduced
        ? null
        : document.querySelector<HTMLElement>("[data-hero-scrub]");
    const wrapLayers = reduced
        ? []
        : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-wrap]"));

    let hscrolls = reduced ? [] : measureHScroll();
    let relParallax = reduced ? [] : measureRelParallax();

    if (!reduced) {
        let resizeTimer = 0;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                for (const h of hscrolls) h.section.style.height = "";
                hscrolls = measureHScroll();
                relParallax = measureRelParallax();
            }, 200);
        };
        window.addEventListener("resize", onResize);
        cleanups.push(() => {
            window.removeEventListener("resize", onResize);
            window.clearTimeout(resizeTimer);
        });
    }

    const vhOf = () => window.innerHeight || 1;

    const onScroll = () => {
        const progress = lenis ? lenis.progress : nativeProgress();
        const scroll = lenis ? lenis.scroll : window.scrollY;
        const vh = vhOf();

        if (bar) bar.style.transform = `scaleX(${progress || 0})`;

        if (heroScrub) {
            const t = Math.min(1, scroll / (vh * 0.9));
            heroScrub.style.setProperty("--scrub", String(t));
        }

        // Particle layers: slow upward drift, wrapped every viewport-height
        // so the pre-painted pattern tiles forever.
        for (const layer of wrapLayers) {
            const speed = parseFloat(layer.dataset.parallaxSpeed ?? "0.1");
            const y = (scroll * speed) % vh;
            layer.style.transform = `translate3d(0, ${-y}px, 0)`;
        }

        // Ghost numerals: drift down relative to their section (reads as depth).
        for (const p of relParallax) {
            const local = scroll - p.base + vh;
            if (local < -vh || local > vh * 3) continue;
            p.el.style.transform = `translate3d(0, ${local * p.speed}px, 0)`;
        }

        // Pinned horizontal sections.
        for (const h of hscrolls) {
            const local = scroll - h.top;
            const x = Math.max(0, Math.min(h.distance, local));
            h.track.style.transform = `translate3d(${-x}px, 0, 0)`;
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
    marquee.offset += 0.6 + Math.min(Math.abs(velocity) * 0.18, 7);

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
            if (lenis) lenis.scrollTo(target, { offset: -72 });
            else target.scrollIntoView();
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
    snap?.destroy();
    snap = null;
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
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });

        snap = new Snap(lenis, { type: "proximity", duration: 0.7, distanceThreshold: "18%" });
        document
            .querySelectorAll<HTMLElement>("[data-snap]")
            .forEach((el) => snap?.addElement(el, { align: "start" }));

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
    setupScrollSpy();
    setupAnchors();
    bindScrollDriven(reduced);
}

/** Bind once; ClientRouter fires page-load on initial load and every navigation. */
export function wireSmoothScroll(): void {
    document.addEventListener("astro:page-load", initSmoothScroll);
    document.addEventListener("astro:before-swap", destroySmoothScroll);
}
