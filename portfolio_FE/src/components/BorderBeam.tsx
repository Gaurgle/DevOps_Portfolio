// src/components/BorderBeam.tsx
import React from "react";
import { cn } from "../lib/utils";

type BorderBeamProps = {
    className?: string;
    length?: number;
    duration?: number;
    colorFrom?: string;
    colorVia?: string;
    colorTo?: string;
};

export const BorderBeam: React.FC<BorderBeamProps> = ({
                                                          className,
                                                          length = 200,
                                                          duration = 12,
                                                          colorFrom = "#ff4500",
                                                          colorVia = "#ff8c00",
                                                          colorTo = "#ffd700",
                                                      }) => {
    const fadeLength = Math.round(length * 0.25);
    const blurAmount = Math.round(length * 0.05);
    const extendedLength = length + fadeLength * 2;

    const cssVariables = {
        "--length": extendedLength,
        "--duration": duration,
        "--color-from": colorFrom,
        "--color-via": colorVia,
        "--color-to": colorTo,
        "--fade-length": `${fadeLength}px`,
        "--blur-amount": `${blurAmount}px`,
    } as React.CSSProperties;

    const beamStyles = cn(
        "after:content-['']",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect]",
        "[mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--length)*1px)] after:animate-border-beam",
        "after:[background:linear-gradient(to_left,transparent,transparent_var(--fade-length),var(--color-from),var(--color-via),var(--color-to),transparent_calc(100%_-_var(--fade-length)),transparent)]",
        "after:[filter:blur(var(--blur-amount))]",
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
