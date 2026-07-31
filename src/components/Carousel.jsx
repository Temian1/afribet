import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

const API_BASE = import.meta.env.VITE_API_BASE || '';

// Fallback slides used when no admin banners are configured.
const FALLBACK = [
    { title: 'Welcome Bonus', highlight: '200% up to $1,000', desc: 'Double your first deposit plus 100 free spins.', cta_label: 'Claim Now', link: 'promotions', grad: 'from-purple-d via-purple to-gold', emoji: '🎁' },
    { title: 'Rocket Crash', highlight: 'Fly to 100×', desc: 'Cash out before the crash and multiply your bet.', cta_label: 'Play Crash', link: 'game:crash', grad: 'from-neon-red via-orange-500 to-gold', emoji: '🚀' },
    { title: 'VIP Club', highlight: 'Up to 12% Rakeback', desc: 'Climb four tiers of escalating rewards.', cta_label: 'Join VIP', link: 'vip', grad: 'from-cyan via-purple to-purple-d', emoji: '💎' },
    { title: 'Free Spins Friday', highlight: '50 Spins Weekly', desc: 'Log in every Friday to claim — no wagering.', cta_label: 'Get Spins', link: 'promotions', grad: 'from-neon-green via-cyan to-purple', emoji: '🎰' },
];

export default function Carousel() {
    const { setPage, setCurrentGame } = useApp();
    const [slides, setSlides] = useState(FALLBACK);
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const timer = useRef(null);
    const n = slides.length;

    // Load admin-managed banners; fall back silently if unavailable.
    useEffect(() => {
        let mounted = true;
        fetch(`${API_BASE}/api/banners`)
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((data) => {
                const items = data.banners || data.data || [];
                if (mounted && Array.isArray(items) && items.length) setSlides(items);
            })
            .catch(() => { /* keep fallback */ });
        return () => { mounted = false; };
    }, []);

    const goTo = useCallback((i) => setIdx((i + n) % n), [n]);

    useEffect(() => {
        setIdx(0);
    }, [n]);

    useEffect(() => {
        if (paused || n <= 1) return undefined;
        timer.current = setInterval(() => setIdx((i) => (i + 1) % n), 4500);
        return () => clearInterval(timer.current);
    }, [paused, n]);

    const open = (link) => {
        if (!link) return;
        if (link.startsWith('http')) { window.open(link, '_blank', 'noopener,noreferrer'); return; }
        if (link.startsWith('game:')) { setCurrentGame(link.split(':')[1]); setPage('game'); return; }
        setPage(link);
    };

    return (
        <div className="px-4 pt-4 sm:px-6">
            <div
                className="relative mx-auto max-w-[1400px] overflow-hidden rounded-2xl"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${idx * 100}%)` }}>
                    {slides.map((s, i) => (
                        <div key={s.id ?? i} className="w-full shrink-0">
                            <div
                                className={`relative flex min-h-[128px] items-center overflow-hidden bg-gradient-to-br ${s.grad || 'from-purple-d via-purple to-gold'} p-5 sm:min-h-[170px] sm:p-8`}
                                style={s.image_url || s.image ? { backgroundImage: `url(${s.image_url || s.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                            >
                                <div className={`pointer-events-none absolute inset-0 ${s.image_url || s.image ? 'bg-gradient-to-r from-black/70 via-black/30 to-transparent' : 'bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.18),transparent_45%)]'}`} />
                                <div className="relative z-10 max-w-[75%]">
                                    {s.title && <span className="inline-flex rounded-full bg-black/25 px-2.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-[2px] text-white/90 sm:text-[11px]">{s.title}</span>}
                                    <h3 className="mt-2 font-display text-xl font-black leading-tight text-white drop-shadow sm:text-3xl">{s.highlight}</h3>
                                    {s.desc && <p className="mt-1 hidden max-w-md text-sm text-white/85 sm:block">{s.desc}</p>}
                                    {s.cta_label && <button onClick={() => open(s.link)} className="mt-3 rounded-lg bg-white px-4 py-2 font-heading text-xs font-black uppercase tracking-wider text-slate-900 transition hover:scale-105 active:scale-95 sm:text-sm" type="button">{s.cta_label}</button>}
                                </div>
                                {s.emoji && !(s.image_url || s.image) && <div className="animate-floaty relative z-10 ml-auto hidden text-6xl sm:block lg:text-7xl">{s.emoji}</div>}
                            </div>
                        </div>
                    ))}
                </div>

                {n > 1 && (
                    <>
                        <button onClick={() => goTo(idx - 1)} aria-label="Previous slide" type="button" className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button onClick={() => goTo(idx + 1)} aria-label="Next slide" type="button" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                        <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-2">
                            {slides.map((s, i) => (
                                <button key={s.id ?? i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} type="button" className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
