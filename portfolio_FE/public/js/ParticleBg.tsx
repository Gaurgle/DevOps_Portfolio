import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

function hexToRgb(hex: string): number[] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const hexInt = parseInt(h, 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

type Props = {
  quantity?: number;
  size?: number;
  color?: string;          // light mode
  darkModeColor?: string;  // dark mode
  speed?: number;
  className?: string;
  children?: React.ReactNode;
};

type Circle = {
  x: number; y: number; size: number; alpha: number;
  fadeInStartTime: number; fadeSpeed: number; dx: number; dy: number;
};

const ParticleBg: React.FC<Props> = ({
                                       quantity = 200,
                                       size = 0.1,
                                       color = "#000000",
                                       darkModeColor = "#ffffff",
                                       speed = 0.15,
                                       className,
                                       children,
                                     }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  // detect dark mode without next-themes
  const [isDark, setIsDark] = useState<boolean>(() =>
      typeof window !== "undefined" && window.matchMedia
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : false
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const rgb = useMemo(() => hexToRgb(isDark ? darkModeColor : color), [isDark, darkModeColor, color]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    circles.current.length = 0;
    canvasSize.current.w = window.innerWidth;
    canvasSize.current.h = window.innerHeight;
    canvas.width = Math.floor(canvasSize.current.w * dpr);
    canvas.height = Math.floor(canvasSize.current.h * dpr);
    canvas.style.width = `${canvasSize.current.w}px`;
    canvas.style.height = `${canvasSize.current.h}px`;
    ctx.current = canvas.getContext("2d");
    ctx.current?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [dpr]);

  const newCircle = useCallback((): Circle => {
    const x = Math.random() * canvasSize.current.w;
    const y = Math.random() * canvasSize.current.h;
    const r = Math.random() * 2 + size;
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.2;
    return {
      x, y, size: r, alpha: 0,
      fadeInStartTime: performance.now(),
      fadeSpeed: Math.random() * 0.0009 + 0.0006,
      dx, dy,
    };
  }, [size]);

  const drawCircle = useCallback((c: Circle, update = false) => {
    if (!ctx.current) return;
    ctx.current.shadowBlur = c.size * 3;
    ctx.current.shadowColor = `rgba(${rgb.join(",")}, ${c.alpha})`;
    ctx.current.beginPath();
    ctx.current.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.current.fillStyle = `rgba(${rgb.join(",")}, ${c.alpha})`;
    ctx.current.fill();
    if (!update) circles.current.push(c);
  }, [rgb]);

  const clear = useCallback(() => {
    ctx.current?.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
  }, []);

  const drawInitial = useCallback(() => {
    clear();
    for (let i = 0; i < quantity; i++) drawCircle(newCircle());
  }, [clear, drawCircle, newCircle, quantity]);

  const animate = useCallback(() => {
    clear();
    const now = performance.now();
    for (let i = circles.current.length - 1; i >= 0; i--) {
      const c = circles.current[i];
      const elapsed = now - c.fadeInStartTime;
      const fadeCycle = Math.sin(elapsed * c.fadeSpeed);
      c.alpha = 0.3 + 0.3 * fadeCycle;
      c.x += c.dx;
      c.y += c.dy - speed;
      drawCircle(c, true);
      if (c.x < -c.size || c.x > canvasSize.current.w + c.size || c.y < -c.size) {
        circles.current.splice(i, 1);
        const n = newCircle();
        n.y = canvasSize.current.h + n.size;
        drawCircle(n);
      }
    }
    requestAnimationFrame(animate);
  }, [clear, drawCircle, newCircle, speed]);

  useEffect(() => {
    resizeCanvas();
    drawInitial();
    const onResize = () => { resizeCanvas(); drawInitial(); };
    window.addEventListener("resize", onResize);
    const raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [animate, drawInitial, resizeCanvas]);

  return (
      <div className={`relative w-full h-full overflow-hidden ${className || ""}`}>
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60 transition-opacity duration-500 ease-in-out"
        />
        <div className="flex items-center justify-center w-full h-full relative z-10">
          {children}
        </div>
      </div>
  );
};

export default ParticleBg;
