"use client";
import React from "react";

type Props = {
    href?: string;
    className?: string;       // extra classes from the caller
    insetClass?: string;      // size of blob area (default 'inset-[2px]')
    blurClass?: string;       // blur strength (default 'blur')
    duration?: string;        // hover transition duration (default 'duration-200')
    colors?: string[];        // e.g., ['bg-purple-600/25','bg-yellow-500/20','bg-pink-600/20']
    children: React.ReactNode;
};

export default function HoverBlobs({
                                       href,
                                       className = "",
                                       insetClass = "inset-[1px]",
                                       blurClass = "blur",
                                       duration = "duration-1000",
                                       colors = ["bg-gray-800", "bg-yellow-500/20", "bg-pink-600/20"],
                                       children,
                                   }: Props) {
    const Tag: any = href ? "a" : "span";
    return (
        <Tag
            href={href}
            className={`relative inline-block group px-1 py-2 rounded-sm ${className}`}
        >
            {/* blob layer */}
            <span
                className={`pointer-events-none absolute inset-0 z-0 opacity-0 scale-95 transition ${duration} ease-out group-hover:opacity-100 group-hover:scale-100`}
            >
        <span
            className={`absolute ${insetClass} rounded-[40%] ${blurClass} ${colors[0]} mix-blend-multiply dark:mix-blend-screen animate-blob`}
        />
        <span
            className={`absolute ${insetClass} rounded-lg ${blurClass} ${colors[1]} mix-blend-multiply dark:mix-blend-screen animate-blob`}
            style={{animationDelay: "1.6s"}}
        />
        <span
            className={`absolute ${insetClass} rounded-[30%] ${blurClass} ${colors[2]} mix-blend-multiply dark:mix-blend-screen animate-blob`}
            style={{animationDelay: "0.9s"}}
        />
      </span>

            {/* text */}
            <span className="relative z-10">{children}</span>
        </Tag>
    );
}