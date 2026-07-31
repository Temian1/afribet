import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Copy, Users, Gift, Trophy, BrandX, BrandTelegram, BrandFacebook } from '../components/Icons';

const STEPS = [
    { icon: '🔗', title: 'Share your link', desc: 'Send your unique referral link or code to friends.' },
    { icon: '🎮', title: 'They play', desc: 'Your friend signs up and starts betting.' },
    { icon: '💰', title: 'You earn', desc: 'Earn 25% of the house edge on their wagers — for life.' },
];

const TIERS = [
    { name: 'Starter', refs: '1–9', rate: '20%', color: 'from-slate-400 to-slate-300' },
    { name: 'Pro', refs: '10–49', rate: '25%', color: 'from-cyan-l to-cyan' },
    { name: 'Elite', refs: '50+', rate: '30%', color: 'from-purple-l to-gold-l' },
];

export default function Referral() {
    const { referral, referrals } = useApp();
    const toast = useToast();
    const [copied, setCopied] = useState('');
    const link = `https://neonbet.gg/r/${referral}`;
    const count = referrals?.count ?? 0;
    const earned = Number(referrals?.earned ?? 0);
    const pending = Number(referrals?.pending ?? 0);

    const copy = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(label);
            toast.success(`${label} copied!`, { title: 'Referral' });
            setTimeout(() => setCopied(''), 1500);
        } catch {
            toast.error('Could not copy. Copy it manually.');
        }
    };

    const shareMsg = encodeURIComponent(`Join me on NeonBet and get a welcome bonus! ${link}`);
    const shares = [
        { Icon: BrandX, label: 'X', href: `https://twitter.com/intent/tweet?text=${shareMsg}`, cls: 'hover:bg-black hover:text-white' },
        { Icon: BrandTelegram, label: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${shareMsg}`, cls: 'hover:bg-[#229ED9] hover:text-white' },
        { Icon: BrandFacebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, cls: 'hover:bg-[#1877F2] hover:text-white' },
    ];

    const stats = [
        { Icon: Users, v: count, l: 'Referrals', c: 'text-cyan-l bg-cyan/15' },
        { Icon: Trophy, v: `$${earned.toFixed(2)}`, l: 'Total Earned', c: 'text-neon-green-l bg-neon-green/15' },
        { Icon: Gift, v: `$${pending.toFixed(2)}`, l: 'Pending', c: 'text-gold-l bg-gold/15' },
        { Icon: Users, v: '25%', l: 'Commission', c: 'text-purple-l bg-purple/15' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-ink sm:px-6">
            <div className="mx-auto max-w-[960px]">
                {/* Hero share card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-d via-purple to-cyan p-6 sm:p-9">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.22),transparent_45%)]" />
                    <div className="relative">
                        <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[2px] text-white/90"><Users size={13} /> Affiliate Program</span>
                        <h1 className="mt-3 font-display text-3xl font-black tracking-[1px] text-white drop-shadow sm:text-5xl">Refer &amp; Earn</h1>
                        <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">Invite friends and earn up to 30% lifetime commission on everyone you refer.</p>

                        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                            <div className="flex min-w-0 flex-1 items-center rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
                                <span className="truncate text-sm font-medium text-white">{link}</span>
                            </div>
                            <button onClick={() => copy(link, 'Link')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-heading text-sm font-black uppercase tracking-wider text-slate-900 transition hover:scale-105 active:scale-95" type="button">
                                <Copy size={16} /> {copied === 'Link' ? 'Copied' : 'Copy Link'}
                            </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            <button onClick={() => copy(referral, 'Code')} className="rounded-lg border border-dashed border-white/50 bg-white/10 px-3 py-1.5 font-display text-sm font-bold text-white" type="button">
                                {referral} {copied === 'Code' ? '✓' : ''}
                            </button>
                            <span className="text-xs text-white/70">Share via</span>
                            <div className="flex gap-2">
                                {shares.map((s) => (
                                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${s.label}`}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white transition ${s.cls}`}>
                                        <s.Icon size={17} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {stats.map((s) => (
                        <div key={s.l} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[.03]">
                            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.c}`}><s.Icon size={17} /></span>
                            <div className="mt-3 font-display text-2xl font-black text-slate-900 dark:text-white">{s.v}</div>
                            <div className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">{s.l}</div>
                        </div>
                    ))}
                </div>

                {/* Tiers */}
                <h2 className="mt-10 font-display text-xl font-black tracking-wide text-slate-900 dark:text-white">Commission Tiers</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {TIERS.map((t) => (
                        <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[.03]">
                            <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${t.color}`} />
                            <h3 className="mt-3 font-display text-lg font-black">{t.name}</h3>
                            <p className="text-xs text-slate-500">{t.refs} referrals</p>
                            <p className="mt-3 font-display text-4xl font-black text-gold-l">{t.rate}</p>
                            <p className="text-xs uppercase tracking-wide text-slate-500">lifetime rate</p>
                        </div>
                    ))}
                </div>

                {/* How it works */}
                <h2 className="mt-10 font-display text-xl font-black tracking-wide text-slate-900 dark:text-white">How It Works</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {STEPS.map((s, i) => (
                        <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[.03]">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">{s.icon}</span>
                                <span className="font-display text-2xl font-black text-purple-l/40">0{i + 1}</span>
                            </div>
                            <h3 className="mt-3 font-heading text-base font-bold uppercase tracking-wide">{s.title}</h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
