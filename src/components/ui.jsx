import { useEffect, useRef, useState } from 'react';

/**
 * Shared UI primitives for the NeonBet design system.
 * Visual styles live in index.css (@layer components); these wrappers add
 * behavior (count-up, reveal-on-scroll, skeletons) on top of those classes.
 */

/* Animated number that counts up when it scrolls into view. */
export function CountUp({ value, prefix = '', suffix = '', duration = 1400, className = '' }) {
    const ref = useRef(null);
    const [display, setDisplay] = useState('0');

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        const target = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
        const decimals = String(target).includes('.') ? 1 : 0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf;

        const run = () => {
            if (reduced) { setDisplay(target.toLocaleString(undefined, { maximumFractionDigits: decimals })); return; }
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                setDisplay((target * eased).toLocaleString(undefined, { maximumFractionDigits: decimals }));
                if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { run(); io.disconnect(); }
        }, { threshold: 0.4 });
        io.observe(el);
        return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
    }, [value, duration]);

    return <span ref={ref} className={className}>{prefix}{display}{suffix}</span>;
}

/* Fades content up once it enters the viewport. */
export function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return undefined; }
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setShown(true); io.disconnect(); }
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'none' : 'translateY(22px)',
                transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .6s cubic-bezier(.16,1,.3,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

/* Standard section header: badge + title + optional description. */
export function SectionHeader({ badge, title, accent, description, align = 'left', children }) {
    const centered = align === 'center';
    return (
        <div className={`mb-10 flex flex-wrap items-end justify-between gap-4 ${centered ? 'flex-col items-center text-center' : ''}`}>
            <div className={centered ? 'flex flex-col items-center' : ''}>
                {badge && <span className="section-badge">{badge}</span>}
                <h2 className="section-title mt-3">
                    {accent ? <><span className="text-gradient-brand">{accent}</span> {title}</> : title}
                </h2>
                {description && (
                    <p className={`mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base ${centered ? 'mx-auto' : ''}`}>
                        {description}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
}

/* Skeleton placeholder block. */
export function Skeleton({ className = '' }) {
    return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

/* Empty-state panel with optional action. */
export function EmptyState({ icon, title, description, action }) {
    return (
        <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
            {icon && <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/10 text-purple dark:text-purple-l">{icon}</div>}
            <p className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">{title}</p>
            {description && <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
            {action}
        </div>
    );
}

/* Small stat tile: icon, value, label. */
export function StatTile({ icon, value, label, tone = 'text-purple bg-purple/12 dark:text-purple-l' }) {
    return (
        <div className="card p-4">
            {icon && <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>{icon}</span>}
            <div className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</div>
            <div className="mt-0.5 font-heading text-[11px] font-bold uppercase tracking-[1.5px] text-slate-500">{label}</div>
        </div>
    );
}

/* Progress bar with gradient fill. */
export function Progress({ value, max = 100, className = '', barClass = 'bg-gradient-to-r from-purple to-gold-l' }) {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return (
        <div className={`h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10 ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
            <div className={`h-full rounded-full transition-all duration-700 ${barClass}`} style={{ width: `${pct}%` }} />
        </div>
    );
}

/* Aurora / glow backdrop for hero-style sections. */
export function Aurora({ className = '' }) {
    return (
        <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
            <div className="animate-aurora absolute -top-1/4 left-[8%] h-[60vh] w-[42vw] rounded-full bg-purple/25 blur-[120px] dark:bg-purple/20" />
            <div className="animate-aurora absolute right-[5%] top-[15%] h-[45vh] w-[34vw] rounded-full bg-cyan/15 blur-[110px] [animation-delay:-5s] dark:bg-cyan/10" />
            <div className="animate-aurora absolute bottom-[-10%] left-[35%] h-[40vh] w-[36vw] rounded-full bg-gold/15 blur-[120px] [animation-delay:-9s] dark:bg-gold/10" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
        </div>
    );
}

/* Brand logomark + wordmark. */
export function Logo({ size = 32, withWordmark = true, wordmarkClass = 'text-xl' }) {
    return (
        <span className="inline-flex items-center gap-2.5">
            <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
                <defs>
                    <linearGradient id="nbLogoA" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#6d28d9" />
                    </linearGradient>
                    <linearGradient id="nbLogoB" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f5a623" />
                        <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                </defs>
                <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#nbLogoA)" />
                <path d="M10 22V10l4.5 6.5L19 10v12" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity=".95" />
                <circle cx="23" cy="9" r="3.2" fill="url(#nbLogoB)" />
            </svg>
            {withWordmark && (
                <span className={`font-display font-extrabold tracking-tight text-slate-950 dark:text-white ${wordmarkClass}`}>
                    Neon<span className="text-gradient-brand">Bet</span>
                </span>
            )}
        </span>
    );
}
