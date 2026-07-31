import { useEffect } from 'react';
import Portal from './Portal';
import { SportIcon, UiIcon } from './SportIcons';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from './Icons';
import { MENU_SECTIONS, QUICK_TILES } from '../data/menu';

function MenuIcon({ name, className }) {
    if (name === 'ball') return <SportIcon type="football" className={className} />;
    return <UiIcon name={name} className={className} />;
}

export default function AppSidebar({ open, onClose, onNavigate, onOpenAuth }) {
    const { page, balance } = useApp();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (event) => event.key === 'Escape' && onClose();
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    const go = (target) => {
        onClose();
        onNavigate(target);
    };

    return (
        <Portal>
            <div className="fixed inset-0 z-[95] xl:hidden" role="dialog" aria-modal="true" aria-label="Main menu">
                <button className="app-drawer-backdrop absolute inset-0 border-0 bg-black/70 backdrop-blur-sm" onClick={onClose} type="button" aria-label="Close menu" />

                <aside className="app-drawer absolute inset-y-0 left-0 flex w-[85%] max-w-[340px] flex-col border-r border-[var(--pf-border)] bg-[var(--pf-card)] text-[var(--pf-text)] shadow-2xl">
                    <header className="flex h-[62px] shrink-0 items-center gap-2 border-b border-[var(--pf-border)] px-4">
                        <span className="inline-flex items-center text-[var(--pf-accent)]">
                            <svg className="size-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
                                <path d="M16 3 20 10l8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1Z" fill="currentColor" fillOpacity=".9" />
                                <circle cx="16" cy="16" r="4" className="fill-white" />
                            </svg>
                            <span className="relative ml-0.5 text-[21px] font-semibold leading-none tracking-[-1px]">
                                AFRIBET<small className="absolute right-0 top-[15px] text-[6px] font-extrabold tracking-normal">BET</small>
                            </span>
                        </span>
                        <button className="ml-auto grid size-9 shrink-0 place-items-center rounded-full border-0 bg-[var(--pf-panel)] text-[var(--pf-text)] transition hover:bg-[var(--pf-hover)] active:scale-90" onClick={onClose} type="button" aria-label="Close menu">
                            <UiIcon name="close" className="size-5" />
                        </button>
                    </header>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
                        <div className="p-3">
                            {user ? (
                                <div className="app-drawer-item flex items-center gap-3 rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-panel)] p-3">
                                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--pf-accent)] text-[16px] font-black text-white">
                                        {(user.name || user.email || '?').slice(0, 1).toUpperCase()}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <b className="block truncate text-[14px]">{user.name || 'Player'}</b>
                                        <span className="block truncate text-[11px] text-[var(--pf-muted)]">{user.email}</span>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <span className="block text-[10px] uppercase text-[var(--pf-faint)]">Balance</span>
                                        <b className="block text-[14px] text-[var(--pf-accent)]">{Number(balance ?? 0).toFixed(2)}</b>
                                    </div>
                                </div>
                            ) : (
                                <div className="app-drawer-item grid grid-cols-2 gap-2">
                                    <button className="h-[44px] rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-card)] text-[13px] font-bold text-[var(--pf-text)] transition active:scale-95 dark:text-[#0e1116]" onClick={() => { onClose(); onOpenAuth('login'); }} type="button">Sign in</button>
                                    <button className="h-[44px] rounded-[12px] border-0 bg-[var(--pf-accent)] text-[13px] font-bold text-white transition active:scale-95" onClick={() => { onClose(); onOpenAuth('register'); }} type="button">Sign up</button>
                                </div>
                            )}
                        </div>

                        <div className="px-3">
                            <h2 className="m-0 mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--pf-faint)]">Quick access</h2>
                            <div className="grid grid-cols-4 gap-2">
                                {QUICK_TILES.map(([target, label, icon], index) => (
                                    <button
                                        className="app-drawer-tile flex h-[70px] flex-col items-center justify-center gap-1.5 rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-panel)] px-1 text-[10px] font-bold text-[var(--pf-text)] transition hover:-translate-y-0.5 hover:border-[var(--pf-accent)]/40 active:scale-95 dark:hover:border-[var(--pf-accent)]/40"
                                        style={{ animationDelay: `${60 + index * 30}ms` }}
                                        onClick={() => go(target)}
                                        type="button"
                                        key={label}
                                    >
                                        <MenuIcon name={icon} className="size-6 text-[var(--pf-accent)]" />
                                        <span className="max-w-full truncate">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {MENU_SECTIONS.map((section) => (
                            <div className="mt-4 px-3" key={section.title}>
                                <h2 className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--pf-faint)]">{section.title}</h2>
                                <div className="overflow-hidden rounded-[12px] border border-[var(--pf-border)]">
                                    {section.items.map(([target, label, icon]) => {
                                        const active = page === target;
                                        return (
                                            <button
                                                className={`flex w-full items-center gap-3 border-0 border-b border-[var(--pf-border)] px-3.5 py-3 text-left text-[14px] font-semibold transition last:border-b-0 ${active ? 'bg-[var(--pf-accent)]/10 text-[var(--pf-accent)] dark:bg-[var(--pf-accent)]/10' : 'bg-[var(--pf-card)] text-[var(--pf-text)] hover:bg-[var(--pf-panel)]'}`}
                                                onClick={() => go(target)}
                                                type="button"
                                                key={label}
                                            >
                                                <MenuIcon name={icon} className="size-5 shrink-0" />
                                                <span className="min-w-0 flex-1 truncate">{label}</span>
                                                {active ? <span className="size-1.5 shrink-0 rounded-full bg-current" /> : <UiIcon name="chevronRight" className="size-4 shrink-0 opacity-40" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 px-3">
                            <h2 className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--pf-faint)]">Appearance</h2>
                            <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-panel)] p-1.5">
                                {[['dark', 'Dark', Moon], ['light', 'Light', Sun]].map(([id, label, Icon]) => (
                                    <button
                                        className={`flex h-[40px] items-center justify-center gap-2 rounded-[9px] border-0 text-[13px] font-bold transition active:scale-95 ${theme === id ? 'bg-[var(--pf-accent)] text-white' : 'bg-transparent text-[var(--pf-muted)]'}`}
                                        onClick={() => setTheme(id)}
                                        type="button"
                                        key={id}
                                    >
                                        <Icon size={16} />{label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {user ? (
                            <div className="mt-4 px-3">
                                <button className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] border border-[var(--pf-danger)]/30 bg-[var(--pf-danger)]/10 text-[13px] font-bold text-[var(--pf-danger)] transition active:scale-95" onClick={() => { onClose(); logout(); }} type="button">
                                    <UiIcon name="close" className="size-4" />Sign out
                                </button>
                            </div>
                        ) : null}

                        <p className="mt-5 px-4 text-center text-[10px] leading-relaxed text-[var(--pf-faint)]">
                            Afribet • 18+ only. Please gamble responsibly.
                        </p>
                    </div>
                </aside>
            </div>
        </Portal>
    );
}
