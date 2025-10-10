import React, { useRef, useState, useEffect } from "react";

type Props = {
    src: string;            // e.g. "/audio/quizThemeSong.wav"
    title?: string;         // optional label for a11y
};

export default function PlayButton({ src, title = "Play preview" }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // pause if another PlayButton starts playing
    useEffect(() => {
        const onGlobalPlay = () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
        window.addEventListener("card-audio:play", onGlobalPlay);
        return () => window.removeEventListener("card-audio:play", onGlobalPlay);
    }, []);

    const toggle = async () => {
        const a = (audioRef.current ??= new Audio(src));
        a.preload = "none";
        a.currentTime = 0; // Start from the beginning

        // notify others to stop
        window.dispatchEvent(new CustomEvent("card-audio:play"));
        try {
            await a.play();
            setIsPlaying(true);
        } catch {
            setIsPlaying(false);
        }
    };

    // keep UI in sync on natural end
    useEffect(() => {
        const a = (audioRef.current ??= new Audio(src));
        const onEnd = () => setIsPlaying(false);
        const onPause = () => setIsPlaying(false);
        a.addEventListener("ended", onEnd);
        a.addEventListener("pause", onPause);
        return () => {
            a.removeEventListener("ended", onEnd);
            a.removeEventListener("pause", onPause);
            a.pause();
        };
    }, [src]);

    return (
        <button
            onClick={toggle}
            aria-label={title}
            className={`w-8 h-8 grid place-items-center rounded bg-black text-gray-200 text-xs
                  hover:bg-black/80 transition`}
            title={title}
        >
            {isPlaying ? "II" : "▶"}
        </button>
    );
}