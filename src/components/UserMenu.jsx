import { useEffect, useRef, useState } from 'react';
import { avatarUrl, AVATAR_STYLES, useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Check, ChevronDown, Gift, LogOut, Shuffle, Trophy, Users, User, Wallet, X } from './Icons';
import Portal from './Portal';

function AvatarPicker({ onClose }) {
    const { user, updateAvatar } = useAuth();
    const toast = useToast();
    const [seed, setSeed] = useState(user.email);
    const [selected, setSelected] = useState(user.avatar);
    const options = AVATAR_STYLES.map((style) => avatarUrl(seed, style));

    const save = () => {
        updateAvatar(selected);
        toast.success('Avatar updated!', { title: 'Profile' });
        onClose();
    };

    return (
        <Portal>
        <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-[420px] rounded-2xl border border-[var(--pf-border)] bg-white p-6 shadow-2xl dark:bg-ink-2">
                <button onClick={onClose} className="absolute right-4 top-4 text-slate-500 hover:text-slate-900 dark:hover:text-white" type="button" aria-label="Close"><X size={20} /></button>
                <h3 className="bg-gradient-to-br from-purple-l to-gold-l bg-clip-text font-display text-xl font-black tracking-wide text-transparent">Choose Avatar</h3>
                <p className="mt-1 mb-4 text-sm text-slate-600 dark:text-slate-400">Pick a style powered by DiceBear.</p>
                <div className="mb-4 flex items-center gap-2">
                    <input value={seed} onChange={(e) => setSeed(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-[var(--pf-border)] bg-slate-50 px-3 py-2 text-sm outline-none focus:border-purple-l dark:bg-white/[.04]" />
                    <button onClick={() => setSeed(Math.random().toString(36).slice(2, 9))} className="rounded-lg border border-[var(--pf-border)] p-2 text-slate-600 dark:text-slate-300" type="button"><Shuffle size={17} /></button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {options.map((url, index) => {
                        const active = selected === url;
                        return (
                            <button key={url} onClick={() => setSelected(url)} className={`relative aspect-square rounded-xl border-2 p-1 transition ${active ? 'border-purple-l shadow-lg shadow-purple/20' : 'border-transparent hover:border-[var(--pf-border)] dark:hover:border-white/20'}`} type="button">
                                <img src={url} alt={AVATAR_STYLES[index]} className="h-full w-full rounded-lg bg-slate-100 dark:bg-white/10" />
                                {active && <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple text-white"><Check size={12} /></span>}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-5 flex gap-2">
                    <button onClick={onClose} className="flex-1 rounded-lg border border-[var(--pf-border)] px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider" type="button">Cancel</button>
                    <button onClick={save} className="flex-1 rounded-lg bg-purple px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider text-white" type="button">Save Avatar</button>
                </div>
            </div>
        </div>
        </Portal>
    );
}

export default function UserMenu() {
    const { user, logout } = useAuth();
    const { setPage } = useApp();
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [picker, setPicker] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        window.addEventListener('mousedown', onClick);
        return () => window.removeEventListener('mousedown', onClick);
    }, []);

    if (!user) return null;

    const doLogout = () => {
        logout();
        setOpen(false);
        toast.info('You have been signed out.', { title: 'See you soon' });
    };

    const nav = (id) => { setPage(id); setOpen(false); };
    const items = [
        { icon: User, label: 'Profile', action: () => nav('profile') },
        { icon: Trophy, label: 'My Bets', action: () => nav('mybets') },
        { icon: Wallet, label: 'Wallet', action: () => nav('wallet') },
        { icon: Users, label: 'Refer & Earn', action: () => nav('referral') },
        { icon: User, label: 'Change avatar', action: () => { setPicker(true); setOpen(false); } },
        { icon: Gift, label: 'Rewards', action: () => nav('vip') },
    ];

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-full border border-[var(--pf-border)] bg-white py-1 pl-1 pr-3 transition hover:border-purple-l/50 dark:bg-white/[.04]" type="button">
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10" />
                <span className="hidden max-w-[110px] truncate text-sm font-semibold text-slate-900 dark:text-slate-100 sm:block">{user.name}</span>
                <ChevronDown size={15} className={`text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-white shadow-2xl shadow-slate-900/15 dark:bg-ink-2 dark:shadow-black/50">
                    <div className="flex items-center gap-3 border-b border-[var(--pf-border)] p-4">
                        <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-full bg-slate-100 dark:bg-white/10" />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                            <p className="truncate text-xs text-slate-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="p-1.5">
                        {items.map((item) => (
                            <button key={item.label} onClick={item.action} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[.05] dark:hover:text-white" type="button">
                                <item.icon size={17} /> {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-[var(--pf-border)] p-1.5">
                        <button onClick={doLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neon-red transition hover:bg-neon-red/10" type="button">
                            <LogOut size={17} /> Log out
                        </button>
                    </div>
                </div>
            )}
            {picker && <AvatarPicker onClose={() => setPicker(false)} />}
        </div>
    );
}
