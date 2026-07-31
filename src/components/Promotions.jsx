import { useEffect, useState } from 'react';
import { SectionHeader, Reveal } from './ui';

const PROMOS = [
    { badge: 'New Players', title: 'Welcome Bonus', value: '100%', sub: 'Up to $1,000', color: 'text-amber-600 dark:text-gold-l', border: 'border-gold/30', bg: 'bg-gold/10', bar: 'from-gold-l to-gold', expires: null },
    { badge: 'Every Monday', title: 'Sports Cashback', value: '10%', sub: 'On net losses', color: 'text-cyan-700 dark:text-cyan-l', border: 'border-cyan/30', bg: 'bg-cyan/10', bar: 'from-cyan-l to-cyan', expires: 'monday' },
    { badge: 'VIP Exclusive', title: 'VIP Rewards', value: '5%', sub: 'Weekly rakeback', color: 'text-purple-d dark:text-purple-l', border: 'border-purple/30', bg: 'bg-purple/10', bar: 'from-purple-l to-purple', expires: null },
    { badge: 'Every Friday', title: 'Free Spins Friday', value: '50', sub: 'Free spins weekly', color: 'text-emerald-600 dark:text-neon-green-l', border: 'border-neon-green/30', bg: 'bg-neon-green/10', bar: 'from-neon-green-l to-neon-green', expires: 'friday' },
];

/* Time remaining until the next occurrence of a weekday (1 = Monday, 5 = Friday). */
function untilWeekday(day) {
    const now = new Date();
    const target = new Date(now);
    const diff = (day + 7 - now.getDay()) % 7 || 7;
    target.setDate(now.getDate() + diff);
    target.setHours(0, 0, 0, 0);
    return target - now;
}

function Countdown({ day }) {
    const [ms, setMs] = useState(() => untilWeekday(day));

    useEffect(() => {
        const t = setInterval(() => setMs(untilWeekday(day)), 1000);
        return () => clearInterval(t);
    }, [day]);

    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');

    return (
        <span className="badge border border-[var(--pf-border)] bg-slate-100 tabular-nums text-slate-600 dark:bg-white/[.06] dark:text-slate-300">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            {pad(h)}:{pad(m)}:{pad(s)}
        </span>
    );
}

export default function Promotions() {
    return (
        <section className="bg-white py-20 dark:bg-ink-2">
            <div className="shell">
                <SectionHeader
                    badge="Exclusive Offers"
                    accent="Promotions"
                    title="& bonuses"
                    description="Boost your bankroll with welcome bonuses, weekly cashback and free spins."
                    align="center"
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {PROMOS.map((promo, i) => (
                        <Reveal key={promo.title} delay={i * 80}>
                            <article className={`card-hover relative h-full overflow-hidden border ${promo.border} p-6`}>
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${promo.bar}`} />
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`badge border ${promo.border} ${promo.bg} ${promo.color}`}>{promo.badge}</span>
                                    {promo.expires === 'monday' && <Countdown day={1} />}
                                    {promo.expires === 'friday' && <Countdown day={5} />}
                                </div>
                                <h3 className="mt-5 font-heading text-lg font-bold text-slate-800 dark:text-slate-200">{promo.title}</h3>
                                <div className={`mt-2 font-display text-5xl font-extrabold tracking-tight ${promo.color}`}>{promo.value}</div>
                                <p className={`mt-1 font-heading text-xs font-bold uppercase tracking-wide ${promo.color}`}>{promo.sub}</p>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Claim this offer from your account dashboard after signing in.</p>
                                <button className="btn-primary mt-5 w-full uppercase tracking-wider" type="button">
                                    Claim Bonus
                                </button>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
