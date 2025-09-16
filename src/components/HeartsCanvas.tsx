import { useEffect, useRef } from "react";

const HeartsCanvas: React.FC<{ className?: string }> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animRef = useRef<number>(null);
    const hearts = useRef<{ x: number; y: number; size: number; speed: number; wobble: number; hue: number }[]>([]);

    const resize = () => {
        const c = canvasRef.current;
        if (!c) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        c.width = c.clientWidth * dpr;
        c.height = c.clientHeight * dpr;
        const ctx = c.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.floor((c.clientWidth * c.clientHeight) / 35000);
        hearts.current = Array.from({ length: count }).map(() => ({
            x: Math.random() * c.clientWidth,
            y: Math.random() * c.clientHeight,
            size: 8 + Math.random() * 18,
            speed: 0.2 + Math.random() * 0.6,
            wobble: Math.random() * Math.PI * 2,
            hue: 330 + Math.random() * 40,
        }));
    };

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        resize();

        const ctx = c.getContext('2d')!;
        const drawHeart = (x: number, y: number, size: number, color: string) => {
            const s = size / 2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.sin((x + y) * 0.001) * 0.2);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, s);
            ctx.bezierCurveTo(s, s, s, 0, 0, -s * 0.2);
            ctx.bezierCurveTo(-s, 0, -s, s, 0, s);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        const tick = () => {
            ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
            hearts.current.forEach((h) => {
                h.y -= h.speed;
                h.x += Math.sin((h.wobble += 0.02)) * 0.3;
                if (h.y < -20) {
                    h.y = c.clientHeight + 20;
                    h.x = Math.random() * c.clientWidth;
                }
                drawHeart(h.x, h.y, h.size, `hsla(${h.hue}, 80%, 70%, 0.55)`);
            });
            animRef.current = requestAnimationFrame(tick);
        };
        animRef.current = requestAnimationFrame(tick);

        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(animRef.current!);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden />;
};
export default HeartsCanvas;