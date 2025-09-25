import React from "react";
import { cn } from "../../lib/utils.ts";

type BorderBeamProps = {
    className?: string;
    length?: number;    // px
    duration?: number;  // seconds
    colorFrom?: string;
    colorVia?: string;
    colorTo?: string;
};

const BorderBeam: React.FC<BorderBeamProps> = ({
                                                   className,
                                                   length = 200,
                                                   duration = 10,
                                                   colorFrom = "#0080ff",
                                                   colorVia = "#8803f4",
                                                   colorTo = "#ff0062",
                                               }) => {
    const fadeLength = Math.round(length * 0.85);
    const blurAmount = Math.round(length * 0.25);
    const extendedLength = length + fadeLength * 2;

    const cssVariables = {
        ["--length" as any]: extendedLength,
        ["--duration" as any]: duration,
        ["--color-from" as any]: colorFrom,
        ["--color-via" as any]: colorVia,
        ["--color-to" as any]: colorTo,
        ["--fade-length" as any]: `${fadeLength}px`,
        ["--blur-amount" as any]: `${blurAmount}px`,
    } as React.CSSProperties;

    const beamStyles = cn(
        // ensure the ::after exists:
        "after:content-['']",

        // mask so it respects rounded corners
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",

        // the animated “beam”
        "after:absolute after:inset-0 after:m-auto after:aspect-square after:w-[calc(var(--length)*1px)] after:animate-border-beam",

        // gradient + glow
        "after:[background:linear-gradient(to_left,transparent,transparent_var(--fade-length),var(--color-from),var(--color-via),var(--color-to),transparent_calc(100%_-_var(--fade-length)),transparent)]",
        "after:[filter:blur(var(--blur-amount))]",

        // follow the rounded-rect path
        "after:[offset-path:rect(0_auto_auto_0_round_calc(var(--length)*1px))]"
    );

    return (
        <div
            style={cssVariables}
            className={cn(
                "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(1.5*1px)_solid_transparent]",
                beamStyles,
                className
            )}
        />
    );
};

export default BorderBeam;
