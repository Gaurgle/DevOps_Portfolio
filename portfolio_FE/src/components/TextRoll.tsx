type Props = {
    children: string;
    stagger?: number;
};

export default function TextRoll({ children, stagger = 0.02 }: Props) {
    const chars = children.split("");
    return (
        <span className="text-roll">
            <span className="text-roll-top">
                {chars.map((c, i) => (
                    <span key={i} style={{ '--d': `${i * stagger}s` } as React.CSSProperties}>
                        {c === " " ? "\u00A0" : c}
                    </span>
                ))}
            </span>
            <span className="text-roll-bottom">
                {chars.map((c, i) => (
                    <span key={i} style={{ '--d': `${i * stagger}s` } as React.CSSProperties}>
                        {c === " " ? "\u00A0" : c}
                    </span>
                ))}
            </span>
        </span>
    );
}
