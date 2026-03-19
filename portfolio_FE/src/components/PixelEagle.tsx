import { useRef, useEffect } from 'react';

type Px = [number, number, string];

const W = '#fff';
const B = '#8B5E3C';
const Y = '#FFB800';
const E = '#222';

const WALK1: Px[] = [
    [5,-8,W],[6,-8,W],
    [3,-7,E],[4,-7,W],[5,-7,W],[6,-7,W],
    [2,-6,Y],[3,-6,W],[4,-6,W],[5,-6,W],[6,-6,B],
    [4,-5,W],[5,-5,B],[6,-5,B],[7,-5,B],
    [3,-4,B],[4,-4,B],[5,-4,B],[6,-4,B],[7,-4,B],[8,-4,B],
    [4,-3,B],[5,-3,B],[6,-3,B],[7,-3,B],[8,-3,B],
    [5,-2,B],[6,-2,B],[7,-2,B],[8,-2,W],[9,-2,W],
    [6,-1,B],[7,-1,B],
    [5,0,Y],[8,0,Y],
];

const WALK2: Px[] = [
    [5,-8,W],[6,-8,W],
    [3,-7,E],[4,-7,W],[5,-7,W],[6,-7,W],
    [2,-6,Y],[3,-6,W],[4,-6,W],[5,-6,W],[6,-6,B],
    [4,-5,W],[5,-5,B],[6,-5,B],[7,-5,B],
    [3,-4,B],[4,-4,B],[5,-4,B],[6,-4,B],[7,-4,B],[8,-4,B],
    [4,-3,B],[5,-3,B],[6,-3,B],[7,-3,B],[8,-3,B],
    [5,-2,B],[6,-2,B],[7,-2,B],[8,-2,W],[9,-2,W],
    [6,-1,B],[7,-1,B],
    [6,0,Y],[9,0,Y],
];

const FLY1: Px[] = [
    [1,-8,B],[10,-8,B],
    [2,-7,B],[9,-7,B],
    [3,-6,B],[8,-6,B],
    [5,-5,W],[6,-5,W],
    [3,-4,E],[4,-4,W],[5,-4,W],[6,-4,W],[7,-4,B],
    [2,-3,Y],[3,-3,W],[4,-3,W],[5,-3,B],[6,-3,B],[7,-3,B],
    [3,-2,B],[4,-2,B],[5,-2,B],[6,-2,B],[7,-2,B],[8,-2,B],
    [4,-1,B],[5,-1,B],[6,-1,B],[7,-1,B],[8,-1,W],[9,-1,W],
];

const FLY2: Px[] = [
    [5,-6,W],[6,-6,W],
    [3,-5,E],[4,-5,W],[5,-5,W],[6,-5,W],[7,-5,B],
    [0,-4,B],[1,-4,B],[2,-4,Y],[3,-4,W],[4,-4,W],[5,-4,B],[6,-4,B],[7,-4,B],[8,-4,B],[9,-4,B],[10,-4,B],
    [3,-3,B],[4,-3,B],[5,-3,B],[6,-3,B],[7,-3,B],[8,-3,B],
    [4,-2,B],[5,-2,B],[6,-2,B],[7,-2,B],[8,-2,W],[9,-2,W],
];

function toShadow(frame: Px[]) {
    return frame.map(([x, y, c]) => `${x}px ${y}px ${c}`).join(',');
}

function mirrorFrame(frame: Px[]): Px[] {
    let minX = Infinity, maxX = -Infinity;
    for (const [x] of frame) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
    }
    const sum = minX + maxX;
    return frame.map(([x, y, c]) => [sum - x, y, c] as Px);
}

const walkRight = [toShadow(mirrorFrame(WALK1)), toShadow(mirrorFrame(WALK2))];
const flyRight = [toShadow(mirrorFrame(FLY1)), toShadow(mirrorFrame(FLY2))];
const walkLeft = [toShadow(WALK1), toShadow(WALK2)];
const flyLeft = [toShadow(FLY1), toShadow(FLY2)];

// "Shot" frame — same as WALK1 (rotation handles the tumble look)
const SHOT: Px[] = WALK1;
const shotRight = toShadow(mirrorFrame(SHOT));
const shotLeft = toShadow(SHOT);

export default function PixelEagle() {
    const ref = useRef<HTMLDivElement>(null);
    const scaredRef = useRef(false);
    const shotRef = useRef(false);
    const runningRef = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let timeout: number;
        let raf: number;
        let mounted = true;

        function run(startX = -50, shootAfter = 0) {
            if (!mounted) return;
            runningRef.current = true;

            let x = startX;
            let y = 0;
            let flying = false;
            let shot = false;
            let fallSpeed = 0;
            let rotation = 0;
            let tick = 0;

            const backwards = Math.random() < 0.15;
            const walkSh = backwards ? walkLeft : walkRight;
            let flySh = backwards ? flyLeft : flyRight;

            const distances = [0.15, 0.3, 0.45, 0.6];
            const flyAt = (window.innerWidth ?? 1000) * distances[Math.floor(Math.random() * distances.length)];

            const trajectories = [
                { dx: 1.2, dy: 0.7 },
                { dx: 0.7, dy: 1.3 },
                { dx: 1.5, dy: 0.4 },
                { dx: 0.5, dy: 1.5 },
            ];
            let flyDir = trajectories[Math.floor(Math.random() * trajectories.length)];

            el.style.display = 'block';

            const step = () => {
                if (!mounted) return;
                tick++;

                // Delayed shot (from shootAfter parameter)
                if (shootAfter > 0 && tick >= shootAfter && !shot) {
                    shot = true;
                    flying = false;
                    fallSpeed = 0.3;
                }

                // Shot via ref (from event while already running)
                if (shotRef.current && !shot) {
                    shot = true;
                    shotRef.current = false;
                    flying = false;
                    fallSpeed = 0.3;
                }

                // Scared = immediate fast fly-away
                if (scaredRef.current && !flying && !shot) {
                    flying = true;
                    scaredRef.current = false;
                    flyDir = { dx: 2.5, dy: 2.5 };
                    flySh = flyRight;
                }

                const frameIdx = Math.floor(tick / 14) % 2;

                if (shot) {
                    fallSpeed += 0.15;
                    y -= fallSpeed;
                    rotation += 8;
                    x += 0.3;
                    el.style.boxShadow = backwards ? shotLeft : shotRight;
                    el.style.bottom = `${y}px`;
                    el.style.transform = `scale(3) rotate(${rotation}deg)`;
                } else if (!flying) {
                    x += 0.35;
                    if (x > flyAt) flying = true;
                    el.style.boxShadow = walkSh[frameIdx];
                    el.style.bottom = `${y - frameIdx}px`;
                } else {
                    x += flyDir.dx;
                    y += flyDir.dy;
                    el.style.boxShadow = flySh[frameIdx];
                    el.style.bottom = `${y}px`;
                }

                if (y > 80 || y < -60) {
                    el.style.display = 'none';
                    el.style.transform = 'scale(3)';
                    runningRef.current = false;
                    timeout = window.setTimeout(run, 45000 + Math.random() * 60000);
                    return;
                }

                el.style.left = `${x}px`;
                raf = requestAnimationFrame(step);
            };

            raf = requestAnimationFrame(step);
        };

        // Click near eagle on banner = scare
        const header = document.getElementById('site-header');
        const handleBannerClick = (e: MouseEvent) => {
            if (!el || el.style.display === 'none') return;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + 15;
            const cy = rect.bottom - 14;
            const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
            if (dist < 40) scaredRef.current = true;
        };
        header?.addEventListener('click', handleBannerClick);

        // Scare from terminal command — also triggers run if eagle isn't active
        const handleScare = () => {
            if (runningRef.current) {
                scaredRef.current = true;
            } else {
                clearTimeout(timeout);
                scaredRef.current = true;
                run(50);
            }
        };
        window.addEventListener('scare-eagle', handleScare);

        // Konami code & terminal shoot = eagle gets shot
        const handleShoot = () => {
            if (runningRef.current) {
                // Already on screen — shoot immediately
                shotRef.current = true;
            } else {
                // Not on screen — fly in, then get shot after 40 frames (~0.7s)
                clearTimeout(timeout);
                run(30, 40);
            }
        };
        window.addEventListener('konami', handleShoot);
        window.addEventListener('shoot-eagle', handleShoot);

        timeout = window.setTimeout(run, 15000 + Math.random() * 20000);

        return () => {
            mounted = false;
            clearTimeout(timeout);
            cancelAnimationFrame(raf);
            header?.removeEventListener('click', handleBannerClick);
            window.removeEventListener('scare-eagle', handleScare);
            window.removeEventListener('konami', handleShoot);
            window.removeEventListener('shoot-eagle', handleShoot);
        };
    }, []);

    return (
        <div
            ref={ref}
            style={{
                display: 'none',
                position: 'absolute',
                bottom: 0,
                left: -50,
                width: '1px',
                height: '1px',
                transform: 'scale(3)',
                transformOrigin: 'bottom left',
                pointerEvents: 'none',
                zIndex: 10,
            }}
        />
    );
}
