// src/components/HibubbaIO/StaticBlobs.tsx
"use client";
import React from "react";

interface StaticBlobsProps {
    children: React.ReactNode;
    href?: string;
    className?: string;      // classes on the OUTER wrapper
    insetClass?: string;     // controls how far blobs extend
    blurClass?: string;      // blur strength
    colors?: string[];       // 3 bg-* utilities
    contentClass?: string;   // styling for the text/icon
}

export default function StaticBlobs({
                                        children,
                                        href,
                                        className = "",
                                        insetClass = "-inset-[2px]",
                                        blurClass = "blur-md",
                                        colors = ["bg-purple-600/25", "bg-blue-500/20", "bg-pink-600/20"],
                                        contentClass = "px-4 py-2 rounded-xl",
                                    }: StaticBlobsProps) {
    const Wrapper: any = href ? "a" : "span";

    return (
        <Wrapper href={href} className={`relative inline-block ${className}`}>
            {/* Blobs — always visible */}
            <span className={`pointer-events-none absolute ${insetClass} -z-10 opacity-100 scale-100`}>
        <span className={`absolute inset-0 rounded-lg ${blurClass} ${colors[0]} mix-blend-multiply dark:mix-blend-screen animate-blob`} />
        <span className={`absolute inset-0 rounded-lg ${blurClass} ${colors[1]} mix-blend-multiply dark:mix-blend-screen animate-blob`} style={{ animationDelay: "1.6s" }} />
        <span className={`absolute inset-0 rounded-lg ${blurClass} ${colors[2]} mix-blend-multiply dark:mix-blend-screen animate-blob`} style={{ animationDelay: "0.9s" }} />
      </span>

            {/* Foreground */}
            <span className={`relative z-10 ${contentClass}`}>{children}</span>
        </Wrapper>
    );
}