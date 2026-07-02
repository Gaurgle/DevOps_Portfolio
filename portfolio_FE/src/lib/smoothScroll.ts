import Lenis from "lenis";

/**
 * Owns the single Lenis instance, its RAF loop, and every scroll-driven
 * subscription (progress bar, parallax, hero scrub, reveal + count-up observers).
 *
 * The site uses Astro's ClientRouter, which swaps the DOM on each navigation, so
 * everything here must be torn down on `astro:before-swap` and rebuilt on
 * `astro:page-load`. See `wireSmoothScroll` at the bottom.
 */

let lenis: Lenis | null = null;
let rafId = 0;
const observers: IntersectionObserver[] = [];
const cleanups: Array<() => void> = [];

const prefersReducedMotion = (): boolean =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fraction (0..1) of the page scrolled, for the native-scroll fallback. */
function nativeProgress(): number {
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    return max > 0 ? el.scrollTop / max : 0;
}

/** Reveal elements as they enter the viewport (one-shot). */
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
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    els.forEach((el) => io.observe(el));
    observers.push(io);
}

/** Count numbers up when their tile scrolls into view. */
function setupCountUp(reduced: boolean): void {
    const els = document.querySelectorAll<HTMLElement>("[data-countup]");
    if (!els.length) return;

    const render = (el: HTMLElement, value: number) => {
        const decimals = parseInt(el.dataset.countupDecimals ?? "0", 10);
        el.textContent = value.toFixed(decimals) + (el.dataset.countupSuffix ?? "");
    };

    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const el = entry.target as HTMLElement;
                io.unobserve(el);

                const target = parseFloat(el.dataset.countup ?? "0");
                if (reduced) {
                    render(el, target);
                    continue;
                }

                const duration = 1200;
                let start = 0;
                const step = (ts: number) => {
                    if (!start) start = ts;
                    const p = Math.min(1, (ts - start) / duration);
                    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
                    render(el, target * eased);
                    if (p < 1) requestAnimationFrame(step);
                    else render(el, target);
                };
                requestAnimationFrame(step);
            }
        },
        { threshold: 0.5 },
    );

    els.forEach((el) => io.observe(el));
    observers.push(io);
}

/**
 * One scroll handler drives the progress bar (always), plus parallax and the hero
 * scrub (motion only). Reads are `.progress`/`.scroll` from Lenis, or native scroll
 * in the reduced-motion / no-Lenis fallback.
 */
function bindScrollDriven(reduced: boolean): void {
    const bar = document.getElementById("scroll-progress");
    const parallaxLayers = reduced
        ? []
        : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-speed]"));
    const heroScrub = reduced
        ? null
        : document.querySelector<HTMLElement>("[data-hero-scrub]");

    const onScroll = () => {
        const progress = lenis ? lenis.progress : nativeProgress();
        const scroll = lenis ? lenis.scroll : window.scrollY;

        if (bar) bar.style.transform = `scaleX(${progress || 0})`;

        for (const layer of parallaxLayers) {
            const speed = parseFloat(layer.dataset.parallaxSpeed ?? "0");
            layer.style.transform = `translate3d(0, ${scroll * speed}px, 0)`;
        }

        if (heroScrub) {
            const vh = window.innerHeight || 1;
            const t = Math.min(1, scroll / (vh * 0.8));
            heroScrub.style.setProperty("--scrub", String(t));
        }
    };

    if (lenis) {
        lenis.on("scroll", onScroll);
    } else {
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }
    onScroll(); // set initial state
}

export function destroySmoothScroll(): void {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    lenis?.destroy();
    lenis = null;
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
        const raf = (time: number) => {
            lenis?.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        // Route in-page anchor clicks through Lenis so links stay smooth.
        document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
            const handler = (e: Event) => {
                const id = a.getAttribute("href");
                if (!id || id === "#") return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                lenis?.scrollTo(target as HTMLElement, { offset: -80 });
            };
            a.addEventListener("click", handler);
            cleanups.push(() => a.removeEventListener("click", handler));
        });
    } else {
        // No smooth scroll: reveal everything immediately.
        document
            .querySelectorAll("[data-reveal]")
            .forEach((el) => el.classList.add("is-visible"));
    }

    if (!reduced) setupReveal();
    setupCountUp(reduced);
    bindScrollDriven(reduced);
}

/** Bind once; ClientRouter fires these on initial load and every navigation. */
export function wireSmoothScroll(): void {
    document.addEventListener("astro:page-load", initSmoothScroll);
    document.addEventListener("astro:before-swap", destroySmoothScroll);
}
