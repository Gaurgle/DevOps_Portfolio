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
        <div className="w-full max-w-2xl mx-auto relative">
            {/* Floating Button to Show Player */}
            <button
                className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
                onClick={() => {
                    const player = document.getElementById("music-player");
                    if (player) {
                        player.classList.toggle("hidden");
                    }
                }}
            >
                Open Player
            </button>

            {/* Floating Music Player */}
            <div
                id="music-player"
                className="hidden fixed bottom-14 right-5 bg-black/40 border border-gray-800 rounded-xl shadow-lg p-6 z-50 max-w-2xl"
            >
                {/* Player card */}
                <div className="p-5 rounded-1xl bg-black/40 border border-gray-800">
                    <div className="flex items-center gap-5">
                        {current.cover ? (
                            <img
                                src={current.cover}
                                alt={current.title}
                                className="w-24 h-24 rounded-xl object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-xl bg-gray-800 grid place-items-center text-gray-400">
                                ♪
                            </div>
                        )}

                        <div className="min-w-0">
                            <h3 className="font-semibold truncate">{current.title}</h3>
                            {current.artist && (
                                <p className="text-sm text-gray-400 truncate">{current.artist}</p>
                            )}
                            <p className="text-xs text-gray-500 truncate">{current.src}</p>
                        </div>
                        <button onClick={playPause} className="mt-4">
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                    </div>

                    {/* Audio Element */}
                    <audio
                        ref={audioRef}
                        onTimeUpdate={onTimeUpdate}
                        onEnded={handleEnded}
                    >
                        <source src={current.src} type={`audio/${current.src.split('.').pop()}`}/>
                    </audio>

                    {/* Controls */}
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            onClick={prev}
                            className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                            aria-label="Previous"
                        >
                            ◀
                        </button>
                        <button
                            onClick={playPause}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-black hover:bg-white"
                            aria-label="Play/Pause"
                        >
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                        <button
                            onClick={next}
                            className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                            aria-label="Next"
                        >
                            ▶
                        </button>

                        <button
                            onClick={toggleLoop}
                            className="ml-auto px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
                            title="Loop: off → one → all"
                            aria-label="Loop mode"
                        >
                            Loop: {loopMode}
                        </button>
                    </div>

                    {/* Seek */}
                    <div className="mt-4">
                        <input
                            type="range"
                            min={0}
                            max={Math.floor(duration || 0)}
                            step={1}
                            value={Math.floor(progress || 0)}
                            onChange={onSeek}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>{format(progress)}</span>
                            <span>{format(duration)}</span>
                        </div>
                    </div>
                </div>

                {/* Playlist */}
                <div className="p-5 rounded-2xl bg-black/40 border border-gray-800 max-h-[360px] overflow-auto">
                    <h4 className="text-sm text-gray-400 mb-3">Playlist</h4>
                    <ul className="grid gap-2">
                        {tracks.map((t, i) => {
                            const active = i === index;
                            return (
                                <li key={t.id ?? `${t.title}-${i}`}>
                                    <button
                                        onClick={() => {
                                            setIndex(i);
                                            const audio = audioRef.current;
                                            if (audio) {
                                                audio.pause();
                                                audio.load();
                                                audio.play()
                                                    .then(() => setIsPlaying(true)
                                                    )
                                                    .catch((err) => console.error("Playback error:", err));
                                            }
                                        }
                                        }
                                        className={`w-full text-left p-3 rounded-lg transition ${
                                            active
                                                ? "bg-gray-200 text-black"
                                                : "bg-gray-900 hover:bg-gray-800 text-gray-200"
                                        }`}
                                    >
                                        <div className="font-medium truncate">{t.title}</div>
                                        {t.artist && (
                                            <div className="text-xs text-gray-500 truncate">
                                                {t.artist}
                                            </div>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}