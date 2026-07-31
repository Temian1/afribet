import { useEffect, useMemo, useState } from 'react';
import { AVATAR_STYLES, avatarUrl, useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import { useToast } from '../contexts/ToastContext';
import { Check, Gift, Shuffle, Users, Volume, VolumeOff, Wallet } from '../components/Icons';
import { SecurityCard, ResponsibleGamblingCard } from '../components/ProfileSecurity';
import { useApp } from '../contexts/AppContext';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const { balance, setPage } = useApp();
    const { muted, toggleMuted } = useSound();
    const toast = useToast();
    const [name, setName] = useState(user?.name || '');
    const [seed, setSeed] = useState(user?.email || 'player');
    const [avatar, setAvatar] = useState(user?.avatar || '');

    useEffect(() => {
        setName(user?.name || '');
        setSeed(user?.email || 'player');
        setAvatar(user?.avatar || '');
    }, [user]);

    const avatars = useMemo(() => AVATAR_STYLES.map((style) => ({
        style,
        url: avatarUrl(seed || user?.email || 'player', style),
    })), [seed, user?.email]);

    if (!user) {
        return (
            <section className="mx-auto max-w-[900px] px-4 py-16 sm:px-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-ink-2">
                    <h1 className="font-display text-3xl font-black tracking-wide text-slate-950 dark:text-white">Profile</h1>
                    <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">Log in or create an account to manage your profile, avatar, sound settings, wallet, and rewards.</p>
                    <button
                        onClick={() => setPage('home')}
                        className="mt-6 rounded-lg bg-purple px-5 py-3 font-heading text-sm font-bold uppercase tracking-wider text-white transition hover:bg-purple-d"
                        type="button"
                    >
                        Back home
                    </button>
                </div>
            </section>
        );
    }

    const save = () => {
        updateProfile({ name, avatar });
        toast.success('Profile updated.', { title: 'Profile' });
    };

    const stats = [
        { label: 'Balance', value: `$${balance.toFixed(2)}`, icon: Wallet },
        { label: 'Provider', value: user.provider === 'google' ? 'Google' : 'Email', icon: Check },
        { label: 'Rewards', value: 'VIP Active', icon: Gift },
        { label: 'Referral', value: 'Ready', icon: Users },
    ];

    return (
        <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:py-12">
            <div className="mb-6">
                <h1 className="font-display text-3xl font-black tracking-wide text-slate-950 dark:text-white sm:text-4xl">Profile</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Manage your player identity and account preferences.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-ink-2">
                    <div className="flex flex-col items-center text-center">
                        <img src={avatar || user.avatar} alt={user.name} className="h-28 w-28 rounded-3xl bg-slate-100 ring-4 ring-purple/15 dark:bg-white/10" />
                        <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">{user.name}</h2>
                        <p className="mt-1 max-w-full truncate text-sm text-slate-500">{user.email}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {stats.map((stat) => (
                            <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[.04]">
                                <stat.icon size={18} className="mb-2 text-purple dark:text-purple-l" />
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                                <p className="mt-1 truncate text-sm font-bold text-slate-950 dark:text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 grid gap-2">
                        <button onClick={() => setPage('wallet')} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-gold/50 hover:text-gold dark:border-white/10 dark:text-slate-300" type="button">Open Wallet</button>
                        <button onClick={() => setPage('referral')} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-purple/50 hover:text-purple dark:border-white/10 dark:text-slate-300" type="button">Referral</button>
                    </div>
                </aside>

                <div className="grid gap-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-ink-2">
                        <h3 className="font-heading text-lg font-black uppercase tracking-wide text-slate-950 dark:text-white">Account</h3>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Display name</span>
                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-950 outline-none transition focus:border-purple/50 focus:bg-white dark:border-white/10 dark:bg-white/[.04] dark:text-white"
                                />
                            </label>
                            <label className="block">
                                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
                                <input
                                    value={user.email}
                                    disabled
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[.03]"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-ink-2">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-heading text-lg font-black uppercase tracking-wide text-slate-950 dark:text-white">Avatar</h3>
                                <p className="mt-1 text-sm text-slate-500">Pick a profile avatar or shuffle the seed.</p>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={seed}
                                    onChange={(event) => setSeed(event.target.value)}
                                    className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-purple/50 dark:border-white/10 dark:bg-white/[.04]"
                                />
                                <button onClick={() => setSeed(Math.random().toString(36).slice(2, 9))} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-purple/50 hover:text-purple dark:border-white/10 dark:text-slate-300" type="button" aria-label="Shuffle avatar seed">
                                    <Shuffle size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
                            {avatars.map((option) => {
                                const active = avatar === option.url;
                                return (
                                    <button key={option.url} onClick={() => setAvatar(option.url)} className={`relative aspect-square rounded-xl border-2 p-1 transition ${active ? 'border-purple shadow-lg shadow-purple/20' : 'border-transparent hover:border-slate-300 dark:hover:border-white/20'}`} type="button" title={option.style}>
                                        <img src={option.url} alt={option.style} className="h-full w-full rounded-lg bg-slate-100 dark:bg-white/10" />
                                        {active && <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple text-white"><Check size={12} /></span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-ink-2">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan dark:text-cyan-l">
                                    {muted ? <VolumeOff size={20} /> : <Volume size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-heading text-lg font-black uppercase tracking-wide text-slate-950 dark:text-white">Sound</h3>
                                    <p className="text-sm text-slate-500">{muted ? 'Game and interface sounds are muted.' : 'Game and interface sounds are enabled.'}</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleMuted}
                                className={`rounded-lg px-5 py-3 font-heading text-sm font-bold uppercase tracking-wider transition ${muted ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-cyan text-slate-950 hover:bg-cyan-l'}`}
                                type="button"
                            >
                                {muted ? 'Turn sound on' : 'Turn sound off'}
                            </button>
                        </div>
                    </div>

                    <SecurityCard />
                    <ResponsibleGamblingCard />

                    <div className="flex justify-end">
                        <button onClick={save} className="rounded-lg bg-purple px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-purple/20 transition hover:bg-purple-d" type="button">
                            Save Profile
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
