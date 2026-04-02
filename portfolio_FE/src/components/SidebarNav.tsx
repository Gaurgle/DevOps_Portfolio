import TextRoll from "./TextRoll";

const links = [
    { href: "/", label: "home", color: "text-ctp-green/60", hoverColor: "group-hover:text-ctp-green" },
    { href: "/projects", label: "projects", color: "text-ctp-blue/60", hoverColor: "group-hover:text-ctp-blue" },
    { href: "/about", label: "about", color: "text-ctp-mauve/60", hoverColor: "group-hover:text-ctp-mauve" },
    { href: "/contact", label: "contact", color: "text-ctp-peach/60", hoverColor: "group-hover:text-ctp-peach" },
];

export default function SidebarNav() {
    return (
        <div className="space-y-1">
            {links.map(({ href, label, color, hoverColor }) => (
                <a
                    key={href}
                    className="group flex items-center gap-2 py-1.5 font-mono text-sm text-zinc-200 hover:text-white transition-colors duration-200"
                    href={href}
                >
                    <span className={`${color} ${hoverColor} transition-colors`}>&gt;</span>
                    <TextRoll>{label}</TextRoll>
                </a>
            ))}
        </div>
    );
}
