import { stack } from "./TechStack";

/**
 * Infinite devicon marquee. The track holds the icon set twice; the scroll
 * engine (smoothScroll.ts) translates it every frame, drifting when idle and
 * accelerating/skewing with scroll velocity, wrapping at the halfway point.
 */
export default function TechMarquee() {
    const items = [...stack, ...stack];

    return (
        <div className="tech-marquee" aria-hidden="true">
            <div data-marquee-track>
                {items.map(({ icon: Icon, name, mono }, i) => (
                    <div key={`${name}-${i}`} className="group flex items-center gap-3 cursor-default">
                        <Icon
                            className={
                                mono
                                    ? "w-9 h-9 text-zinc-600 group-hover:text-white transition-all duration-300"
                                    : "w-9 h-9 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                            }
                        />
                        <span className="font-mono text-xs text-zinc-600 group-hover:text-zinc-300 transition-colors duration-300 whitespace-nowrap">
                            {name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
