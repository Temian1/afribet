import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import AuthModal from './AuthModal';
import BetSlip from './BetSlip';

const NAV_ITEMS = [
    ['home', 'Home', 'home'],
    ['sports', 'Today', 'calendar'],
    ['sports', 'Live', 'live'],
    ['mybets', 'Live Results', 'results'],
    ['casino', 'Live Casino', 'casino'],
    ['sports', 'Virtual Sports', 'virtual'],
    ['game', 'Crash Games', 'rocket'],
    ['promotions', 'Promotions', 'gift'],
];

const BOTTOM_ITEMS = [
    ['home', 'Home', 'home'],
    ['game', 'Crash', 'rocket'],
    ['mybets', 'Bet slip', 'slip'],
    ['sports', 'Sports', 'ball'],
    ['casino', 'Live', 'signal'],
    ['profile', 'Menu', 'menu'],
];

const ICON_PATHS = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 15l2 2 5-5" /></>,
    live: <><rect x="3" y="6" width="14" height="12" rx="2" /><path d="m17 10 4-2v8l-4-2z" /></>,
    results: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h6M7 16h8" /></>,
    casino: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="m12 3 1.5 6M20 8l-5 3M18 18l-5-4M6 19l4-5M4 8l6 3" /></>,
    virtual: <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="12" width="4" height="7" rx="2" /><rect x="17" y="12" width="4" height="7" rx="2" /></>,
    rocket: <><path d="M14 4c3-2 6-1 6-1s1 3-1 6l-7 7-4-4Z" /><path d="m9 15-1 5-3-3 5-1M14 7h.01" /></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M12 9v12M3 13h18M12 9H8a3 3 0 1 1 4-3Zm0 0h4a3 3 0 1 0-4-3Z" /></>,
    slip: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z" /><path d="M9 8h6M9 12h6" /></>,
    ball: <><circle cx="12" cy="12" r="9" /><path d="m8 4 4 3 4-3M4 10l4 3-2 5M20 10l-4 3 2 5M8 13h8" /></>,
    signal: <><path d="M8.5 16.5a5 5 0 0 1 0-9M5.5 19.5a9 9 0 0 1 0-15M15.5 7.5a5 5 0 0 1 0 9M18.5 4.5a9 9 0 0 1 0 15" /><circle cx="12" cy="12" r="1.5" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    slots: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h2v6H7zM11 9h2v6h-2zM15 9h2v6h-2z" /></>,
    monitor: <><rect x="3" y="5" width="18" height="13" rx="2" /><path d="M8 21h8M12 18v3M8 10h2M14 10h2M8 14h8" /></>,
    dice: <><rect x="4" y="9" width="9" height="9" rx="2" /><rect x="11" y="5" width="9" height="9" rx="2" /><path d="M8 13h.01M9 16h.01M15 9h.01M17 12h.01" /></>,
};

const QUICK_ACCESS = [
    ['sports', 'SPORTS', 'ball'],
    ['sports', 'LIVE SPORTS', 'signal'],
    ['mybets', 'LIVE RESULTS', 'monitor'],
    ['sports', 'TODAY', 'calendar'],
    ['casino', 'CASINO', 'slots'],
    ['casino', 'LIVE CASINO', 'casino'],
    ['promotions', 'PROMOTIO...', 'gift'],
    ['sports', 'VIRTUAL SP...', 'dice'],
];

export function PlatformIcon({ name, className = 'size-5', strokeWidth = 1.9 }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICON_PATHS[name]}
        </svg>
    );
}

function Brand({ compact = false }) {
    return (
        <button className="group inline-flex shrink-0 items-center border-0 bg-transparent text-[#39f5ad]" type="button" aria-label="Aquaish Bet home">
            <svg className={`${compact ? 'size-[18px]' : 'size-7'} transition-transform duration-500 group-hover:rotate-180`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
                <path d="M16 3 20 10l8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1Z" fill="currentColor" fillOpacity=".9" />
                <circle cx="16" cy="16" r="4" fill="#071226" />
            </svg>
            <span className={`relative font-semibold leading-none tracking-[-1px] ${compact ? 'text-[19px]' : 'text-[30px]'}`}>
                AQUAISH
                <small className={`absolute right-0 font-extrabold tracking-normal ${compact ? 'top-[16px] text-[6px]' : 'top-[27px] text-[10px]'}`}>BET</small>
            </span>
        </button>
    );
}

function RewardWheel({ compact = false }) {
    return (
        <button className={`group relative grid shrink-0 place-items-center rounded-full border-[#ffb400] bg-[conic-gradient(#ef3340_0_12.5%,#f8fafc_0_25%,#3b9bea_0_37.5%,#f8fafc_0_50%,#ef3340_0_62.5%,#f8fafc_0_75%,#3b9bea_0_87.5%,#f8fafc_0)] text-sm text-amber-500 shadow-[inset_0_0_0_2px_white,0_0_22px_rgba(255,180,0,.18)] transition-transform hover:rotate-45 active:scale-90 ${compact ? 'size-9 border-4' : 'size-[42px] border-[5px]'}`} type="button" aria-label="Spin rewards wheel">
            <span className={`${compact ? 'size-1.5' : 'size-2'} rounded-full bg-amber-500`} />
            <span className="absolute -inset-1 -z-10 animate-ping rounded-full border border-amber-400/30 [animation-duration:2.6s]" />
        </button>
    );
}

function MobileHeader({ page, go, user, openAuth, openMenu }) {
    const showCategoryRail = page !== 'sports';

    return (
        <header className="fixed inset-x-0 top-0 z-50 xl:hidden">
            <div className="flex h-[61px] items-center bg-[#071226]/95 px-2.5 backdrop-blur-xl">
                <Brand compact />
                <button className="ml-1 grid size-10 shrink-0 place-items-center rounded-[17px] border border-white/5 bg-[#111d34] text-white transition hover:border-[#39f5ad]/40 hover:text-[#39f5ad]" type="button" aria-label="Search"><PlatformIcon name="search" className="size-5" /></button>
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
                    <button className={`platform-category ${page === 'sports' ? 'ring-2 ring-white/60' : ''} bg-[#18aa58]`} onClick={() => go('sports')} type="button"><PlatformIcon name="ball" className="size-4" />Sports</button>
                    <button className={`platform-category ${page === 'casino' ? 'ring-2 ring-white/60' : ''} bg-[#b85118]`} onClick={() => go('casino')} type="button"><PlatformIcon name="slots" className="size-4" />Slots</button>
                    <button className="platform-category min-w-[129px] bg-gradient-to-r from-[#8d2700] to-[#3e150e]" onClick={() => go('casino')} type="button"><PlatformIcon name="casino" className="size-4" />Live Casino</button>
                </nav>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-start bg-gradient-to-l from-[#071226] via-[#071226] to-transparent pl-5 pr-2">
                    <button className="pointer-events-auto grid size-11 min-w-11 place-items-center rounded-[18px] border-0 bg-[#39f5ad] text-[#02140d] shadow-[0_0_26px_rgba(57,245,173,.22)] transition hover:rotate-90 active:scale-90" onClick={openMenu} type="button" aria-label="Open quick access menu"><PlatformIcon name="grid" className="size-6" /></button>
                </div>
            </div> : null}
        </header>
    );
}

function DownloadAppBanner() {
    return (
        <section className="platform-download-banner relative mt-10 h-[265px] overflow-hidden rounded-[5px] bg-[#b523c8] p-5" aria-label="Download app">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_44%,rgba(255,255,255,.55),transparent_18%),radial-gradient(circle_at_78%_28%,rgba(255,255,255,.2),transparent_18%),linear-gradient(135deg,#f650e5_0%,#a51cc9_48%,#5020b8_100%)]" />
            <div className="absolute -left-10 top-6 h-[330px] w-[96px] rotate-[28deg] rounded-full bg-white/10 blur-[2px]" />
            <div className="absolute left-28 top-[-38px] h-[360px] w-[96px] rotate-[31deg] rounded-full bg-white/10 blur-[2px]" />
            <div className="relative z-[1] text-[43px] font-black uppercase leading-[1.03] text-white drop-shadow-[0_2px_2px_rgba(0,0,0,.1)]">
                DOWNLOAD<br />APP
            </div>
            <div className="platform-phone absolute -bottom-9 right-6 z-[1] h-[170px] w-[105px] rounded-[24px] border-[5px] border-[#d9d7ff] bg-[#0c0c12] shadow-[0_18px_40px_rgba(30,8,80,.45)]">
                <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-white/50" />
                <div className="mx-3 mt-4 rounded-lg bg-[#171822] p-2 text-[6px] text-white/80">
                    <p className="m-0 mb-1 text-[7px] font-bold text-white">Install App</p>
                    <div className="h-11 rounded bg-white/10" />
                    <div className="mt-2 h-7 rounded bg-white/15" />
                </div>
            </div>
        </section>
    );
}

function MobileQuickMenu({ open, closeMenu, go }) {
    if (!open) return null;

    const navigate = (target) => {
        closeMenu();
        go(target);
    };

    return (
        <div className="fixed inset-0 z-[90] bg-[#071018] text-white xl:hidden" role="dialog" aria-modal="true" aria-label="Quick access menu">
            <div className="platform-mobile-menu h-full overflow-y-auto pb-8">
                <header className="flex h-[75px] items-center justify-between border-b border-white/10 px-4">
                    <Brand />
                    <button className="grid size-[38px] place-items-center rounded-full border border-white/5 bg-[#122038] text-white shadow-[0_0_18px_rgba(255,255,255,.05)] transition hover:bg-[#1a2b48] active:scale-90" onClick={closeMenu} type="button" aria-label="Close quick access menu">
                        <PlatformIcon name="close" className="size-7" strokeWidth={2.4} />
                    </button>
                </header>
                <main className="px-3.5 pt-5">
                    <h2 className="m-0 text-[18px] font-extrabold text-white">Quick Access</h2>
                    <div className="mt-3 grid grid-cols-4 gap-2.5">
                        {QUICK_ACCESS.map(([target, label, icon], index) => (
                            <button
                                className="platform-quick-tile flex h-24 min-w-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-[5px] border-0 bg-[#172f5d] px-1.5 text-center text-[12px] font-black uppercase leading-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition hover:-translate-y-0.5 hover:bg-[#1e3b71] active:scale-95"
                                style={{ animationDelay: `${90 + index * 35}ms` }}
                                onClick={() => navigate(target)}
                                type="button"
                                key={label}
                            >
                                <PlatformIcon name={icon} className="size-8 text-white" strokeWidth={2.2} />
                                <span className="max-w-full truncate">{label}</span>
                            </button>
                        ))}
                    </div>
                    <DownloadAppBanner />
                </main>
            </div>
        </div>
    );
}

function DesktopChrome({ page, go, user, openAuth }) {
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-[264px] flex-col border-r border-white/[.04] bg-[#071327] xl:flex">
                <div className="flex h-[74px] shrink-0 items-center gap-2.5 bg-[#071226] px-[9px]">
                    <button className="grid size-[45px] place-items-center rounded-[20px] border border-white/5 bg-[#111d34] text-white transition hover:text-[#39f5ad]" type="button" aria-label="Open menu"><PlatformIcon name="menu" className="size-6" /></button>
                    <Brand />
                </div>
                <div className="flex h-[70px] shrink-0 items-start gap-[7px] px-2 pt-[9px]">
                    <button className="platform-desktop-mode" onClick={() => go('sports')} type="button"><span className="bg-[#e6edf3] text-[#102445]"><PlatformIcon name="ball" className="size-6" /></span>Sports</button>
                    <button className="platform-desktop-mode" onClick={() => go('casino')} type="button"><span className="bg-[#242b34] text-white"><PlatformIcon name="casino" className="size-6" /></span>Casino</button>
                </div>
                <nav className="mx-2 mt-[7px] rounded-[9px] bg-[#192338] p-[9px]" aria-label="Desktop navigation">
                    {NAV_ITEMS.map(([target, label, icon], index) => {
                        const active = page === target && NAV_ITEMS.findIndex(([itemTarget]) => itemTarget === target) === index;
                        return (
                            <button className={`group flex h-[55px] w-full items-center gap-[19px] rounded-lg border-0 px-[15px] text-left text-[15px] font-semibold transition-all duration-200 ${active ? 'bg-[#071327] text-[#39f5ad] shadow-[inset_3px_0_0_#39f5ad]' : 'bg-transparent text-[#78a4ff] hover:translate-x-1 hover:bg-[#101c32] hover:text-white'}`} onClick={() => go(target)} type="button" key={label}>
                                <PlatformIcon className="size-[27px] shrink-0 transition-transform group-hover:scale-110" name={icon} /><span>{label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="mx-3 mb-3 mt-auto rounded-xl border border-[#39f5ad]/15 bg-[#0c1b31] p-3">
                    <div className="flex items-center gap-2 text-[#39f5ad]"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#39f5ad] opacity-60" /><span className="relative size-2 rounded-full bg-[#39f5ad]" /></span><b className="text-xs uppercase tracking-wider">Systems online</b></div>
                    <p className="mt-1 text-[10px] text-[#7ea9ec]">Secure betting • Instant payouts</p>
                </div>
            </aside>
            <header className="fixed inset-x-0 top-0 z-40 ml-[264px] hidden h-[74px] items-center justify-between border-b border-white/[.03] bg-[#071226]/95 px-[23px] backdrop-blur-xl xl:flex">
                <button className="grid size-[45px] place-items-center rounded-[20px] border border-white/5 bg-[#111d34] text-white transition hover:border-[#39f5ad]/40 hover:text-[#39f5ad]" type="button" aria-label="Search"><PlatformIcon name="search" className="size-[21px]" /></button>
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
                    <button className="grid size-[45px] place-items-center rounded-[20px] border border-[#52637d] bg-[#122037] text-[#39f5ad] transition hover:rotate-90" type="button" aria-label="Settings"><PlatformIcon name="grid" className="size-5" /></button>
                </div>
            </header>
        </>
    );
}

function BottomNav({ page, go, betCount, openBetSlip }) {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 grid h-[63px] grid-cols-6 border-t-2 border-[#263751] bg-[#071226]/95 backdrop-blur-xl xl:hidden" aria-label="Bottom navigation">
            {BOTTOM_ITEMS.map(([target, label, icon]) => {
                const active = page === target;
                return (
                    <button className={`group relative flex flex-col items-center justify-center gap-0.5 border-0 bg-transparent text-[10px] font-bold transition ${active ? 'text-[#39f5ad]' : 'text-white'}`} onClick={() => label === 'Bet slip' ? openBetSlip() : go(target)} type="button" key={label}>
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
    const { page, setPage } = useApp();
    const { user } = useAuth();
    const { items: betItems, setOpen: setBetSlipOpen } = useBetSlip();
    const [auth, setAuth] = useState({ open: false, mode: 'login' });
    const [menuOpen, setMenuOpen] = useState(false);
    const go = (target) => {
        setMenuOpen(false);
        setPage(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const openAuth = (mode) => setAuth({ open: true, mode });

    return (
        <div className="platform-shell min-h-screen overflow-x-hidden bg-[#030810] text-slate-100">
            <MobileHeader page={page} go={go} user={user} openAuth={openAuth} openMenu={() => setMenuOpen(true)} />
            <MobileQuickMenu open={menuOpen} closeMenu={() => setMenuOpen(false)} go={go} />
            <DesktopChrome page={page} go={go} user={user} openAuth={openAuth} />
            <div className={`platform-content relative min-h-screen pb-[63px] xl:ml-[264px] xl:pb-0 xl:pt-[74px] ${page === 'sports' ? 'pt-[61px]' : 'pt-[109px]'}`}>
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden xl:left-[264px]" aria-hidden="true">
                    <div className="absolute -right-32 top-20 size-[420px] rounded-full bg-[#39f5ad]/[.035] blur-[100px]" />
                    <div className="absolute -left-32 bottom-10 size-[360px] rounded-full bg-blue-500/[.035] blur-[100px]" />
                </div>
                <div className="platform-page-enter relative z-[1]" key={page}>{children}</div>
            </div>
            <BottomNav page={page} go={go} betCount={betItems.length} openBetSlip={() => betItems.length ? setBetSlipOpen(true) : go('sports')} />
            <BetSlip onLogin={() => openAuth('login')} />
            <AuthModal open={auth.open} initialMode={auth.mode} onClose={() => setAuth((current) => ({ ...current, open: false }))} />
        </div>
    );
}
