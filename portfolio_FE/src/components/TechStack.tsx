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
    SiDocker,
    SiBluetooth,
} from "react-icons/si";
import {DiJava} from "react-icons/di";

const stack = [
    {icon: SiKotlin, name: "Kotlin"},
    {icon: DiJava, name: "Java"},
    {icon: SiSpring, name: "Spring"},
    {icon: SiAndroid, name: "Android"},
    {icon: SiBluetooth, name: "BLE"},
    {icon: SiDocker, name: "Docker"},
    {icon: SiPython, name: "Python"},
    {icon: SiMysql, name: "MySQL"},
    {icon: SiPostgresql, name: "PostgreSQL"},
    {icon: SiAstro, name: "Astro"},
    {icon: SiReact, name: "React"},
    {icon: SiTailwindcss, name: "Tailwind"},
];

export default function TechStack() {
    return (
        <div className="flex flex-wrap gap-5 items-center justify-center">
            {stack.map(({icon: Icon, name}) => (
                <div key={name} className="flex flex-col items-center gap-1.5 group cursor-default">
                    <Icon className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors duration-300"/>
                    <span className="font-mono text-[10px] text-zinc-700 group-hover:text-zinc-400 transition-colors duration-300">
                        {name}
                    </span>
                </div>
            ))}
        </div>
    );
}
