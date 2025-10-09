import React, {useEffect, useMemo, useRef, useState} from "react";
import type {Track} from "../data/Tracks.ts";

type LoopMode = "off" | "one" | "all";

interface Props {
    tracks: Track[];
    autoPlay?: boolean;
}

export default function MusicPlayer({tracks, autoPlay = false}: Props) {
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loopMode, setLoopMode] = useState<LoopMode>("off");
    const [progress, setProgress] = useState(0); // seconds
    const [duration, setDuration] = useState(0); // seconds
    const audioRef = useRef<HTMLAudioElement>(null);

    const current = useMemo(() => tracks[index], [tracks, index]);

    // Handle autoplay on mount / track change
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Ensure audio loads the new track
        audio.load();

        // Auto-play the audio when the index changes
        audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
                console.error("Error playing track:", err);
                setIsPlaying(false);
            });
    }, [index]);


    // Loop handling on end
    const handleEnded = () => {
        if (loopMode === "one") {
            audioRef.current?.play();
            return;
        }
        if (loopMode === "all") {
            next();
            return;
        }
        // off
        setIsPlaying(false);
    };

    const playPause = () => {
        console.log("Play/Pause clicked");

        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
    };

    const next = () => {
        setIndex((i) => (i + 1) % tracks.length);
    };

    const prev = () => {
        setIndex((i) => (i - 1 + tracks.length) % tracks.length);
    };

    const onTimeUpdate = () => {
        const a = audioRef.current;
        if (!a) return;
        setProgress(a.currentTime || 0);
        setDuration(a.duration || 0);
    };

    const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const a = audioRef.current;
        if (!a) return;
        const val = Number(e.target.value);
        a.currentTime = val;
        setProgress(val);
    };

    const format = (s: number) => {
        if (!Number.isFinite(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    const toggleLoop = () => {
        setLoopMode((m) => (m === "off" ? "one" : m === "one" ? "all" : "off"));
    };

    // Keyboard shortcuts: Space = play/pause, ←/→ seek, ↑/↓ prev/next
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
            if (e.code === "Space") {
                e.preventDefault();
                playPause();
            } else if (e.key === "ArrowRight") {
                const a = audioRef.current;
                if (!a) return;
                a.currentTime = Math.min((a.currentTime || 0) + 5, a.duration || 0);
            } else if (e.key === "ArrowLeft") {
                const a = audioRef.current;
                if (!a) return;
                a.currentTime = Math.max((a.currentTime || 0) - 5, 0);
            } else if (e.key === "ArrowUp") {
                prev();
            } else if (e.key === "ArrowDown") {
                next();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isPlaying]);

    return (
        <div id="music-player" className="w-full max-w-[200px] px-0 select-none">
            {/* Card */}
            <div className="rounded-md bg-black/30 p-2 border border-black/50">
                {/* Header: title only (no image) */}
                <div className="min-w-0">
                    <h3 className="font-medium text-[12px] leading-tight truncate">{current.title}</h3>
                    {current.artist && (
                        <p className="text-[11px] text-gray-400 truncate">{current.artist}</p>
                    )}
                </div>

                {/* Single audio element */}
                <audio
                    ref={audioRef}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={handleEnded}
                    preload="metadata"
                >
                    <source src={current.src} type={`audio/${current.src.split(".").pop()}`} />
                </audio>

                {/* Controls (fixed sizes, no text resizing) */}
                <div className="mt-2 flex items-center gap-1">
                    <button
                        onClick={prev}
                        aria-label="Previous"
                        className="w-8 h-7 rounded bg-black text-gray-200 text-xs grid place-items-center hover:bg-black/80"
                    >
                        ◀
                    </button>
                    <button
                        onClick={playPause}
                        aria-label="Play/Pause"
                        className="w-10 h-7 rounded bg-yellow-400 text-black text-xs grid place-items-center hover:bg-white"
                    >
                        {isPlaying ? "II" : "▶"}
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next"
                        className="w-8 h-7 rounded bg-black text-gray-200 text-xs grid place-items-center hover:bg黑/80 hover:bg-black/80"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {/* Ultra-compact playlist */}
            <div className="mt-2 rounded-md bg-black/30 p-2 border border-black/50 max-h-[140px] overflow-auto">
                <h4 className="text-[11px] text-gray-400 mb-1">Playlist</h4>
                <ul className="space-y-[1px]">
                    {tracks.map((t, i) => {
                        const active = i === index;
                        return (
                            <li key={t.id ?? `${t.title}-${i}`}>
                                <button
                                    onClick={() => {
                                        setIndex(i);
                                        const a = audioRef.current;
                                        if (a) {
                                            a.pause();
                                            a.load();
                                            a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
                                        }
                                    }}
                                    className={`w-full text-left px-0 py-[4px] rounded text-[11px] leading-none truncate transition
                ${active ? "bg-gray-300 text-black" : "bg-black/70 text-gray-200 hover:bg-black"}`}
                                    title={t.title}
                                >
                                    {t.title}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}