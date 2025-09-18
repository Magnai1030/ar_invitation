import HeartsCanvas from '@/components/HeartsCanvas';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic'

const Counter = dynamic(() => import('@/components/Counter'), {
  ssr: false,
})

const ModelViewer = dynamic(() => import('../components/ModelViewer'), {
  ssr: false,
});


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
  { src: '/1.JPG', alt: '1' },
  { src: '/2.JPG', alt: '2' },
  { src: '/3.jpg', alt: '3' },
  { src: '/4.jpg', alt: '4' },
  { src: '/5.jpg', alt: '5' },
  { src: '/6.jpg', alt: '6' },
  { src: '/7.JPG', alt: '7' },
  { src: '/8.jpg', alt: '8' },
  { src: '/9.jpg', alt: '9' },
  { src: '/10.jpg', alt: '10' },
  { src: '/11.jpg', alt: '11' },
  { src: '/12.jpg', alt: '12' },
  { src: '/14.jpg', alt: '13' },
];

const LETTER = (you: string) => `My love,

In the past two years, you’ve turned ordinary days into stories,
and quiet moments into cherished memories. Thank you for your patience,
your kindness, and the gentle way you make everything feel like home.

Here’s to us, to our laughter, our late-night talks, and the adventures ahead.
I love you — today, tomorrow, and always.

— ${you}
`;

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
  }, []);

  const [active, setActive] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <Head>
        <title>Our 2nd Anniversary ✨</title>
        <meta name="description" content="Celebrating two years of us — memories, moments, and magic." />
      </Head>

      <main className="relative min-h-screen overflow-x-hidden">
        <HeartsCanvas className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
        <div className='fixed inset-0 overflow-scroll'>
          <div className='w-full h-auto relative'>
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
                      ['--confetti-duration']: `${p.duration}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <FadeIn>
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

                  <Counter date={ANNIVERSARY_DATE} />

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
            </FadeIn>
            {showLetter && (
              <FadeIn>
                <section className="grid place-items-center px-4 pb-2">
                  <div className="w-full max-w-3xl rounded-2xl border border-white/20 bg-black/35 p-5 shadow-inner">
                    <pre className="whitespace-pre-wrap font-mono leading-7 text-white/90">{typed}</pre>
                  </div>
                </section>
              </FadeIn>
            )}
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

                </div>
              </section>
            </FadeIn>
            <FadeIn>
              <section className="px-4 pt-4 pb-2">
                <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-5 relative col-span-2">
                    <h3 className="font-bold">Scan a qr ✨</h3>
                    <div className='relative w-full h-96'>
                      <Image
                        src={"/qr.png"}
                        alt={"qr"}
                        loading="lazy"
                        fill
                        className="object-contain"
                      />
                    </div>

                  </div>
                </div>
              </section>
            </FadeIn>

            <FadeIn>
              <section className="px-4 pt-4 pb-2">
                <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-5 relative col-span-2">
                    <h3 className="font-bold">Show model ✨</h3>
                    <ModelViewer />
                  </div>
                </div>
              </section>
            </FadeIn>

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
                      <Image
                        src={p.src}
                        alt={p.alt}
                        loading="lazy"
                        fill
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </section>
            </FadeIn>

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
                <div className='relative h-[84vh] w-[92vw]'>
                  <Image
                    src={active.src}
                    alt={active.alt}
                    fill
                    className="rounded-2xl border object-contain border-white/20 bg-black"
                  />
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
