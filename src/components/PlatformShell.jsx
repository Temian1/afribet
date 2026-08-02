import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import AuthModal from './AuthModal';
import BetSlip from './BetSlip';
import AppSidebar from './AppSidebar';
import SearchModal from './SearchModal';
import RewardWheel from './RewardWheel';
import ThemeToggle from './ThemeToggle';
import { SportIcon, UiIcon } from './SportIcons';

/* Primary nav shown in the header on both breakpoints. `short` is the mobile
   label; `badge` renders the NEW pill. */
const NAV_LINKS = [
    { target: 'home', label: 'Home', short: 'Home', icon: 'home' },
    { target: 'sports', label: 'Sports', short: 'Sports', icon: 'ball' },
    { target: 'game', label: 'Aviator', short: 'Aviator', icon: 'rocket' },
    { target: 'casino', label: 'Games', short: 'Games', icon: 'grid' },
    { target: 'event', label: 'Virtual Sport', short: 'Virtual', icon: 'clock', badge: 'NEW' },
    { target: 'promotions', label: 'Promotions', short: 'Promo', icon: 'gift' },
];

export function PlatformIcon({ name, className = 'size-5', strokeWidth = 1.9 }) {
    if (name === 'ball') return <SportIcon type="football" className={className} strokeWidth={strokeWidth} />;
    return <UiIcon name={name} className={className} strokeWidth={strokeWidth} />;
}

function Brand({ compact = false, onClick }) {
    return (
        <button className="group inline-flex shrink-0 items-baseline border-0 bg-transparent" onClick={onClick} type="button" aria-label="Afribet home">
            <span className={`font-display font-black italic leading-none tracking-[-1px] text-[var(--pf-text)] ${compact ? 'text-[22px]' : 'text-[28px]'}`}>afri</span>
            <span className={`font-display font-black italic leading-none tracking-[-1px] text-[var(--pf-accent)] ${compact ? 'text-[22px]' : 'text-[28px]'}`}>bet</span>
        </button>
    );
}

/* Balance chip — mirrors the reference's "0.00 ETB / ID: —". */
function BalanceChip({ balance, user, compact = false }) {
    return (
        <div className={`shrink-0 text-right leading-tight ${compact ? '' : 'mr-1'}`}>
            <b className={`block font-bold tabular-nums text-[var(--pf-accent)] ${compact ? 'text-[13px]' : 'text-[15px]'}`}>
                {Number(balance ?? 0).toFixed(2)} <span className="text-[10px] font-bold text-[var(--pf-muted)]">ETB</span>
            </b>
            <span className={`block text-[var(--pf-muted)] ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
                ID: {user?.accountId ? String(user.accountId).slice(0, 10) : '—'}
            </span>
        </div>
    );
}

function LanguagePicker() {
    return (
        <button className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border-0 bg-transparent px-2 text-[13px] font-bold text-[var(--pf-text)] transition hover:text-[var(--pf-accent)]" type="button" aria-label="Language">
            <UiIcon name="globe" className="size-[18px]" />EN
            <UiIcon name="chevronDown" className="size-3" />
        </button>
    );
}

/* Shared nav row: text labels on desktop, icon + label on mobile. */
function NavRow({ page, go, variant }) {
    const desktop = variant === 'desktop';
    return (
        <nav
            className={`no-scrollbar flex overflow-x-auto ${desktop ? 'h-[46px] items-stretch justify-center gap-1' : 'h-[56px] items-stretch'}`}
            aria-label="Primary navigation"
        >
            {NAV_LINKS.map((link) => {
                const active = page === link.target;
                return (
                    <button
                        className={`group relative flex shrink-0 border-0 bg-transparent transition ${desktop
                            ? 'items-center gap-2 px-4 text-[14px] font-bold uppercase tracking-wide'
                            : 'min-w-[68px] flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-bold uppercase'} ${active ? 'text-[var(--pf-accent)]' : 'text-[var(--pf-text)] hover:text-[var(--pf-accent)]'}`}
                        onClick={() => go(link.target)}
                        type="button"
                        key={link.label}
                    >
                        {desktop ? null : <PlatformIcon name={link.icon} className="size-[21px] transition-transform group-active:scale-75" />}
                        <span className="truncate">{desktop ? link.label : link.short}</span>
                        {link.badge ? (
                            <i className={`absolute rounded-[4px] bg-[var(--pf-accent)] px-1 text-[8px] font-black not-italic leading-[13px] text-[var(--pf-accent-ink)] ${desktop ? '-top-1 right-1' : 'right-1 top-0.5'}`}>
                                {link.badge}
                            </i>
                        ) : null}
                        {active ? <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[var(--pf-accent)]" /> : null}
                    </button>
                );
            })}
        </nav>
    );
}

/* The primary nav rides in the header rather than a fixed bottom bar. The
   category shortcuts it replaced stay reachable from the quick-access sheet. */
function MobileHeader({ page, go, user, balance, openAuth, openSearch, openMenu, betCount, openBetSlip }) {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--pf-border)] bg-[var(--pf-surface)]/95 backdrop-blur-xl xl:hidden">
            <div className="flex h-[56px] items-center gap-2 px-3">
                <button className="grid size-9 shrink-0 place-items-center border-0 bg-transparent text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90" onClick={openMenu} type="button" aria-label="Open menu">
                    <UiIcon name="menu" className="size-6" />
                </button>
                <Brand compact onClick={() => go('home')} />
                <button className="grid size-9 shrink-0 place-items-center border-0 bg-transparent text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90" onClick={openSearch} type="button" aria-label="Search">
                    <UiIcon name="search" className="size-[21px]" />
                </button>
                <div className="ml-auto flex min-w-0 items-center gap-2">
                    <button className="relative grid size-9 shrink-0 place-items-center border-0 bg-transparent text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90" onClick={openBetSlip} type="button" aria-label={`Bet slip${betCount ? `, ${betCount} selections` : ''}`}>
                        <UiIcon name="slip" className="size-[21px]" />
                        {betCount > 0 ? <i className="absolute right-0 top-0 h-4 min-w-4 rounded-full bg-[var(--pf-danger)] px-1 text-[10px] not-italic leading-4 text-white">{betCount}</i> : null}
                    </button>
                    <BalanceChip balance={balance} user={user} compact />
                    {user ? (
                        <button className="h-9 shrink-0 rounded-[8px] border-0 bg-[var(--pf-accent)] px-3 text-[12px] font-black uppercase text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95" onClick={() => go('profile')} type="button">Account</button>
                    ) : (
                        <button className="h-9 shrink-0 rounded-[8px] border-0 bg-[var(--pf-accent)] px-4 text-[12px] font-black uppercase text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95" onClick={() => openAuth('login')} type="button">Login</button>
                    )}
                </div>
            </div>
            <NavRow page={page} go={go} variant="mobile" />
        </header>
    );
}

function DesktopChrome({ page, go, user, balance, openAuth, openSearch, openMenu, betCount, openBetSlip }) {
    return (
        <header className="fixed inset-x-0 top-0 z-40 hidden flex-col border-b border-[var(--pf-border)] bg-[var(--pf-surface)]/95 backdrop-blur-xl xl:flex">
            <div className="flex h-[68px] items-center gap-4 px-6">
                <button className="grid size-10 shrink-0 place-items-center rounded-[10px] border-0 bg-transparent text-[var(--pf-text)] transition hover:text-[var(--pf-accent)]" onClick={openMenu} type="button" aria-label="Open menu">
                    <UiIcon name="menu" className="size-6" />
                </button>
                <Brand onClick={() => go('home')} />

                <button
                    className="ml-2 flex h-[42px] w-full max-w-[420px] items-center gap-2 rounded-[10px] border border-[var(--pf-border)] bg-[var(--pf-input)] px-4 text-left text-[14px] text-[var(--pf-faint)] transition hover:border-[var(--pf-accent)]/40"
                    onClick={openSearch}
                    type="button"
                >
                    <span className="flex-1 truncate">Search Games</span>
                    <UiIcon name="search" className="size-[18px]" />
                </button>

                <div className="ml-auto flex shrink-0 items-center gap-3">
                    <button className="relative grid size-9 shrink-0 place-items-center border-0 bg-transparent text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90" onClick={openBetSlip} type="button" aria-label={`Bet slip${betCount ? `, ${betCount} selections` : ''}`}>
                        <UiIcon name="slip" className="size-[21px]" />
                        {betCount > 0 ? <i className="absolute right-0 top-0 h-4 min-w-4 rounded-full bg-[var(--pf-danger)] px-1 text-[10px] not-italic leading-4 text-white">{betCount}</i> : null}
                    </button>
                    <BalanceChip balance={balance} user={user} />
                    <RewardWheel />
                    {user ? (
                        <button className="h-[42px] rounded-[8px] border-0 bg-[var(--pf-accent)] px-6 text-[13px] font-black uppercase tracking-wide text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95" onClick={() => go('profile')} type="button">
                            Account
                        </button>
                    ) : (
                        <>
                            <button className="h-[42px] rounded-[8px] border-0 bg-[var(--pf-accent)] px-7 text-[13px] font-black uppercase tracking-wide text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95" onClick={() => openAuth('login')} type="button">
                                Login
                            </button>
                            <button className="h-[42px] rounded-[8px] border border-[var(--pf-border)] bg-transparent px-6 text-[13px] font-black uppercase tracking-wide text-[var(--pf-text)] transition hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)] active:scale-95" onClick={() => openAuth('register')} type="button">
                                Register
                            </button>
                        </>
                    )}
                    <LanguagePicker />
                    <ThemeToggle />
                </div>
            </div>

            <div className="border-t border-[var(--pf-border)]">
                <NavRow page={page} go={go} variant="desktop" />
            </div>
        </header>
    );
}

export default function PlatformShell({ children }) {
    const { page, setPage, setCurrentEvent, setCurrentGame, balance } = useApp();
    const { user } = useAuth();
    const { items: betItems, setOpen: setBetSlipOpen } = useBetSlip();
    const [auth, setAuth] = useState({ open: false, mode: 'login' });
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const go = (target, payload) => {
        setMenuOpen(false);
        if (target === 'event') setCurrentEvent(payload ?? 'top-1');
        if (target === 'game' && payload) setCurrentGame(payload);
        setPage(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const openAuth = (mode) => setAuth({ open: true, mode });
    const openGame = (id) => go('game', id);

    return (
        <div className="platform-shell min-h-screen overflow-x-hidden bg-[var(--pf-bg)] text-slate-100">
            <MobileHeader page={page} go={go} user={user} balance={balance} openAuth={openAuth} openSearch={() => setSearchOpen(true)} openMenu={() => setMenuOpen(true)} betCount={betItems.length} openBetSlip={() => betItems.length ? setBetSlipOpen(true) : go('sports')} />
            <AppSidebar open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={go} onOpenAuth={openAuth} />
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={go} onOpenGame={openGame} />
            <DesktopChrome page={page} go={go} user={user} balance={balance} openAuth={openAuth} openSearch={() => setSearchOpen(true)} openMenu={() => setMenuOpen(true)} betCount={betItems.length} openBetSlip={() => betItems.length ? setBetSlipOpen(true) : go('sports')} />
            <div className="platform-content relative min-h-screen pt-[112px] xl:pt-[115px]">
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <div className="absolute -right-32 top-20 size-[420px] rounded-full bg-[var(--pf-accent)]/[.035] blur-[100px]" />
                    <div className="absolute -left-32 bottom-10 size-[360px] rounded-full bg-blue-500/[.035] blur-[100px]" />
                </div>
                <div className="platform-page-enter relative z-[1]" key={page}>{children}</div>
            </div>
            <BetSlip onLogin={() => openAuth('login')} />
            <AuthModal open={auth.open} initialMode={auth.mode} onClose={() => setAuth((current) => ({ ...current, open: false }))} />
        </div>
    );
}
