import React, { useState, useEffect } from "react";
import AudioManager from "../components/AudioManager"; // Import the singleton manager
import { tracks } from "../data/Tracks"; // Import track list

export default function MusicPlayerWrapper() {
    const [isPlaying, setIsPlaying] = useState(AudioManager.isPlaying); // Sync React state with AudioManager
    const [currentTrack, setCurrentTrack] = useState(
        AudioManager.getCurrentTrack() || {}
    ); // Sync current track with AudioManager

    // Initialize tracks on mount
    useEffect(() => {
        AudioManager.initTracks(tracks);
        setCurrentTrack(AudioManager.getCurrentTrack());
    }, []);

    // Play or pause handling
    const togglePlay = () => {
        AudioManager.togglePlay();
        setIsPlaying(AudioManager.isPlaying);
    };

    // Skip to next track
    const nextTrack = () => {
        AudioManager.nextTrack();
        setCurrentTrack(AudioManager.getCurrentTrack());
        setIsPlaying(AudioManager.isPlaying);
    };

    // Skip to previous track
    const prevTrack = () => {
        AudioManager.prevTrack();
        setCurrentTrack(AudioManager.getCurrentTrack());
        setIsPlaying(AudioManager.isPlaying);
    };

    return (
        <div
            className="fixed bottom-4 right-4 w-[300px] p-4 bg-gray-800 text-white rounded-lg shadow-lg z-50"
        >
            <div className="font-bold mb-2">
                {currentTrack?.title || "No Track Playing"}
            </div>
            <div className="flex items-center justify-between">
                <button onClick={prevTrack}>&laquo; Previous</button>
                <button onClick={togglePlay}>
                    {isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={nextTrack}>Next &raquo;</button>
            </div>
        </div>
    );
}