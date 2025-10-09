export type Track = {
    id: string;
    title: string;
    artist?: string;
    src: string;       // path to your audio file
    cover?: string;    // optional cover image
};

export const tracks: Track[] = [
    {
        id: "15GameSong",
        title: "Game15 8-bit old school",
        artist: "Andreas Roos",
        src: "/audio/Game15_1.0.wav",
    },
    {
        id: "QuizGameSong",
        title: "Quiz Game Theme Song",
        artist: "Andreas Roos",
        src: "/audio/quizThemeSong.wav",
    },
    {
        id: "YachtStrikeSong",
        title: "Yacht Strike Theme Song",
        artist: "Andreas Roos",
        src: "/audio/wavYachtTheme.wav",
    },
];