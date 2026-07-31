import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { UiIcon } from '../components/SportIcons';
import { BrandFacebook, BrandTelegram, BrandWhatsapp, BrandX } from '../components/Icons';

const STEPS = [
    { icon: 'users', title: 'Share your link', desc: 'Send your unique referral link or code to friends.' },
    { icon: 'slip', title: 'They play', desc: 'Your friend signs up and places their first bet.' },
    { icon: 'wallet', title: 'You earn', desc: 'Take 25% of the house edge on their wagers — for life.' },
];

const TIERS = [
    { name: 'Starter', refs: '1 – 9 referrals', rate: '20%' },
    { name: 'Pro', refs: '10 – 49 referrals', rate: '25%', current: true },
    { name: 'Elite', refs: '50+ referrals', rate: '30%' },
];

export default function Referral() {
    const { referral, referrals, setPage } = useApp();
    const toast = useToast();
    const [copied, setCopied] = useState('');

    const link = `https://afribet.com/r/${referral}`;
    const count = referrals?.count ?? 0;
    const earned = Number(referrals?.earned ?? 0);
    const pending = Number(referrals?.pending ?? 0);

    const copy = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(label);
            toast.success(`${label} copied!`, { title: 'Referral' });
            setTimeout(() => setCopied(''), 1600);
        } catch {
            toast.error('Could not copy. Copy it manually.');
        }
    };

    const message = encodeURIComponent(`Join me on Afribet and get a welcome bonus! ${link}`);
    const shares = [
        { Icon: BrandX, label: 'X', href: `https://twitter.com/intent/tweet?text=${message}` },
        { Icon: BrandTelegram, label: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${message}` },
        { Icon: BrandWhatsapp, label: 'WhatsApp', href: `https://wa.me/?text=${message}` },
        { Icon: BrandFacebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}` },
    ];

    const stats = [
        { icon: 'users', value: count, label: 'Referrals' },
        { icon: 'crown', value: `₦${earned.toFixed(2)}`, label: 'Total earned' },
        { icon: 'gift', value: `₦${pending.toFixed(2)}`, label: 'Pending' },
        { icon: 'tune', value: '25%', label: 'Commission' },
    ];

    return (
        <div className="min-h-screen bg-[var(--pf-bg)] pb-12 text-[var(--pf-text)]">
            <header className="relative overflow-hidden border-b border-[var(--pf-border)] bg-gradient-to-b from-[var(--pf-header-from)] to-[var(--pf-header-to)] px-4 py-7 sm:px-6">
                <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[var(--pf-accent)]/10 blur-[80px]" aria-hidden="true" />
                <div className="relative mx-auto max-w-4xl">
                    <div className="flex items-center gap-3">
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name="users" className="size-6" /></span>
                        <div className="min-w-0">
                            <h1 className="m-0 text-[22px] font-black tracking-tight sm:text-[26px]">Refer &amp; earn</h1>
                            <p className="m-0 text-[13px] text-[var(--pf-muted)]">Earn a share of every bet your friends place.</p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div className="animate-fade-up rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-3" style={{ animationDelay: `${index * 60}ms` }} key={stat.label}>
                                <span className="grid size-8 place-items-center rounded-[9px] bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name={stat.icon} className="size-4" /></span>
                                <b className="mt-2 block truncate text-[18px] font-black">{stat.value}</b>
                                <span className="block truncate text-[11px] text-[var(--pf-muted)]">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <section className="animate-fade-up mt-4 rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-4 sm:p-5">
                    <h2 className="m-0 text-[15px] font-black">Your referral link</h2>
                    <div className="mt-3 flex gap-2">
                        <input className="min-w-0 flex-1 rounded-[10px] border border-[var(--pf-border)] bg-[var(--pf-input)] px-3 py-2.5 text-[13px] text-[var(--pf-text)] outline-none" value={link} readOnly aria-label="Referral link" />
                        <button className="flex h-[44px] shrink-0 items-center gap-2 rounded-[10px] border-0 bg-[var(--pf-accent)] px-4 text-[13px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95" onClick={() => copy(link, 'Link')} type="button">
                            <UiIcon name={copied === 'Link' ? 'starFilled' : 'slip'} className="size-4" />{copied === 'Link' ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[12px] text-[var(--pf-muted)]">Or share your code</span>
                        <button className="rounded-[9px] border border-dashed border-[var(--pf-accent)]/50 bg-[var(--pf-accent-soft)] px-3 py-1.5 font-mono text-[13px] font-bold text-[var(--pf-accent)] transition active:scale-95" onClick={() => copy(referral, 'Code')} type="button">
                            {referral}
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {shares.map(({ Icon, label, href }) => (
                            <a
                                className="flex h-[40px] items-center gap-2 rounded-[10px] border border-[var(--pf-border)] bg-[var(--pf-panel)] px-3.5 text-[12px] font-bold text-[var(--pf-text)] transition hover:-translate-y-0.5 hover:border-[var(--pf-accent)]/45 hover:text-[var(--pf-accent)]"
                                href={href}
                                target="_blank"
                                rel="noreferrer noopener"
                                key={label}
                            >
                                <Icon size={15} />{label}
                            </a>
                        ))}
                    </div>
                </section>

                <section className="mt-4">
                    <h2 className="m-0 mb-2.5 text-[15px] font-black">How it works</h2>
                    <div className="grid gap-2.5 sm:grid-cols-3">
                        {STEPS.map((step, index) => (
                            <div className="animate-fade-up rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--pf-accent)]/30" style={{ animationDelay: `${index * 70}ms` }} key={step.title}>
                                <div className="flex items-center gap-2.5">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name={step.icon} className="size-5" /></span>
                                    <span className="text-[11px] font-black text-[var(--pf-faint)]">STEP {index + 1}</span>
                                </div>
                                <b className="mt-2.5 block text-[14px]">{step.title}</b>
                                <p className="m-0 mt-1 text-[12px] leading-relaxed text-[var(--pf-muted)]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-4">
                    <h2 className="m-0 mb-2.5 text-[15px] font-black">Commission tiers</h2>
                    <div className="grid gap-2.5 sm:grid-cols-3">
                        {TIERS.map((tier, index) => (
                            <div
                                className={`animate-fade-up relative rounded-[12px] border p-4 transition hover:-translate-y-0.5 ${tier.current ? 'border-[var(--pf-accent)]/50 bg-[var(--pf-accent-soft)]' : 'border-[var(--pf-border)] bg-[var(--pf-card)]'}`}
                                style={{ animationDelay: `${index * 70}ms` }}
                                key={tier.name}
                            >
                                {tier.current ? <span className="absolute right-3 top-3 rounded-full bg-[var(--pf-accent)] px-2 py-0.5 text-[9px] font-black uppercase text-[var(--pf-accent-ink)]">Current</span> : null}
                                <b className="block text-[14px]">{tier.name}</b>
                                <span className="mt-0.5 block text-[11px] text-[var(--pf-muted)]">{tier.refs}</span>
                                <strong className={`mt-3 block text-[26px] font-black ${tier.current ? 'text-[var(--pf-accent)]' : 'text-[var(--pf-text)]'}`}>{tier.rate}</strong>
                                <span className="block text-[11px] text-[var(--pf-muted)]">of house edge</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="animate-fade-up mt-4 rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-5 text-center">
                    <p className="m-0 text-[13px] text-[var(--pf-muted)]">Track every referral payout in your wallet.</p>
                    <button className="mt-3 h-[42px] rounded-[19px] border-0 bg-[var(--pf-accent)] px-5 text-[13px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95" onClick={() => setPage('wallet')} type="button">
                        Open wallet
                    </button>
                </section>
            </div>
        </div>
    );
}
