// tailwind.config.js
export default {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx,astro}",
        "./components/**/*.{html,js,jsx,ts,tsx,astro}",
        "./layouts/**/*.{html,js,jsx,ts,tsx,astro}",
    ],
    theme: {
        fontFamily: {
            sans: ["Roboto", '"Press Start 2P"', "Poppins", "Inter", "Manrope", "sans-serif"],
            serif: ["Roboto", "Manrope", "sans-serif"],
            mono: ["Inter", "Roboto Mono", "sans-serif"],
            weird: ['"Press Start 2P"', "sans-serif"],
            ramose: ["Ramose", "cursive"],
        },
        extend: {
            keyframes: {
                blob: {
                    "0%": {transform: "translate(0px, 0px) scale(1) rotate(0deg)"},
                    "33%": {transform: "translate(30px, -50px) scale(1.1) rotate(10deg)"},
                    "66%": {transform: "translate(-20px, 20px) scale(0.9) rotate(-5deg)"},
                    "100%": {transform: "translate(0px, 0px) scale(1) rotate(0deg)"},
                },
                "border-beam": {
                    "100%": {
                        "offset-distance": "100%",
                    },
                },

            },
            animation: {
                "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
                blob: "blob 7s infinite ease-in-out",
            },
        },
    },
    plugins: [],
};
