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
        <div className="flex gap-6 items-center justify-center fixed bottom-8 left-1/2 transform -translate-x-1/2">
            {icons.map((Icon, i) => (
                <Icon key={i} className="w-8 h-8"/>
            ))}
        </div>
    );
}