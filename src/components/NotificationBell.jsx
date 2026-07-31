import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import { Bell, Gift, Info, Sparkle, Trophy } from './Icons';

const TYPE_META = {
    promo: { icon: Gift, cls: 'text-gold-l bg-gold/15' },
    win: { icon: Trophy, cls: 'text-neon-green-l bg-neon-green/15' },
    system: { icon: Sparkle, cls: 'text-purple-l bg-purple/15' },
    sports: { icon: Info, cls: 'text-cyan-l bg-cyan/15' },
};

export default function NotificationBell() {
    const { items, unread, markAllRead, markRead, clearAll } = useNotifications();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        window.addEventListener('mousedown', onClick);
        return () => window.removeEventListener('mousedown', onClick);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((value) => !value)}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-purple-l/50 hover:text-purple-d dark:border-white/10 dark:bg-white/[.04] dark:text-slate-300 dark:hover:text-purple-l"
                aria-label="Notifications"
                type="button"
            >
                <Bell size={18} />
                {unread > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-1 text-[10px] font-bold text-white">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 dark:border-white/10 dark:bg-ink-2 dark:shadow-black/50">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
                        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Notifications</h3>
                        {items.length > 0 && <button onClick={markAllRead} className="text-xs text-purple-d hover:underline dark:text-purple-l" type="button">Mark all read</button>}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-10 text-slate-500">
                                <Bell size={28} />
                                <p className="text-sm">You're all caught up</p>
                            </div>
                        ) : items.map((item) => {
                            const meta = TYPE_META[item.type] || TYPE_META.system;
                            const Icon = meta.icon;
                            return (
                                <button key={item.id} onClick={() => markRead(item.id)} className="flex w-full gap-3 border-b border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 last:border-0 dark:border-white/10 dark:hover:bg-white/[.04]" type="button">
                                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.cls}`}><Icon size={17} /></span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</span>
                                        <span className="mt-0.5 block text-xs leading-snug text-slate-600 dark:text-slate-400">{item.body}</span>
                                        <span className="mt-1 block text-[10px] uppercase tracking-wide text-slate-500">{item.time}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {items.length > 0 && <button onClick={clearAll} className="w-full border-t border-slate-200 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 transition hover:text-neon-red dark:border-white/10" type="button">Clear all</button>}
                </div>
            )}
        </div>
    );
}
