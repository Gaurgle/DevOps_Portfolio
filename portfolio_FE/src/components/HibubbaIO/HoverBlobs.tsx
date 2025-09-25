// src/components/HibubbaIO/HoverBlobs.tsx
"use client";
import React from "react";

type HoverBlobsProps = {
    children: React.ReactNode;
    href?: string;
    className?: string;      // outer wrapper classes
    insetClass?: string;     // blob area size
    blurClass?: string;      // blur strength
    colors?: string[];       // 3 tailwind bg-* utilities
    alwaysOn?: boolean;      // show blobs when not hovered
    contentClass?: string;   // inner content classes
    target?: React.HTMLAttributeAnchorTarget;
    rel?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "className" | "children">;

export default function HoverBlobs({
                                       children,
                                       href,
                                       className = "",
                                       insetClass = "inset-0",
                                       blurClass = "blur-md",
                                       colors = ["bg-purple-600/25", "bg-blue-500/50", "bg-pink-600/50"],
                                       alwaysOn = false,
                                       contentClass = "",
                                       target,
                                       rel,
                                       ...rest
                                   }: HoverBlobsProps) {
    const Wrapper: any = href ? "a" : "span";

    const linkProps =
        href
            ? {
                href,
                target,
                rel: target === "_blank" ? (rel ?? "noopener noreferrer") : rel,
            }
            : {};

    return (
        <Wrapper
            {...linkProps}
            className={`relative inline-block group ${className}`}
            {...rest}
        >
            {/* Blobs */}
            <span
                className={`pointer-events-none absolute ${insetClass} z-0
              transition-all duration-1000 ease-in-out
              ${alwaysOn
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                }`}
            >
        <span className={`absolute inset-0 rounded-lg ${blurClass} ${colors[0]} mix-blend-multiply dark:mix-blend-screen animate-blob`} />
        <span className={`absolute inset-0 rounded-lg ${blurClass} ${colors[1]} mix-blend-multiply dark:mix-blend-screen animate-blob`} style={{ animationDelay: "1.6s" }} />
        <span className={`absolute inset-0 rounded-lg ${blurClass} ${colors[2]} mix-blend-multiply dark:mix-blend-screen animate-blob`} style={{ animationDelay: "0.9s" }} />
      </span>

            {/* Content */}
            <span className={`relative z-10 ${contentClass}`}>{children}</span>
        </Wrapper>
    );
}