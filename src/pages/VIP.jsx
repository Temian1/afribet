import { useApp } from '../contexts/AppContext';
import { Aurora, Progress, Reveal, SectionHeader } from '../components/ui';

const TIERS = [
    { name: 'Bronze', color: 'from-orange-700 to-amber-600', rakeback: '3%', wager: '$1K wagered', perks: ['Weekly cashback', 'Email support'] },
    { name: 'Silver', color: 'from-slate-400 to-slate-300', rakeback: '5%', wager: '$10K wagered', perks: ['Daily cashback', 'Priority support', 'Birthday bonus'] },
    { name: 'Gold', color: 'from-gold-l to-gold', rakeback: '8%', wager: '$50K wagered', perks: ['Instant cashback', 'Dedicated host', 'Exclusive drops', 'Higher limits'], featured: true },
    { name: 'Diamond', color: 'from-cyan-l to-purple', rakeback: '12%', wager: '$250K wagered', perks: ['Max cashback', 'Personal manager', 'Custom bonuses', 'Luxury gifts'] },
];

const BENEFITS = [
    { icon: '💸', title: 'Rakeback', desc: 'Earn a share of every wager back automatically.' },
    { icon: '🎁', title: 'Reload Bonuses', desc: 'Exclusive deposit boosts every week.' },
    { icon: '🤝', title: 'VIP Host', desc: 'A dedicated manager for higher tiers.' },
    { icon: '⚡', title: 'Faster Payouts', desc: 'Priority withdrawal processing.' },
];

export default function VIP() {
    const { setPage } = useApp();
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-ink">
            <section className="relative overflow-hidden py-14">
                <Aurora />
                <div className="shell relative text-center">
                    <span className="section-badge">VIP Club</span>
                    <h1 className="animate-fade-up mt-5 font-display text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                        <span className="text-gradient-brand">VIP Rewards</span>
                    </h1>
                    <p className="animate-fade-up mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 [animation-delay:.1s] dark:text-slate-400">
                        Level up as you play. The more you wager, the more you earn — climb four tiers of escalating rewards.
                    </p>

                    {/* Progress teaser */}
                    <div className="card animate-fade-up mx-auto mt-8 max-w-lg p-5 text-left [animation-delay:.2s]">
                        <div className="flex items-center justify-between">
                            <span className="font-heading text-xs font-bold uppercase tracking-[1.5px] text-slate-500">Your progress</span>
                            <span className="font-heading text-xs font-bold text-purple-d dark:text-purple-l">Bronze → Silver</span>
                        </div>
                        <Progress value={34} className="mt-3" />
                        <p className="mt-2 text-xs text-slate-500">Wager <strong className="text-slate-700 dark:text-slate-300">$6,600</strong> more to unlock Silver and 5% rakeback.</p>
                    </div>
                </div>
            </section>

            <section className="pb-6">
                <div className="shell">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {TIERS.map((t, i) => (
                            <Reveal key={t.name} delay={i * 80}>
                                <div className={`card-hover relative h-full p-6 ${t.featured ? 'border-gold/40 shadow-lg shadow-gold/10' : ''}`}>
                                    {t.featured && <span className="badge absolute -top-2.5 left-5 border border-gold/40 bg-gold text-[#1a1204]">Most Popular</span>}
                                    <div className={`mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br ${t.color} shadow-lg`} />
                                    <h3 className="font-display text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">{t.name}</h3>
                                    <p className="text-xs text-slate-500">{t.wager}</p>
                                    <p className="mt-3 font-display text-4xl font-extrabold text-gradient-gold">{t.rakeback}</p>
                                    <p className="font-heading text-[11px] font-bold uppercase tracking-[1.5px] text-slate-500">rakeback</p>
                                    <ul className="mt-4 grid gap-2.5">
                                        {t.perks.map((p) => (
                                            <li key={p} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <svg className="shrink-0 text-emerald-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-14">
                <div className="shell">
                    <SectionHeader badge="Benefits" accent="Every tier" title="earns more" align="center" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {BENEFITS.map((b, i) => (
                            <Reveal key={b.title} delay={i * 80}>
                                <div className="card-hover h-full p-6">
                                    <div className="text-3xl">{b.icon}</div>
                                    <h3 className="mt-3 font-heading text-base font-bold text-slate-950 dark:text-white">{b.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{b.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button onClick={() => setPage('casino')} className="btn-primary px-8 py-4 text-base uppercase tracking-wider" type="button">Start Earning</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
