import { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { winnersApi } from '../services/playerApi';
import { Reveal, SectionHeader } from './ui';

/* ------------------------------------------------------------------ */
/* Why choose us                                                       */
/* ------------------------------------------------------------------ */

const FEATURES = [
    {
        title: 'Instant Payouts',
        desc: 'Crypto withdrawals in minutes, not days. Your winnings, on your terms.',
        tone: 'text-emerald-600 bg-neon-green/12 dark:text-neon-green-l',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    },
    {
        title: 'Provably Fair',
        desc: 'Every original game result is verifiable on-chain. No black boxes.',
        tone: 'text-purple-d bg-purple/12 dark:text-purple-l',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>,
    },
    {
        title: 'Live Sports Markets',
        desc: 'Thousands of pre-match and in-play markets with real-time odds.',
        tone: 'text-cyan-700 bg-cyan/12 dark:text-cyan-l',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    },
    {
        title: '24/7 Support',
        desc: 'Real humans on live chat around the clock. Median reply under 2 minutes.',
        tone: 'text-amber-600 bg-gold/12 dark:text-gold-l',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    },
];

export function Features() {
    return (
        <section className="bg-white py-20 dark:bg-ink-2">
            <div className="shell">
                <SectionHeader
                    badge="Why NeonBet"
                    accent="Built"
                    title="for winners"
                    description="A platform engineered around speed, transparency and rewards — everything a serious player expects."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((f, i) => (
                        <Reveal key={f.title} delay={i * 80}>
                            <article className="card-hover h-full p-6">
                                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.tone}`}>{f.icon}</span>
                                <h3 className="mt-5 font-heading text-lg font-bold text-slate-950 dark:text-white">{f.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Live winners feed                                                   */
/* ------------------------------------------------------------------ */

const NAMES = ['Nova***', 'Lucky***', 'Ace***', 'Storm***', 'Ghost***', 'Blaze***', 'Viper***', 'Echo***', 'Frost***', 'Rex***'];
const WIN_GAMES = ['Rocket Crash', 'Diamond Mines', 'Vegas Blitz', 'Neon Roulette', '21 Inferno', 'Fortune Wheel', 'Limbo', 'Neon Drop'];

function randomWin(id) {
    return {
        id,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        game: WIN_GAMES[Math.floor(Math.random() * WIN_GAMES.length)],
        amount: (Math.random() * 4200 + 40).toFixed(2),
        mult: (Math.random() * 48 + 1.5).toFixed(2),
    };
}

export function LiveWinners() {
    const [wins, setWins] = useState(() => Array.from({ length: 6 }, (_, i) => randomWin(i)));
    const [live, setLive] = useState(false);

    // Poll the real winners feed; keep the simulated feed as a fallback so the
    // section never looks dead on a fresh install.
    useEffect(() => {
        let mounted = true;

        const poll = async () => {
            try {
                const data = await winnersApi.getRecent();
                if (mounted && Array.isArray(data.winners) && data.winners.length > 0) {
                    setWins(data.winners.slice(0, 6));
                    setLive(true);
                }
            } catch { /* keep simulated feed */ }
        };

        poll();
        const t = setInterval(poll, 8000);
        return () => { mounted = false; clearInterval(t); };
    }, []);

    useEffect(() => {
        if (live) return undefined;
        const t = setInterval(() => {
            setWins((prev) => [randomWin(Date.now()), ...prev].slice(0, 6));
        }, 3200);
        return () => clearInterval(t);
    }, [live]);

    return (
        <section className="py-20">
            <div className="shell">
                <SectionHeader
                    badge="Live Activity"
                    accent="Winning"
                    title="right now"
                    description="Real payouts land every few seconds. The next big multiplier could be yours."
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {wins.map((w, i) => (
                        <article key={w.id} className={`card flex items-center gap-4 p-4 ${i === 0 ? 'animate-scale-in border-neon-green/40' : ''}`}>
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neon-green/12 text-emerald-600 dark:text-neon-green-l">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{w.name} <span className="font-normal text-slate-500">won on</span> {w.game}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{w.mult}× multiplier</p>
                            </div>
                            <span className="font-display text-base font-bold tabular-nums text-emerald-600 dark:text-neon-green-l">+${Number(w.amount).toLocaleString()}</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
    { n: '01', title: 'Create your account', desc: 'Sign up in under 30 seconds with email or Google. No paperwork.' },
    { n: '02', title: 'Make a deposit', desc: 'Cards, bank transfer or crypto — funds appear instantly with a welcome bonus on top.' },
    { n: '03', title: 'Play & win', desc: 'Bet on live sports or hit the casino floor. Withdraw winnings in minutes.' },
];

export function HowItWorks() {
    const { setPage } = useApp();
    return (
        <section className="bg-white py-20 dark:bg-ink-2">
            <div className="shell">
                <SectionHeader badge="Getting Started" accent="Three steps" title="to your first win" align="center" />
                <div className="grid gap-4 md:grid-cols-3">
                    {STEPS.map((s, i) => (
                        <Reveal key={s.n} delay={i * 100}>
                            <article className="card-hover relative h-full overflow-hidden p-7">
                                <span className="font-display text-5xl font-extrabold text-purple/15 dark:text-purple/25">{s.n}</span>
                                <h3 className="mt-3 font-heading text-lg font-bold text-slate-950 dark:text-white">{s.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.desc}</p>
                                {i < STEPS.length - 1 && (
                                    <svg className="absolute right-5 top-8 hidden text-purple/30 md:block" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                                )}
                            </article>
                        </Reveal>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <button className="btn-primary px-8 py-3.5 uppercase tracking-wider" onClick={() => setPage('casino')} type="button">Get Started</button>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* VIP teaser                                                          */
/* ------------------------------------------------------------------ */

export function VIPTeaser() {
    const { setPage } = useApp();
    return (
        <section className="py-20">
            <div className="shell">
                <Reveal>
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-d via-purple to-[#3b1d8f] p-8 sm:p-12">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,.25),transparent_45%),radial-gradient(circle_at_15%_85%,rgba(255,255,255,.12),transparent_40%)]" />
                        <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
                            <div>
                                <span className="badge border border-gold-l/40 bg-black/25 text-gold-l">VIP Club</span>
                                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                                    Up to <span className="text-gradient-gold">12% rakeback</span>, four tiers of rewards
                                </h2>
                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                                    Every wager moves you up. Bronze to Diamond — unlock instant cashback, a dedicated host,
                                    exclusive drops and priority withdrawals.
                                </p>
                                <button className="btn-gold mt-7 px-7 py-3.5 uppercase tracking-wider" onClick={() => setPage('vip')} type="button">
                                    Explore VIP
                                </button>
                            </div>
                            <div className="hidden grid-cols-2 gap-3 lg:grid">
                                {[['Bronze', '3%'], ['Silver', '5%'], ['Gold', '8%'], ['Diamond', '12%']].map(([tier, rate]) => (
                                    <div key={tier} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                                        <p className="font-heading text-xs font-bold uppercase tracking-[1.5px] text-white/70">{tier}</p>
                                        <p className="mt-1 font-display text-3xl font-extrabold text-white">{rate}</p>
                                        <p className="text-[11px] uppercase tracking-wide text-white/60">rakeback</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Security + payments                                                 */
/* ------------------------------------------------------------------ */

const SECURITY = [
    { title: 'Bank-grade encryption', desc: '256-bit TLS on every request; card data never touches our servers.' },
    { title: 'Two-factor authentication', desc: 'Protect your account with TOTP-based 2FA and session controls.' },
    { title: 'Responsible gambling tools', desc: 'Deposit limits, cool-off periods and self-exclusion — always available.' },
    { title: 'Licensed & audited', desc: 'Independently audited RNG and RTP across all original games.' },
];

const PAY_METHODS = [
    { name: 'Visa / Mastercard', time: 'Instant', icon: '💳' },
    { name: 'Bitcoin', time: '~10 min', icon: '₿' },
    { name: 'Ethereum', time: '~2 min', icon: 'Ξ' },
    { name: 'USDT', time: 'Instant', icon: '₮' },
    { name: 'PayPal', time: 'Instant', icon: '🅿️' },
    { name: 'Bank Transfer', time: '1–3 days', icon: '🏦' },
];

export function TrustSection() {
    return (
        <section className="bg-white py-20 dark:bg-ink-2">
            <div className="shell grid gap-12 lg:grid-cols-2">
                <div>
                    <SectionHeader badge="Security" accent="Your funds," title="protected" />
                    <div className="grid gap-3">
                        {SECURITY.map((s) => (
                            <div key={s.title} className="card flex gap-4 p-5">
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neon-green/12 text-emerald-600 dark:text-neon-green-l">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                </span>
                                <div>
                                    <h3 className="font-heading text-sm font-bold text-slate-950 dark:text-white">{s.title}</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <SectionHeader badge="Payments" accent="Deposit" title="your way" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        {PAY_METHODS.map((m) => (
                            <div key={m.name} className="card-hover flex items-center gap-3 p-4">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-white/[.06]">{m.icon}</span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{m.name}</p>
                                    <p className="text-xs text-slate-500">Payout: {m.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                        No deposit fees. Withdrawal times measured from approval. Crypto network fees apply.
                    </p>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
    { name: 'Marcus T.', tag: 'Sports bettor · 2 years', quote: 'Fastest cashouts I have used anywhere. Crypto withdrawal hit my wallet before I finished my coffee.', stars: 5 },
    { name: 'Elena R.', tag: 'VIP Gold', quote: 'The rakeback is real money back every week, and my VIP host actually replies. Feels premium.', stars: 5 },
    { name: 'Jamal K.', tag: 'Casino player', quote: 'Provably fair originals sold me. I verify my crash rounds and the math always checks out.', stars: 4 },
];

export function Testimonials() {
    return (
        <section className="py-20">
            <div className="shell">
                <SectionHeader badge="Players" accent="Loved" title="by thousands" align="center" />
                <div className="grid gap-4 md:grid-cols-3">
                    {TESTIMONIALS.map((t, i) => (
                        <Reveal key={t.name} delay={i * 90}>
                            <figure className="card-hover flex h-full flex-col p-6">
                                <div className="flex gap-0.5 text-gold" aria-label={`${t.stars} out of 5 stars`}>
                                    {Array.from({ length: 5 }, (_, s) => (
                                        <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill={s < t.stars ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                    ))}
                                </div>
                                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">“{t.quote}”</blockquote>
                                <figcaption className="mt-5 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple/12 font-heading text-sm font-bold text-purple-d dark:text-purple-l">
                                        {t.name.charAt(0)}
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{t.name}</span>
                                        <span className="block text-xs text-slate-500">{t.tag}</span>
                                    </span>
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

export function FinalCTA() {
    const { setPage } = useApp();
    return (
        <section className="pb-20">
            <div className="shell">
                <Reveal>
                    <div className="relative overflow-hidden rounded-3xl border border-purple/25 bg-slate-100/70 p-10 text-center dark:bg-ink-3 sm:p-14">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,.18),transparent_55%)]" />
                        <h2 className="relative font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                            Ready to start <span className="text-gradient-brand">winning?</span>
                        </h2>
                        <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                            Join 250,000+ players. Claim your 200% welcome bonus and 100 free spins on your first deposit.
                        </p>
                        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
                            <button className="btn-primary px-8 py-4 text-base uppercase tracking-wider" onClick={() => setPage('casino')} type="button">Join NeonBet</button>
                            <button className="btn-outline px-8 py-4 text-base uppercase tracking-wider" onClick={() => setPage('promotions')} type="button">View Promotions</button>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
