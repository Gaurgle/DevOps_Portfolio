// src/components/TechStack.tsx
import {
    SiKotlin,
    SiSpring,
    SiAndroid,
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
    SiPython,
    SiMysql,
    SiPostgresql,
    SiAstro,
    SiReact,
    SiTailwindcss,
    SiHtml5,
];

export default function TechStack() {
    return (
        <div className="z-50 w-full h-12
         bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50
         border-b border-white/0
         transition-opacity md:opacity-20 md:hover:opacity-100 md:hover:backdrop-blur-lg
         [&[data-scrolled]]:shadow-lg flex gap-2 items-center justify-center fixed bottom-0 left-0">
            {icons.map((Icon, i) => (
                <Icon
                    key={i}
                    className="sm:w-4 sm:h-4 md:w-6 md:h-6 transition-transform duration-200 hover:scale-125"
                />
            ))}
        </div>
    );
}