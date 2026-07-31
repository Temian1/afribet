import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import AuthModal from './AuthModal';
import BetSlip from './BetSlip';
import AppSidebar from './AppSidebar';
import SearchModal from './SearchModal';
import RewardWheel from './RewardWheel';
import { SportIcon, UiIcon } from './SportIcons';

const NAV_ITEMS = [
    ['home', 'Home', 'home'],
    ['sports', 'Sports', 'ball'],
    ['event', 'Featured event', 'calendar'],
    ['mybets', 'My bets', 'slip'],
    ['casino', 'Live Casino', 'casino'],
    ['game', 'Crash Games', 'rocket'],
    ['wallet', 'Wallet', 'wallet'],
    ['promotions', 'Promotions', 'gift'],
    ['vip', 'VIP club', 'crown'],
    ['referral', 'Refer a friend', 'users'],
    ['support', 'Support', 'headset'],
    ['legal', 'Legal', 'results'],
];

const BOTTOM_ITEMS = [
    ['home', 'Home', 'home'],
    ['game', 'Crash', 'rocket'],
    ['mybets', 'Bet slip', 'slip'],
    ['sports', 'Sports', 'ball'],
    ['casino', 'Live', 'signal'],
    ['menu', 'Menu', 'menu'],
];

export function PlatformIcon({ name, className = 'size-5', strokeWidth = 1.9 }) {
    if (name === 'ball') return <SportIcon type="football" className={className} strokeWidth={strokeWidth} />;
    return <UiIcon name={name} className={className} strokeWidth={strokeWidth} />;
}

function Brand({ compact = false }) {
    return (
        <button className="group inline-flex shrink-0 items-center border-0 bg-transparent text-[#39f5ad]" type="button" aria-label="Afribet home">
            <svg className={`${compact ? 'size-[18px]' : 'size-7'} transition-transform duration-500 group-hover:rotate-180`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
                <path d="M16 3 20 10l8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1Z" fill="currentColor" fillOpacity=".9" />
                <circle cx="16" cy="16" r="4" fill="#071226" />
            </svg>
            <span className={`relative font-semibold leading-none tracking-[-1px] ${compact ? 'text-[19px]' : 'text-[30px]'}`}>
                AFRIBET
                <small className={`absolute right-0 font-extrabold tracking-normal ${compact ? 'top-[16px] text-[6px]' : 'top-[27px] text-[10px]'}`}>BET</small>
            </span>
        </button>
    );
}

function MobileHeader({ page, go, user, openAuth, openMenu, openSearch }) {
    const showCategoryRail = page !== 'sports';

    return (
        <header className="fixed inset-x-0 top-0 z-50 xl:hidden">
            <div className="flex h-[61px] items-center bg-[#071226]/95 px-2.5 backdrop-blur-xl">
                <button className="mr-1 grid size-10 shrink-0 place-items-center rounded-[17px] border border-white/5 bg-[#111d34] text-white transition hover:border-[#39f5ad]/40 hover:text-[#39f5ad] active:scale-90" onClick={openMenu} type="button" aria-label="Open menu"><UiIcon name="menu" className="size-5" /></button>
                <Brand compact />
                <button className="ml-1 grid size-10 shrink-0 place-items-center rounded-[17px] border border-white/5 bg-[#111d34] text-white transition hover:border-[#39f5ad]/40 hover:text-[#39f5ad] active:scale-90" onClick={openSearch} type="button" aria-label="Search"><UiIcon name="search" className="size-5" /></button>
                <div className="ml-auto flex min-w-0 items-center gap-1">
                    <RewardWheel compact />
                    {user ? (
                        <button className="h-[37px] rounded-[16px] border-0 bg-[#39f5ad] px-2.5 text-[12px] font-bold text-[#03150e] transition hover:brightness-110 active:scale-95" onClick={() => go('profile')} type="button">Account</button>
                    ) : (
                        <>
                            <button className="h-[37px] whitespace-nowrap rounded-[16px] border-0 bg-white px-2 text-[12px] font-bold text-[#0e1116] transition active:scale-95" onClick={() => openAuth('login')} type="button">Sign in</button>
                            <button className="h-[37px] whitespace-nowrap rounded-[16px] border-0 bg-[#39f5ad] px-2 text-[12px] font-bold text-[#03150e] transition hover:shadow-[0_0_24px_rgba(57,245,173,.25)] active:scale-95" onClick={() => openAuth('register')} type="button">Sign up</button>
                        </>
                    )}
                </div>
            </div>
            {showCategoryRail ? <div className="relative h-12 bg-[#071226]/95 pb-1 backdrop-blur-xl">
                <nav className="no-scrollbar flex h-full gap-2 overflow-x-auto px-3 pr-[64px]" aria-label="Game categories">
                    <button className={`platform-category ${page === 'sports' ? 'ring-2 ring-white/60' : ''} bg-[#18aa58]`} onClick={() => go('sports')} type="button"><SportIcon type="football" className="size-4" />Sports</button>
                    <button className={`platform-category ${page === 'casino' ? 'ring-2 ring-white/60' : ''} bg-[#b85118]`} onClick={() => go('casino')} type="button"><UiIcon name="slots" className="size-4" />Slots</button>
                    <button className="platform-category min-w-[129px] bg-gradient-to-r from-[#8d2700] to-[#3e150e]" onClick={() => go('casino')} type="button"><UiIcon name="casino" className="size-4" />Live Casino</button>
                    <button className="platform-category min-w-[110px] bg-gradient-to-r from-[#123b7a] to-[#0b1f45]" onClick={() => go('promotions')} type="button"><UiIcon name="gift" className="size-4" />Bonuses</button>
                </nav>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-start bg-gradient-to-l from-[#071226] via-[#071226] to-transparent pl-5 pr-2">
                    <button className="pointer-events-auto grid size-11 min-w-11 place-items-center rounded-[18px] border-0 bg-[#39f5ad] text-[#02140d] shadow-[0_0_26px_rgba(57,245,173,.22)] transition hover:rotate-90 active:scale-90" onClick={openMenu} type="button" aria-label="Open quick access menu"><UiIcon name="grid" className="size-6" /></button>
                </div>
            </div> : null}
        </header>
    );
}

function DesktopChrome({ page, go, user, openAuth, openSearch, openMenu }) {
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-[264px] flex-col border-r border-white/[.04] bg-[#071327] xl:flex">
                <div className="flex h-[74px] shrink-0 items-center gap-2.5 bg-[#071226] px-[9px]">
                    <button className="grid size-[45px] place-items-center rounded-[20px] border border-white/5 bg-[#111d34] text-white transition hover:text-[#39f5ad]" onClick={openMenu} type="button" aria-label="Open menu"><UiIcon name="menu" className="size-6" /></button>
                    <Brand />
                </div>
                <div className="flex h-[70px] shrink-0 items-start gap-[7px] px-2 pt-[9px]">
                    <button className="platform-desktop-mode" onClick={() => go('sports')} type="button"><span className="bg-[#e6edf3] text-[#102445]"><SportIcon type="football" className="size-6" /></span>Sports</button>
                    <button className="platform-desktop-mode" onClick={() => go('casino')} type="button"><span className="bg-[#242b34] text-white"><UiIcon name="casino" className="size-6" /></span>Casino</button>
                </div>
                <nav className="no-scrollbar mx-2 mt-[7px] min-h-0 flex-1 overflow-y-auto rounded-[9px] bg-[#192338] p-[9px]" aria-label="Desktop navigation">
                    {NAV_ITEMS.map(([target, label, icon]) => {
                        const active = page === target;
                        return (
                            <button className={`group flex h-[46px] w-full items-center gap-[15px] rounded-lg border-0 px-[15px] text-left text-[14px] font-semibold transition-all duration-200 ${active ? 'bg-[#071327] text-[#39f5ad] shadow-[inset_3px_0_0_#39f5ad]' : 'bg-transparent text-[#78a4ff] hover:translate-x-1 hover:bg-[#101c32] hover:text-white'}`} onClick={() => go(target)} type="button" key={label}>
                                <PlatformIcon className="size-[22px] shrink-0 transition-transform group-hover:scale-110" name={icon} /><span className="truncate">{label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="mx-3 mb-3 mt-2 shrink-0 rounded-xl border border-[#39f5ad]/15 bg-[#0c1b31] p-3">
                    <div className="flex items-center gap-2 text-[#39f5ad]"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#39f5ad] opacity-60" /><span className="relative size-2 rounded-full bg-[#39f5ad]" /></span><b className="text-xs uppercase tracking-wider">Systems online</b></div>
                    <p className="mt-1 text-[10px] text-[#7ea9ec]">Secure betting • Instant payouts</p>
                </div>
            </aside>
            <header className="fixed inset-x-0 top-0 z-40 ml-[264px] hidden h-[74px] items-center justify-between border-b border-white/[.03] bg-[#071226]/95 px-[23px] backdrop-blur-xl xl:flex">
                <button className="flex h-[45px] min-w-[240px] items-center gap-2.5 rounded-[20px] border border-white/5 bg-[#111d34] px-4 text-left text-[14px] text-[#7ea9ec] transition hover:border-[#39f5ad]/40 hover:text-white" onClick={openSearch} type="button">
                    <UiIcon name="search" className="size-[19px]" />Search teams, games, pages…
                </button>
                <div className="flex items-center gap-[9px]">
                    <RewardWheel />
                    {user ? (
                        <button className="platform-aqua-button" onClick={() => go('profile')} type="button">My account</button>
                    ) : (
                        <>
                            <button className="h-[45px] rounded-[18px] border-0 bg-white px-[17px] font-bold text-[#0f1115] transition active:scale-95" onClick={() => openAuth('login')} type="button">Sign in</button>
                            <button className="platform-aqua-button" onClick={() => openAuth('register')} type="button">Sign up</button>
                        </>
                    )}
                    <button className="h-[45px] rounded-[20px] border border-[#52637d] bg-[#122037] px-3 text-sm font-bold text-white" type="button" aria-label="Language">GB</button>
                    <button className="grid size-[45px] place-items-center rounded-[20px] border border-[#52637d] bg-[#122037] text-[#39f5ad] transition hover:rotate-90" onClick={() => go('profile')} type="button" aria-label="Settings"><UiIcon name="settings" className="size-5" /></button>
                </div>
            </header>
        </>
    );
}

function BottomNav({ page, go, betCount, openBetSlip, openMenu, menuOpen }) {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 grid h-[63px] grid-cols-6 border-t-2 border-[#263751] bg-[#071226]/95 backdrop-blur-xl xl:hidden" aria-label="Bottom navigation">
            {BOTTOM_ITEMS.map(([target, label, icon]) => {
                const active = target === 'menu' ? menuOpen : page === target;
                const onClick = () => {
                    if (target === 'menu') return openMenu();
                    if (label === 'Bet slip') return openBetSlip();
                    return go(target);
                };
                return (
                    <button className={`group relative flex flex-col items-center justify-center gap-0.5 border-0 bg-transparent text-[10px] font-bold transition ${active ? 'text-[#39f5ad]' : 'text-white'}`} onClick={onClick} type="button" key={label}>
                        {active ? <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-[#39f5ad] shadow-[0_0_10px_#39f5ad]" /> : null}
                        <PlatformIcon name={icon} className={`size-[22px] transition-transform group-active:scale-75 ${active ? '-translate-y-0.5' : ''}`} />
                        {label}
                        {label === 'Bet slip' && betCount > 0 ? <i className="absolute left-1/2 top-1 h-4 min-w-4 rounded-full bg-[#f03e52] px-1 text-[10px] not-italic text-white">{betCount}</i> : null}
                    </button>
                );
            })}
        </nav>
    );
}

export default function PlatformShell({ children }) {
    const { page, setPage, setCurrentEvent, setCurrentGame } = useApp();
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
        <div className="platform-shell min-h-screen overflow-x-hidden bg-[#030810] text-slate-100">
            <MobileHeader page={page} go={go} user={user} openAuth={openAuth} openMenu={() => setMenuOpen(true)} openSearch={() => setSearchOpen(true)} />
            <AppSidebar open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={go} onOpenAuth={openAuth} />
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={go} onOpenGame={openGame} />
            <DesktopChrome page={page} go={go} user={user} openAuth={openAuth} openSearch={() => setSearchOpen(true)} openMenu={() => setMenuOpen(true)} />
            <div className={`platform-content relative min-h-screen pb-[63px] xl:ml-[264px] xl:pb-0 xl:pt-[74px] ${page === 'sports' ? 'pt-[61px]' : 'pt-[109px]'}`}>
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden xl:left-[264px]" aria-hidden="true">
                    <div className="absolute -right-32 top-20 size-[420px] rounded-full bg-[#39f5ad]/[.035] blur-[100px]" />
                    <div className="absolute -left-32 bottom-10 size-[360px] rounded-full bg-blue-500/[.035] blur-[100px]" />
                </div>
                <div className="platform-page-enter relative z-[1]" key={page}>{children}</div>
            </div>
            <BottomNav page={page} go={go} betCount={betItems.length} openBetSlip={() => betItems.length ? setBetSlipOpen(true) : go('sports')} openMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
            <BetSlip onLogin={() => openAuth('login')} />
            <AuthModal open={auth.open} initialMode={auth.mode} onClose={() => setAuth((current) => ({ ...current, open: false }))} />
        </div>
    );
}
