import { useEffect, useRef } from "react";
import { projects } from "../data/projects";
import { ProjectCard } from "./CardProjects";

/** The rest of the projects (flagships live in the FeaturedShowcase above).
 *  Desktop: the familiar grid. Mobile: a native swipe carousel - horizontal
 *  scroll-snap browses the cards, a vertical swipe passes the section.
 *  Discoverability: next-card peek, an 01/NN counter with a progress bar,
 *  and a one-time sideways nudge when the section first comes into view. */
export default function ProjectsGrid() {
    const rest = projects.filter((p) => !("featured" in p) || !p.featured);
    const total = rest.length;
    const trackRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);

    // Direct style/text writes (no re-render) as the user swipes.
    const onTrackScroll = () => {
        const track = trackRef.current;
        if (!track) return;
        const max = track.scrollWidth - track.clientWidth;
        const t = max > 0 ? track.scrollLeft / max : 0;
        if (barRef.current) barRef.current.style.transform = `scaleX(${t})`;
        if (countRef.current) {
            const i = Math.round(t * (total - 1)) + 1;
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
                    // Already swiped before it came into view? Nothing to teach.
                    if (track.scrollLeft > 0) return;
                    // Transform, not scrollLeft: snap-mandatory containers
                    // yank programmatic scrolls straight back to the snap
                    // point, so a scroll-based nudge never moves.
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

    return (
        <div>
            <div
                ref={trackRef}
                onScroll={onTrackScroll}
                className="carousel-track flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-8 px-4 pb-2
                           md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:overflow-visible md:mx-0 md:px-0 md:pb-0"
            >
                {rest.map((project, idx) => (
                    <div
                        key={project.projectTitle}
                        className="snap-center shrink-0 w-[78vw] flex md:block md:w-auto md:shrink md:snap-none"
                    >
                        <ProjectCard project={project} idx={idx} />
                    </div>
                ))}
            </div>

            {/* Mobile swipe indicator: counter + progress bar + hint */}
            <div className="md:hidden mt-4 flex items-center gap-3 px-1" aria-hidden="true">
                <span className="font-mono text-[10px] tracking-widest text-zinc-400 select-none">
                    <span ref={countRef}>01</span>
                    <span className="text-zinc-600"> / {String(total).padStart(2, "0")}</span>
                </span>
                <div className="flex-1 h-0.5 rounded bg-zinc-800 overflow-hidden">
                    <div ref={barRef} className="carousel-progress-bar" />
                </div>
                <span className="font-mono text-[10px] tracking-widest text-zinc-500 select-none">
                    swipe &rarr;
                </span>
            </div>
        </div>
    );
}
