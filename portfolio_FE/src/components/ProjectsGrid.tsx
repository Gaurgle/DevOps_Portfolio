import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { projects } from "../data/projects";
import { ProjectCard } from "./CardProjects";

type Project = (typeof projects)[number];

/** First impressions first: finished projects with screenshots lead, bare
 *  or under-construction ones close the set (order within a tier holds). */
function presentability(p: Project): number {
    const hasShot = Array.isArray(p.image) ? p.image.length > 0 : Boolean(p.image);
    return (hasShot ? 0 : 1) + (p.wip ? 2 : 0);
}

const firstImage = (p: Project) =>
    (Array.isArray(p.image) ? p.image[0] : p.image) || null;

/** Catppuccin accent per row, cycled. */
const ACCENTS = ["#a6e3a1", "#89b4fa", "#cba6f7", "#fab387", "#94e2d5", "#f5c2e7"];

/** The rest of the projects (flagships live in the FeaturedShowcase above).
 *  Desktop: a terminal directory listing - monospace rows, a floating
 *  screenshot preview that trails the cursor, and tech filter chips that
 *  read as a grep pipe. Mobile: the native swipe carousel. */
export default function ProjectsGrid() {
    const rest = projects
        .filter((p) => !("featured" in p) || !p.featured)
        .sort((a, b) => presentability(a) - presentability(b));

    /* ------------------------- mobile carousel ------------------------- */
    const trackRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);

    const onTrackScroll = () => {
        const track = trackRef.current;
        if (!track) return;
        const max = track.scrollWidth - track.clientWidth;
        const t = max > 0 ? track.scrollLeft / max : 0;
        if (barRef.current) barRef.current.style.transform = `scaleX(${t})`;
        if (countRef.current) {
            const i = Math.round(t * (rest.length - 1)) + 1;
            countRef.current.textContent = String(i).padStart(2, "0");
        }
    };

    // One-time nudge: the track slides out and settles back when the
    // section first appears, so the sideways axis announces itself.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        if (window.matchMedia("(min-width: 768px)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    io.disconnect();
                    if (track.scrollLeft > 0) return;
                    // Transform, not scrollLeft: snap-mandatory containers
                    // yank programmatic scrolls straight back.
                    track.style.transition =
                        "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
                    track.style.transform = "translateX(-72px)";
                    window.setTimeout(() => {
                        track.style.transform = "";
                        window.setTimeout(() => (track.style.transition = ""), 500);
                    }, 550);
                }
            },
            { threshold: 0.4 },
        );
        io.observe(track);
        return () => io.disconnect();
    }, []);

    /* ------------------------- desktop ls list ------------------------- */
    const [filter, setFilter] = useState<string | null>(null);
    const [active, setActive] = useState<Project | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    // Chips: the most common techs across the set.
    const chips = useMemo(() => {
        const counts = new Map<string, number>();
        for (const p of rest) {
            for (const tag of p.tags ?? []) {
                counts.set(tag, (counts.get(tag) ?? 0) + 1);
            }
        }
        return [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([tag]) => tag);
    }, [rest]);

    const listed = filter
        ? rest.filter((p) => (p.tags ?? []).includes(filter))
        : rest;

    // The preview trails the cursor: transform retargets a CSS transition,
    // so frequent updates read as a soft chase - no RAF needed. On FIRST
    // hover it must SNAP to the cursor (transition suspended) and fade in
    // there, or it visibly flies in from wherever it last was.
    const shownRef = useRef(false);
    const placePreview = (cx: number, cy: number, snap: boolean) => {
        const el = previewRef.current;
        if (!el) return;
        const x = Math.min(cx + 32, window.innerWidth - 360);
        const y = Math.min(Math.max(cy - 120, 80), window.innerHeight - 300);
        if (snap) {
            el.style.transition = "none";
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            void el.offsetWidth; // flush: the fade-in starts from here
            el.style.transition = "";
        } else {
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
    };
    const onRowEnter = (p: Project, e: ReactMouseEvent) => {
        if (!shownRef.current) placePreview(e.clientX, e.clientY, true);
        shownRef.current = true;
        setActive(p);
    };
    const onListMove = (e: ReactMouseEvent) => placePreview(e.clientX, e.clientY, false);
    const onListLeave = () => {
        shownRef.current = false;
        setActive(null);
    };

    return (
        <div>
            {/* ==================== desktop: ls listing ==================== */}
            <div className="hidden md:block">
                <p className="font-mono text-sm text-zinc-400 mb-1">
                    <span className="text-ctp-blue">$</span> ls projects/
                    {filter && (
                        <span className="text-zinc-500">
                            {" "}| grep <span className="text-ctp-blue">{filter.toLowerCase()}</span>
                        </span>
                    )}
                    <span className="text-zinc-600 select-none">  # hover a row to preview</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {chips.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setFilter(filter === tag ? null : tag)}
                            className={`px-2.5 py-0.5 text-[11px] font-mono rounded border transition-colors duration-200
                                ${filter === tag
                                    ? "bg-ctp-blue/15 text-ctp-blue border-ctp-blue/40"
                                    : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"}`}
                        >
                            {tag.toLowerCase()}
                        </button>
                    ))}
                </div>

                <div
                    onMouseMove={onListMove}
                    onMouseLeave={onListLeave}
                    className="border-t border-zinc-800/70"
                >
                    {listed.map((p, i) => {
                        const accent = ACCENTS[i % ACCENTS.length];
                        const href = p.link && p.link !== "#" ? p.link : null;
                        const Row = href ? "a" : "div";
                        return (
                            <Row
                                key={p.projectTitle}
                                {...(href
                                    ? { href, target: "_blank", rel: "noopener noreferrer" }
                                    : {})}
                                onMouseEnter={(e: ReactMouseEvent) => onRowEnter(p, e)}
                                onFocus={() => setActive(p)}
                                style={{ "--rc": accent } as CSSProperties}
                                className="ls-row group flex items-baseline gap-6 py-4 px-2 border-b border-zinc-800/70
                                           font-mono cursor-pointer transition-colors duration-200 hover:bg-white/[0.02]"
                            >
                                <span className="text-[11px] text-zinc-600 shrink-0 select-none">
                                    {p.wip ? "d-wip------" : "drwxr-xr-x"}
                                </span>
                                <span className="ls-name text-lg text-zinc-200 transition-colors duration-200">
                                    {p.projectTitle.toLowerCase().replaceAll(" ", "-")}
                                </span>
                                {p.wip && (
                                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-ctp-yellow/15 text-ctp-yellow border border-ctp-yellow/30 shrink-0">
                                        under construction
                                    </span>
                                )}
                                <span className="ml-auto text-xs text-zinc-500 text-right shrink-0 hidden lg:block">
                                    {(p.tags ?? []).slice(0, 4).join(" · ").toLowerCase()}
                                </span>
                                <span className="text-zinc-600 group-hover:text-zinc-200 transition-colors duration-200 shrink-0">
                                    {href ? "↗" : "·"}
                                </span>
                            </Row>
                        );
                    })}
                </div>

                {/* Floating preview: fixed, trails the cursor over the list */}
                <div
                    ref={previewRef}
                    aria-hidden="true"
                    className={`fixed left-0 top-0 z-30 w-80 pointer-events-none rounded-lg overflow-hidden
                                border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/60
                                transition-[transform,opacity] duration-500 ease-out will-change-transform
                                ${active ? "opacity-100 delay-100" : "opacity-0"}`}
                >
                    {active && firstImage(active) ? (
                        <img
                            src={firstImage(active)!}
                            alt=""
                            className="w-80 h-48 object-cover"
                        />
                    ) : (
                        <div className="w-80 h-48 flex items-center justify-center bg-zinc-900/40 font-mono text-xs text-zinc-600">
                            <span>
                                <span className="text-ctp-mauve">$</span> ./preview
                                <br />
                                no screenshot yet
                            </span>
                        </div>
                    )}
                    {active && (
                        <div className="px-3 py-2 font-mono text-xs text-zinc-300 border-t border-zinc-800 flex justify-between gap-3">
                            <span>{active.projectTitle}</span>
                            <span className="text-zinc-500 truncate">
                                {(active.tags ?? [])[0]?.toLowerCase()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ==================== mobile: swipe carousel ==================== */}
            <div className="md:hidden">
                <div
                    ref={trackRef}
                    onScroll={onTrackScroll}
                    className="carousel-track flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-8 px-4 pb-2"
                >
                    {rest.map((project, idx) => (
                        <div
                            key={project.projectTitle}
                            className="snap-center shrink-0 w-[78vw] flex"
                        >
                            <ProjectCard project={project} idx={idx} />
                        </div>
                    ))}
                </div>

                {/* Swipe indicator: counter + progress bar + hint */}
                <div className="mt-4 flex items-center gap-3 px-1" aria-hidden="true">
                    <span className="font-mono text-[10px] tracking-widest text-zinc-400 select-none">
                        <span ref={countRef}>01</span>
                        <span className="text-zinc-600"> / {String(rest.length).padStart(2, "0")}</span>
                    </span>
                    <div className="flex-1 h-0.5 rounded bg-zinc-800 overflow-hidden">
                        <div ref={barRef} className="carousel-progress-bar" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-zinc-500 select-none">
                        swipe &rarr;
                    </span>
                </div>
            </div>
        </div>
    );
}
