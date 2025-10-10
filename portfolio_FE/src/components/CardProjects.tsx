import React, { useEffect, useRef, useState } from "react";
import BorderBeam from "./HibubbaIO/BorderBeam.tsx";
import { projects } from "../data/projects.ts";

/** Tiny, self-contained play/pause button for one audio source */
function PlayButton({ src, title }: { src: string; title: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Pause this button when another one starts
    useEffect(() => {
        const onGlobalPlay = () => {
            if (audioRef.current) audioRef.current.pause();
        };
        window.addEventListener("card-audio:play", onGlobalPlay);
        return () => window.removeEventListener("card-audio:play", onGlobalPlay);
    }, []);

    // Keep UI in sync with audio state
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
            // tell other cards to pause
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
            className="w-8 h-8 grid place-items-center rounded bg-black/80 text-gray-100 text-xs hover:bg-black transition"
        >
            {isPlaying ? "II" : "\u25B6"}
        </button>
    );
}

export default function ProjectCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
                <div
                    key={idx}
                    className="relative group bg-black dark:bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden hover:border-yellow-500/20 transition-all"
                >
                    {/* Image */}
                    <div className="h-48 w-full overflow-hidden">
                        <img
                            src={project.image}
                            alt={project.projectTitle}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:blur-0 blur-[2px] grayscale group-hover:grayscale-0"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between h-[220px]">
                        <div>
                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-2 text-white">
                                {project.projectTitle}
                            </h3>
                            <p className="text-sm text-gray-400 mb-4 h-20 overflow-y-auto">
                                {project.description}
                            </p>
                        </div>

                        {/* Links */}
                        <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2">
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-white hover:underline self-start"
                                >
                                    See project live →
                                </a>
                            )}

                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-white hover:underline self-start"
                            >
                                View on GitHub →
                            </a>
                        </div>
                    </div>

                    {/* Play Button */}
                    {project.songSrc && (
                        <div className="absolute top-2 right-2 z-20">
                            <PlayButton src={project.songSrc} title={project.projectTitle}/>
                        </div>
                    )}

                    <BorderBeam className="rounded-2xl z-10"/>
                </div>
            ))}
        </div>
    );
}