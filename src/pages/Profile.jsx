import { useEffect, useMemo, useState } from 'react';
import { AVATAR_STYLES, avatarUrl, useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { Check, Moon, Shuffle, Sun, Volume, VolumeOff } from '../components/Icons';
import { UiIcon } from '../components/SportIcons';
import { SecurityCard, ResponsibleGamblingCard } from '../components/ProfileSecurity';
import { useApp } from '../contexts/AppContext';

const inputClass = 'w-full rounded-[10px] border border-[var(--pf-border)] bg-[var(--pf-input)] px-3 py-2.5 text-[14px] text-[var(--pf-text)] outline-none transition placeholder:text-[var(--pf-faint)] focus:border-[var(--pf-accent)]';

function Card({ title, subtitle, icon, children, action }) {
    return (
        <section className="animate-fade-up rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
                {icon ? <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name={icon} className="size-5" /></span> : null}
                <div className="min-w-0 flex-1">
                    <h2 className="m-0 text-[15px] font-black text-[var(--pf-text)]">{title}</h2>
                    {subtitle ? <p className="m-0 mt-0.5 text-[12px] text-[var(--pf-muted)]">{subtitle}</p> : null}
                </div>
                {action}
            </div>
            {children ? <div className="mt-4">{children}</div> : null}
        </section>
    );
}

export default function Profile() {
    const { user, updateProfile, logout } = useAuth();
    const { balance, setPage } = useApp();
    const { muted, toggleMuted } = useSound();
    const { theme, setTheme } = useTheme();
    const toast = useToast();
    const [name, setName] = useState(user?.name || '');
    const [seed, setSeed] = useState(user?.accountId || 'player');
    const [avatar, setAvatar] = useState(user?.avatar || '');

    useEffect(() => {
        setName(user?.name || '');
        setSeed(user?.accountId || 'player');
        setAvatar(user?.avatar || '');
    }, [user]);

    const avatars = useMemo(() => AVATAR_STYLES.map((style) => ({
        style,
        url: avatarUrl(seed || user?.accountId || 'player', style),
    })), [seed, user?.accountId]);

    if (!user) {
        return (
            <div className="grid min-h-[60vh] place-items-center bg-[var(--pf-bg)] px-6 text-center">
                <div className="animate-fade-up max-w-md">
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name="user" className="size-7" /></span>
                    <h1 className="mt-4 text-[20px] font-black text-[var(--pf-text)]">Your account</h1>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--pf-muted)]">Sign in to manage your profile, avatar, security and wallet.</p>
                    <button className="mt-5 h-[42px] rounded-[19px] border-0 bg-[var(--pf-accent)] px-5 text-[14px] font-bold text-[var(--pf-accent-ink)] transition active:scale-95" onClick={() => setPage('home')} type="button">
                        Back home
                    </button>
                </div>
            </div>
        );
    }

    const save = () => {
        updateProfile({ name, avatar });
        toast.success('Profile updated.', { title: 'Profile' });
    };

    const stats = [
        { icon: 'wallet', label: 'Balance', value: `₦${balance.toFixed(2)}` },
        { icon: 'user', label: 'Sign-in', value: user.provider === 'telegram' ? 'Telegram' : user.phone ? 'Phone' : 'Username' },
        { icon: 'crown', label: 'Tier', value: 'VIP Active' },
        { icon: 'users', label: 'Referral', value: 'Ready' },
    ];

    const shortcuts = [
        ['wallet', 'Wallet', 'wallet'],
        ['mybets', 'My bets', 'slip'],
        ['referral', 'Referrals', 'users'],
        ['support', 'Support', 'headset'],
    ];

    return (
        <div className="min-h-screen bg-[var(--pf-bg)] pb-12 text-[var(--pf-text)]">
            <header className="relative overflow-hidden border-b border-[var(--pf-border)] bg-gradient-to-b from-[var(--pf-header-from)] to-[var(--pf-header-to)] px-4 py-7 sm:px-6">
                <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[var(--pf-accent)]/10 blur-[80px]" aria-hidden="true" />
                <div className="relative mx-auto max-w-5xl">
                    <div className="flex items-center gap-4">
                        <img className="size-16 shrink-0 rounded-2xl bg-[var(--pf-panel)] ring-2 ring-[var(--pf-accent)]/30 sm:size-20" src={avatar || user.avatar} alt={user.name} />
                        <div className="min-w-0 flex-1">
                            <h1 className="m-0 truncate text-[22px] font-black tracking-tight sm:text-[26px]">{user.name || 'Player'}</h1>
                            <p className="m-0 truncate text-[13px] text-[var(--pf-muted)]">{user?.accountId}</p>
                        </div>
                        <button className="hidden h-[40px] shrink-0 rounded-[19px] border border-[var(--pf-danger)]/35 bg-transparent px-4 text-[13px] font-bold text-[var(--pf-danger)] transition hover:bg-[var(--pf-danger-soft)] active:scale-95 sm:block" onClick={logout} type="button">
                            Sign out
                        </button>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div className="animate-fade-up rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-3" style={{ animationDelay: `${index * 60}ms` }} key={stat.label}>
                                <span className="grid size-8 place-items-center rounded-[9px] bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name={stat.icon} className="size-4" /></span>
                                <b className="mt-2 block truncate text-[16px] font-black">{stat.value}</b>
                                <span className="block truncate text-[11px] text-[var(--pf-muted)]">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="mx-auto mt-4 grid max-w-5xl gap-3 px-4 sm:px-6 lg:grid-cols-[320px_1fr]">
                <div className="grid content-start gap-3">
                    <Card title="Shortcuts" subtitle="Jump to the rest of your account">
                        <div className="grid grid-cols-2 gap-2">
                            {shortcuts.map(([target, label, icon]) => (
                                <button
                                    className="flex h-[64px] flex-col items-center justify-center gap-1.5 rounded-[11px] border border-[var(--pf-border)] bg-[var(--pf-panel)] text-[11px] font-bold text-[var(--pf-text)] transition hover:-translate-y-0.5 hover:border-[var(--pf-accent)]/45 active:scale-95"
                                    onClick={() => setPage(target)}
                                    type="button"
                                    key={label}
                                >
                                    <UiIcon name={icon} className="size-5 text-[var(--pf-accent)]" />{label}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card
                        title="Appearance"
                        subtitle="Choose how Afribet looks"
                        icon={theme === 'dark' ? 'star' : 'star'}
                    >
                        <div className="grid grid-cols-2 gap-2 rounded-[11px] border border-[var(--pf-border)] bg-[var(--pf-panel)] p-1.5">
                            {[['dark', 'Dark', Moon], ['light', 'Light', Sun]].map(([id, label, Icon]) => (
                                <button
                                    className={`flex h-[40px] items-center justify-center gap-2 rounded-[9px] border-0 text-[13px] font-bold transition active:scale-95 ${theme === id ? 'bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]' : 'bg-transparent text-[var(--pf-muted)]'}`}
                                    onClick={() => setTheme(id)}
                                    type="button"
                                    key={id}
                                >
                                    <Icon size={16} />{label}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card
                        title="Sound"
                        subtitle={muted ? 'Game and interface sounds are muted.' : 'Game and interface sounds are on.'}
                        icon="signal"
                        action={
                            <button
                                className={`flex h-[38px] shrink-0 items-center gap-2 rounded-[10px] border-0 px-3.5 text-[12px] font-bold transition active:scale-95 ${muted ? 'bg-[var(--pf-panel)] text-[var(--pf-text)]' : 'bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]'}`}
                                onClick={toggleMuted}
                                type="button"
                            >
                                {muted ? <VolumeOff size={15} /> : <Volume size={15} />}{muted ? 'Off' : 'On'}
                            </button>
                        }
                    />
                </div>

                <div className="grid content-start gap-3">
                    <Card title="Account details" subtitle="Your player identity" icon="user">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-faint)]">Display name</span>
                                <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-faint)]">Phone / username</span>
                                <input className={`${inputClass} opacity-60`} value={user?.accountId} disabled />
                            </label>
                        </div>
                    </Card>

                    <Card
                        title="Avatar"
                        subtitle="Pick an avatar or shuffle the seed"
                        icon="grid"
                        action={
                            <div className="flex shrink-0 gap-2">
                                <input className={`${inputClass} w-[130px] py-2`} value={seed} onChange={(event) => setSeed(event.target.value)} aria-label="Avatar seed" />
                                <button className="grid size-[42px] shrink-0 place-items-center rounded-[10px] border border-[var(--pf-border)] bg-[var(--pf-panel)] text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90" onClick={() => setSeed(Math.random().toString(36).slice(2, 9))} type="button" aria-label="Shuffle avatar seed">
                                    <Shuffle size={17} />
                                </button>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                            {avatars.map((option) => {
                                const active = avatar === option.url;
                                return (
                                    <button
                                        className={`relative aspect-square rounded-[11px] border-2 p-1 transition hover:-translate-y-0.5 ${active ? 'border-[var(--pf-accent)]' : 'border-transparent hover:border-[var(--pf-border)]'}`}
                                        onClick={() => setAvatar(option.url)}
                                        type="button"
                                        title={option.style}
                                        aria-pressed={active}
                                        key={option.url}
                                    >
                                        <img className="size-full rounded-[8px] bg-[var(--pf-panel)]" src={option.url} alt={option.style} />
                                        {active ? <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]"><Check size={12} /></span> : null}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <SecurityCard />
                    <ResponsibleGamblingCard />

                    <div className="flex flex-wrap justify-end gap-2">
                        <button className="h-[44px] rounded-[12px] border border-[var(--pf-danger)]/35 bg-transparent px-5 text-[13px] font-bold text-[var(--pf-danger)] transition hover:bg-[var(--pf-danger-soft)] active:scale-95 sm:hidden" onClick={logout} type="button">
                            Sign out
                        </button>
                        <button className="h-[44px] rounded-[12px] border-0 bg-[var(--pf-accent)] px-6 text-[13px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95" onClick={save} type="button">
                            Save profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
