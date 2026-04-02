import {
    SiKotlin,
    SiSpring,
    SiKtor,
    SiAndroid,
    SiPython,
    SiMysql,
    SiPostgresql,
    SiAstro,
    SiReact,
    SiSvelte,
    SiTailwindcss,
    SiDocker,
    SiBluetooth,
} from "react-icons/si";
import {DiJava, DiDatabase} from "react-icons/di";

const stack = [
    {icon: SiKotlin, name: "Kotlin"},
    {icon: DiJava, name: "Java"},
    {icon: SiSpring, name: "Spring"},
    {icon: SiKtor, name: "Ktor"},
    {icon: DiDatabase, name: "Exposed"},
    {icon: SiAndroid, name: "Android"},
    {icon: SiBluetooth, name: "BLE"},
    {icon: SiDocker, name: "Docker"},
    {icon: SiPython, name: "Python"},
    {icon: SiMysql, name: "MySQL"},
    {icon: SiPostgresql, name: "PostgreSQL"},
    {icon: SiAstro, name: "Astro"},
    {icon: SiReact, name: "React"},
    {icon: SiSvelte, name: "Svelte"},
    {icon: SiTailwindcss, name: "Tailwind"},
];

// Catppuccin gradient stops: green → teal → blue → mauve → pink → peach
const glowColors = [
    [166, 227, 161], // green  #a6e3a1
    [148, 226, 213], // teal   #94e2d5
    [137, 180, 250], // blue   #89b4fa
    [203, 166, 247], // mauve  #cba6f7
    [245, 194, 231], // pink   #f5c2e7
    [250, 179, 135], // peach  #fab387
];

function getGlowColor(index: number, total: number): string {
    const t = total <= 1 ? 0 : index / (total - 1);
    const scaled = t * (glowColors.length - 1);
    const i = Math.floor(scaled);
    const f = scaled - i;
    const a = glowColors[Math.min(i, glowColors.length - 1)];
    const b = glowColors[Math.min(i + 1, glowColors.length - 1)];
    const r = Math.round(a[0] + (b[0] - a[0]) * f);
    const g = Math.round(a[1] + (b[1] - a[1]) * f);
    const bl = Math.round(a[2] + (b[2] - a[2]) * f);
    return `${r}, ${g}, ${bl}`;
}

import { useRef, useCallback, useEffect } from 'react';

function lerpColor(t: number): string {
    const clamped = Math.max(0, Math.min(1, t));
    const scaled = clamped * (glowColors.length - 1);
    const i = Math.floor(scaled);
    const f = scaled - i;
    const a = glowColors[Math.min(i, glowColors.length - 1)];
    const b = glowColors[Math.min(i + 1, glowColors.length - 1)];
    const r = Math.round(a[0] + (b[0] - a[0]) * f);
    const g = Math.round(a[1] + (b[1] - a[1]) * f);
    const bl = Math.round(a[2] + (b[2] - a[2]) * f);
    return `${r},${g},${bl}`;
}

export default function TechStack({ parentId }: { parentId?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const blobRef = useRef<HTMLDivElement>(null);
    const target = useRef({ x: 0, y: 0 });
    const pos = useRef({ x: 0, y: 0 });
    const rafId = useRef(0);
    const inside = useRef(false);

    const startLoop = useCallback(() => {
        if (rafId.current) return;
        const ease = 0.08;
        const tick = () => {
            pos.current.x += (target.current.x - pos.current.x) * ease;
            pos.current.y += (target.current.y - pos.current.y) * ease;
            if (blobRef.current) {
                blobRef.current.style.left = `${pos.current.x}px`;
                blobRef.current.style.top = `${pos.current.y}px`;
            }
            if (inside.current || Math.abs(target.current.x - pos.current.x) > 0.5 || Math.abs(target.current.y - pos.current.y) > 0.5) {
                rafId.current = requestAnimationFrame(tick);
            } else {
                rafId.current = 0;
            }
        };
        rafId.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        const parent = parentId ? document.getElementById(parentId) : null;
        if (!parent) return;

        const onMove = (e: MouseEvent) => {
            const container = containerRef.current;
            const blob = blobRef.current;
            if (!container || !blob) return;

            const rect = container.getBoundingClientRect();
            target.current.x = e.clientX - rect.left;
            target.current.y = e.clientY - rect.top;

            // Dim when cursor is above the icon area (title bar)
            const overIcons = e.clientY >= rect.top;
            blob.style.opacity = overIcons ? '0.6' : '0.25';

            const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const rgb = lerpColor(t);
            blob.style.background = `radial-gradient(ellipse at 40% 45%, rgba(${rgb},0.5) 0%, rgba(${rgb},0.15) 35%, transparent 60%)`;
            startLoop();
        };

        const onEnter = (e: MouseEvent) => {
            inside.current = true;
            const container = containerRef.current;
            if (container) {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                pos.current.x = x;
                pos.current.y = y;
                target.current.x = x;
                target.current.y = y;
            }
            if (blobRef.current) blobRef.current.style.opacity = '0.25';
            startLoop();
        };

        const onLeave = () => {
            inside.current = false;
            if (blobRef.current) blobRef.current.style.opacity = '0';
        };

        parent.addEventListener('mousemove', onMove);
        parent.addEventListener('mouseenter', onEnter);
        parent.addEventListener('mouseleave', onLeave);

        return () => {
            parent.removeEventListener('mousemove', onMove);
            parent.removeEventListener('mouseenter', onEnter);
            parent.removeEventListener('mouseleave', onLeave);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [parentId, startLoop]);

    return (
        <div
            ref={containerRef}
            className="relative flex flex-wrap gap-5 items-center justify-center"
        >
            <div ref={blobRef} className="icon-blob" />
            {stack.map(({icon: Icon, name}) => (
                <div
                    key={name}
                    className="tech-icon-wrap flex flex-col items-center gap-1.5 group cursor-default"
                >
                    <Icon className="tech-icon w-6 h-6 text-zinc-500 group-hover:text-white transition-all duration-300" />
                    <span className="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300">
                        {name}
                    </span>
                </div>
            ))}
        </div>
    );
}
