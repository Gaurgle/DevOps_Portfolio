// tailwind.config.js
export default {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx,astro}",
        "./components/**/*.{html,js,jsx,ts,tsx,astro}",
        "./layouts/**/*.{html,js,jsx,ts,tsx,astro}",
    ],
    theme: {
        extend: {
            keyframes: {
                "border-beam": {
                    "100%": {
                        "offset-distance": "100%",
                    },
                },
            },
            animation: {
                "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
            },
        },
    },
    plugins: [],
};
