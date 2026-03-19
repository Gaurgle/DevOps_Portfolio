// tailwind.config.js
export default {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx,astro}",
    ],
    theme: {
        fontFamily: {
            sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
            mono: ['"Noto Sans Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
            ramose: ["Ramose", "cursive"],
        },
        extend: {
            colors: {
                ctp: {
                    crust:    '#11111b',
                    mantle:   '#181825',
                    base:     '#1e1e2e',
                    surface0: '#313244',
                    surface1: '#45475a',
                    surface2: '#585b70',
                    overlay0: '#6c7086',
                    overlay1: '#7f849c',
                    overlay2: '#9399b2',
                    subtext0: '#a6adc8',
                    subtext1: '#bac2de',
                    text:     '#cdd6f4',
                    green:    '#a6e3a1',
                    red:      '#f38ba8',
                    yellow:   '#f9e2af',
                    peach:    '#fab387',
                    mauve:    '#cba6f7',
                    pink:     '#f5c2e7',
                    blue:     '#89b4fa',
                    lavender: '#b4befe',
                    teal:     '#94e2d5',
                },
            },
            keyframes: {
                blob: {
                    "0%":   { transform: "translate(0px, 0px) scale(1) rotate(0deg)" },
                    "33%":  { transform: "translate(30px, -50px) scale(1.1) rotate(10deg)" },
                    "66%":  { transform: "translate(-20px, 20px) scale(0.9) rotate(-5deg)" },
                    "100%": { transform: "translate(0px, 0px) scale(1) rotate(0deg)" },
                },
                "border-beam": {
                    "100%": { "offset-distance": "100%" },
                },
                "fade-up": {
                    "0%":   { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    "0%":   { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
            animation: {
                blob: "blob 7s infinite ease-in-out",
                "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
                "fade-up": "fade-up 0.6s ease-out forwards",
                "fade-in": "fade-in 0.8s ease-out forwards",
            },
        },
    },
    plugins: [],
};
