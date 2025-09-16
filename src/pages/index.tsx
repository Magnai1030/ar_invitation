import Head from 'next/head';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// ✏️ Personalize these
const YOUR_NAME = 'Magnai';
const PARTNER_NAME = 'Ari';
const ANNIVERSARY_DATE = '2023-09-16'; // YYYY-MM-DD
const TAGLINE = 'Two years down, forever to go 💖';

// Optional: If you provide your daughter's birthday, we’ll compute a live age.
const BABY_NAME = 'Moonie';
const BABY_BIRTHDAY: string | null = "2024-11-06"; // e.g., '2024-11-06'
const STATIC_BABY_MONTHS = 10;

// Photo gallery (replace with your own)
const PHOTOS: { src: string; alt: string }[] = [
  { src: '1.JPG', alt: '1' },
  { src: '2.JPG', alt: '2' },
  { src: '3.jpg', alt: '3' },
  { src: '4.jpg', alt: '4' },
  { src: '5.jpg', alt: '5' },
  { src: '6.jpg', alt: '6' },
  { src: '7.JPG', alt: '7' },
  { src: '8.jpg', alt: '8' },
  { src: '9.jpg', alt: '9' },
  { src: '10.jpg', alt: '10' },
  { src: '11.jpg', alt: '11' },
  { src: '12.jpg', alt: '12' },
  { src: '13.jpg', alt: '13' },
];

const LETTER = (you: string) => `My love,

In the past two years, you’ve turned ordinary days into stories,
and quiet moments into cherished memories. Thank you for your patience,
your kindness, and the gentle way you make everything feel like home.

Here’s to us, to our laughter, our late-night talks, and the adventures ahead.
I love you — today, tomorrow, and always.

— ${you}
`;

/* ---------- utils ---------- */
const formatDuration = (startISO: string) => {
  const start = new Date(startISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (60 * 1000)) % 60;
  const hours = Math.floor(diff / (60 * 60 * 1000)) % 24;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const years = Math.floor(days / 365);
  const remDays = days % 365;
  return { years, remDays, hours, minutes, seconds };
};

function monthsSince(iso: string) {
  const b = new Date(iso);
  const n = new Date();
  let months = (n.getFullYear() - b.getFullYear()) * 12 + (n.getMonth() - b.getMonth());
  if (n.getDate() < b.getDate()) months--;
  const daysInMonth = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
  const approxDays = (n.getDate() - b.getDate() + daysInMonth) % daysInMonth;
  return { months: Math.max(0, months), approxDays: Math.max(0, approxDays) };
}

/* ---------- tiny component helpers ---------- */
const FadeIn: React.FC<React.PropsWithChildren<{ delay?: number; className?: string }>> = ({ children, delay = 0, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setVis(true)), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-2 ${vis ? 'animate-fade-in-up' : ''} ${className ?? ''}`}
      style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// Floating hearts canvas background
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

type ConfettiPiece = { id: number; left: number; size: number; color: string; delay: number; rotate: number; duration: number };
const useConfetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const trigger = () => {
    const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', '#ffffff'];
    const batch: ConfettiPiece[] = Array.from({ length: 80 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      size: 6 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.2,
      rotate: (Math.random() - 0.5) * 360,
      duration: 2.6 + Math.random() * 1.4,
    }));
    setPieces(batch);
    setTimeout(() => setPieces([]), 4000);
  };
  return { pieces, trigger };
};

/* ---------- Page ---------- */
export default function HomePage() {
  const { pieces, trigger } = useConfetti();

  // trigger re-render every second for timers/age
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const [showLetter, setShowLetter] = useState(false);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!showLetter) return;
    const msg = LETTER(YOUR_NAME);
    setTyped('');
    let i = 0;
    const timer = setInterval(() => {
      setTyped((prev) => prev + msg[i]);
      i++;
      if (i >= msg.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [showLetter]);

  const partnerName = useMemo(() => {
    if (typeof window === 'undefined') return PARTNER_NAME;
    const q = new URLSearchParams(window.location.search);
    return q.get('for') || PARTNER_NAME;
  }, []);

  const dur = formatDuration(ANNIVERSARY_DATE);

  const timeline: { when: string; emoji: string; title: string; text: string }[] = [
    { when: 'Year 1', emoji: '🌙', title: 'Our Beginning', text: 'From strangers to late-night chats and endless smiles.' },
    { when: 'Year 2', emoji: '🌸', title: 'Growing Together', text: 'Trips, tiny wins, and learning each other’s little worlds.' },
    { when: 'Today', emoji: '💞', title: 'Stronger Than Ever', text: 'Two years in — hearts full, stories still unfolding.' },
  ];

  const babyAgeText = useMemo(() => {
    if (BABY_BIRTHDAY) {
      const { months, approxDays } = monthsSince(BABY_BIRTHDAY);
      return `${months} month${months !== 1 ? 's' : ''}${approxDays ? ` ${approxDays} day${approxDays !== 1 ? 's' : ''}` : ''}`;
    }
    return `${STATIC_BABY_MONTHS} months`;
  }, [tick]);

  const [active, setActive] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <Head>
        {/* Load fonts here if you didn't add _document.tsx */}
        https://fonts.gstatic.com
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;600;800&display" />
        <title>Our 2nd Anniversary ✨</title>
        <meta name="description" content="Celebrating two years of us — memories, moments, and magic." />
      </Head>

      <main className="relative min-h-screen overflow-x-hidden">
        {/* Background hearts */}
        <HeartsCanvas className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />

        {/* Confetti layer */}
        <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
          {pieces.map((p) => (
            <span
              key={p.id}
              className="absolute top-[-8vh] rounded-sm animate-confetti"
              style={
                {
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size * 0.6,
                  background: p.color,
                  transform: `rotate(${p.rotate}deg)`,
                  animationDelay: `${p.delay}s`,
                  ['--confetti-duration' as any]: `${p.duration}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* HERO */}
        <section className="grid place-items-center px-4 pt-16 pb-10 sm:pt-24 sm:pb-12">
          <div className="w-full max-w-5xl rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)] text-center p-6 sm:p-10">
            <h1
              className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-4xl sm:text-6xl font-bold"
              style={{ fontFamily: '"Great Vibes", cursive' }}
            >
              Happy 2nd Anniversary
            </h1>

            <p className="mt-2 font-semibold tracking-wide">
              {YOUR_NAME} <span className="text-[var(--color-primary)]">❤</span> {partnerName}
            </p>
            <p className="mt-1 text-white/85">{TAGLINE}</p>

            <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                <div className="text-2xl sm:text-3xl font-extrabold">{dur.years}</div>
                <div className="text-sm opacity-80">years</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                <div className="text-2xl sm:text-3xl font-extrabold">{dur.remDays}</div>
                <div className="text-sm opacity-80">days</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                <div className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                  {String(dur.hours).padStart(2, '0')}:{String(dur.minutes).padStart(2, '0')}:{String(dur.seconds).padStart(2, '0')}
                </div>
                <div className="text-sm opacity-80">hrs : min : sec</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => trigger()}
                className="rounded-xl font-bold text-gray-900 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:brightness-110 active:brightness-95 transition"
              >
                Celebrate 🎊
              </button>
              <button
                onClick={() => setShowLetter((s) => !s)}
                className="rounded-xl font-bold px-4 py-2 border border-white/30 hover:border-white/50 transition"
              >
                {showLetter ? 'Hide Letter' : 'Open Letter 💌'}
              </button>
            </div>
          </div>
        </section>

        {/* LOVE LETTER */}
        {showLetter && (
          <FadeIn>
            <section className="grid place-items-center px-4 pb-2">
              <div className="w-full max-w-3xl rounded-2xl border border-white/20 bg-black/35 p-5 shadow-inner">
                <pre className="whitespace-pre-wrap font-mono leading-7 text-white/90">{typed}</pre>
              </div>
            </section>
          </FadeIn>
        )}

        {/* FAMILY NOTE — 10-month-old daughter or live age */}
        <FadeIn>
          <section className="px-4 pt-4 pb-2">
            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
                <h2 className="text-xl font-extrabold">Our Little Star 👶</h2>
                <p className="mt-1 text-white/85">
                  We’re celebrating not just us, but our growing family — {BABY_NAME} is <b>{babyAgeText}</b> old! 🍼🌟
                </p>
                <p className="mt-2 text-white/75">
                  Your giggles, first babbles, and tiny milestones turned our love into a home. We love you, little one. 💗
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-sm">Cuddles</span>
                  <span className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-sm">First step (soon!)</span>
                  <span className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-sm">First words (soon!)</span>
                  <span className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-sm">Tiny steps</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
                <h3 className="font-bold">A wish for us ✨</h3>
                <p className="mt-1 text-white/85">
                  Let’s keep making cozy mornings, spontaneous trips, and silly dance breaks — together.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="grid place-items-center rounded-xl border border-white/20 bg-black/30 p-4 text-center animate-float">💖</div>
                  <div className="grid place-items-center rounded-xl border border-white/20 bg-black/30 p-4 text-center animate-float [animation-delay:200ms]">👨‍👩‍👧</div>
                  <div className="grid place-items-center rounded-xl border border-white/20 bg-black/30 p-4 text-center animate-float [animation-delay:400ms]">🌈</div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
                <h3 className="font-bold">Scan a qr ✨</h3>
                <img
                  src={"qr.png"}
                  alt={"qr"}
                  loading="lazy"
                  className="h-full w-full object-contain mb-2"
                />
              </div>
            </div>
          </section>
        </FadeIn>

        {/* TIMELINE */}
        <FadeIn>
          <section className="px-4 pt-8 pb-2">
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold">Our Story</h2>
            <div className="mx-auto mt-3 h-[2px] w-full max-w-xl bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            <div className="mx-auto mt-6 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {timeline.map((t, idx) => (
                <div key={idx} className="grid grid-cols-[auto,1fr] items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-white/10 text-lg">{t.emoji}</div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <div className="text-xs opacity-80">{t.when}</div>
                    <div className="font-bold">{t.title}</div>
                    <div className="mt-1 text-white/90">{t.text}</div>
                  </div>
                </div>
              ))}
              {/* Special card for your daughter */}
              <div className="grid grid-cols-[auto,1fr] items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-white/10 text-lg">👶</div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                  <div className="text-xs opacity-80">This year</div>
                  <div className="font-bold">Our Little Miracle</div>
                  <div className="mt-1 text-white/90">
                    {BABY_BIRTHDAY ? `You’ve blessed us for ${babyAgeText} already.` : `10 months of cuddles, curiosity, and joy — you made our hearts bigger than we knew possible.`}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* GALLERY */}
        <FadeIn>
          <section className="px-4 pt-8 pb-14">
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold">Favorite Moments</h2>
            <div className="mx-auto mt-5 grid max-w-6xl gap-2 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
              {PHOTOS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActive(p)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/20 bg-white/10"
                  aria-label={`Open photo: ${p.alt}`}
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* FOOTER */}
        <footer className="px-4 py-10 text-center text-white/85">
          <p>
            Made with <span className="text-[var(--color-primary)]">❤</span> by {YOUR_NAME}
          </p>
          <p className="text-sm text-white/70">Since {new Date(ANNIVERSARY_DATE).toLocaleDateString()}</p>
        </footer>
        {active && (
          <div
            onClick={() => setActive(null)}
            className="absolute inset-0 z-50 grid place-items-center bg-black/75 p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5"
            >
              Close ✕
            </button>
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[84vh] max-w-[92vw] rounded-2xl border border-white/20 bg-black"
            />
          </div>
        )}
      </main>
    </>
  );
}
