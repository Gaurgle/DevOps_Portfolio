import React, {useEffect, useRef, useState} from "react";
import BorderBeam from "./HibubbaIO/BorderBeam.tsx";
import {projects} from "../data/projects.ts";

function PlayButton({src, title}: { src: string; title: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const onGlobalPlay = () => {
            if (audioRef.current) audioRef.current.pause();
        };
        window.addEventListener("card-audio:play", onGlobalPlay);
        return () => window.removeEventListener("card-audio:play", onGlobalPlay);
    }, []);

    useEffect(() => {
        const a = (audioRef.current ??= new Audio(src));
        const onEnd = () => setIsPlaying(false);
        const onPause = () => setIsPlaying(false);
        const onPlay = () => setIsPlaying(true);

        a.addEventListener("ended", onEnd);
        a.addEventListener("pause", onPause);
        a.addEventListener("play", onPlay);

        return () => {
            a.removeEventListener("ended", onEnd);
            a.removeEventListener("pause", onPause);
            a.removeEventListener("play", onPlay);
            a.pause();
        };
    }, [src]);

    const toggle = async () => {
        const a = (audioRef.current ??= new Audio(src));
        a.preload = "none";

        if (a.paused) {
            window.dispatchEvent(new CustomEvent("card-audio:play"));
            try {
                await a.play();
                setIsPlaying(true);
            } catch {
                setIsPlaying(false);
            }
        } else {
            a.pause();
            setIsPlaying(false);
        }
    };

    return (
        <button
            onClick={toggle}
            aria-label={`Play ${title}`}
            title={`Play ${title}`}
            className="w-8 h-8 grid place-items-center rounded-md bg-black/80 border border-zinc-800
                       text-zinc-300 text-xs hover:bg-zinc-900 hover:text-white hover:border-zinc-700
                       transition-all duration-200"
        >
            {isPlaying ? "II" : "\u25B6"}
        </button>
    );
}

export default function ProjectCards() {
    return (
        <div>
            <p className="font-mono text-sm text-zinc-500 mb-6">
                <span className="text-ctp-blue">$</span> ls projects/
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project, idx) => (
                    <div
                        key={idx}
                        className="relative group bg-zinc-950 rounded-xl border border-zinc-800/50 overflow-hidden
                                   hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1
                                   opacity-0 animate-fade-up flex flex-col"
                        style={{animationDelay: `${idx * 100 + 100}ms`}}
                    >
                        {/* Image — fixed height */}
                        <div className="h-44 w-full overflow-hidden flex-shrink-0">
                            <img
                                src={project.image}
                                alt={project.projectTitle}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500
                                           grayscale group-hover:grayscale-0 group-hover:scale-105"
                            />
                        </div>

                        {/* Content — fills remaining space */}
                        <div className="p-5 flex flex-col gap-3 flex-1">
                            <h3 className="font-mono text-sm font-semibold text-white">
                                {project.projectTitle}
                            </h3>

                            {project.tags && (
                                <div className="flex flex-wrap gap-1.5">
                                    {project.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 text-[10px] font-mono rounded
                                                       bg-zinc-800/80 text-zinc-500 border border-zinc-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                                {project.description}
                            </p>

                            {/* Links — always pinned to bottom */}
                            <div className="flex gap-3 mt-auto pt-3 border-t border-zinc-800/50">
                                {project.demoUrl && (
                                    <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-xs text-zinc-500 hover:text-white transition-colors duration-200"
                                    >
                                        live &rarr;
                                    </a>
                                )}
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-xs text-zinc-500 hover:text-white transition-colors duration-200"
                                >
                                    github &rarr;
                                </a>
                            </div>
                        </div>

                        {project.songSrc && (
                            <div className="absolute top-2 right-2 z-20">
                                <PlayButton src={project.songSrc} title={project.projectTitle}/>
                            </div>
                        )}

                        <BorderBeam className="rounded-xl z-10"/>
                    </div>
                ))}
            </div>
        </div>
    );
}
