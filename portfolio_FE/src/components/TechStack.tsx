// src/components/TechStack.tsx
import {
    SiKotlin,
    SiSpring,
    SiAndroid,
    SiJetpackcompose,
    SiPython,
    SiMysql,
    SiPostgresql,
    SiAstro,
    SiReact,
    SiTailwindcss,
    SiHtml5,
} from "react-icons/si";
import { DiJava } from "react-icons/di";

const icons = [
    SiKotlin,
    DiJava,         // <-- better Java logo
    SiSpring,
    SiAndroid,
    SiJetpackcompose,
    SiPython,
    SiMysql,
    SiPostgresql,
    SiAstro,
    SiReact,
    SiTailwindcss,
    SiHtml5,
];

const links = [
    "https://kotlinlang.org/",
    "https://www.java.com/en/",
    "https://spring.io/",
    "https://www.android.com/intl/en_eng/",
    "https://developer.android.com/jetpack/compose",
    "https://www.python.org/",
    "https://www.mysql.com/",
    "https://www.postgresql.org/",
    "https://astro.build/",
    "https://react.dev/",
    "https://tailwindcss.com/",
    "https://html.spec.whatwg.org/",
]

export default function TechStack() {
    return (
        <div className="z-50 w-full h-12
         bg-black/70 backdrop-blur-[1px] supports-[backdrop-filter]:bg-black/50
         border-b border-white/0 mb-4
         transition-opacity md:opacity-30 md:hover:opacity-100 md:hover:backdrop-blur-[0px]
         [&[data-scrolled]]:shadow-lg flex gap-2 items-center justify-center fixed bottom-0 left-0">
            {icons.map((Icon, i) => (
                <a
                    key={i}
                    href={links[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:w-4 sm:h-4 md:w-8 md:h-8 transition-transform duration-400 hover:scale-125 blur-[1px] hover:blur-0"
                >
                    <Icon className="w-full h-full"/>
                </a>
            ))}
        </div>
    );
}