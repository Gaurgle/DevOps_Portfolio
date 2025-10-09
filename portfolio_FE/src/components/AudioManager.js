class AudioManager {
    constructor() {
        if (!AudioManager.instance) {
            // Check if we’re in the browser before initializing `Audio`
            if (typeof window !== "undefined" && typeof Audio !== "undefined") {
                this.audio = new Audio(); // Create a global HTMLAudioElement
            } else {
                this.audio = null;
            }

            this.currentTrackIndex = 0; // Keep track of the currently playing track
            this.isPlaying = false; // Playback state
            this.tracks = []; // List of tracks
            AudioManager.instance = this;
        }

        return AudioManager.instance;
    }

    initTracks(tracks) {
        if (!this.audio) {
            console.warn("AudioManager is not initialized because `Audio` is unavailable.");
            return;
        }

        if (this.tracks.length === 0) {
            this.tracks = tracks;
            this.audio.src = tracks[this.currentTrackIndex]?.url;
        }
    }

    play() {
        if (this.audio) {
            this.audio.play();
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }

    togglePlay() {
        if (this.audio) {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        }
    }

    nextTrack() {
        if (this.audio) {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
            this.audio.src = this.tracks[this.currentTrackIndex]?.url;
            this.play();
        }
    }

    prevTrack() {
        if (this.audio) {
            this.currentTrackIndex =
                (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
            this.audio.src = this.tracks[this.currentTrackIndex]?.url;
            this.play();
        }
    }

    getCurrentTrack() {
        return this.tracks[this.currentTrackIndex];
    }
}

const instance = new AudioManager();
Object.freeze(instance); // Make it a singleton
export default instance;