import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import { SportIcon, TeamCrest, UiIcon } from '../components/SportIcons';
import { LEAGUES, MARKET_META, SPORTS, TOP_EVENTS, UPCOMING } from '../data/sportsData';

/** Opens the event show page for a given fixture. */
function useOpenEvent() {
    const { setCurrentEvent, setPage } = useApp();
    return (id) => {
        setCurrentEvent(id);
        setPage('event');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// Odds grid shared by the desktop header row and every event row so the columns stay aligned.
const ODDS_GRID = 'grid grid-cols-[repeat(4,minmax(180px,1fr))_74px] items-center gap-2 px-3 2xl:gap-4 2xl:px-4';
const ROW_GRID = 'grid grid-cols-[320px_minmax(900px,1fr)]';
const MOBILE_GRID = 'grid grid-cols-[minmax(0,1fr)_146px] sm:grid-cols-[minmax(0,1fr)_186px]';

function useHorizontalRail() {
    const railRef = useRef(null);
    const [scrollState, setScrollState] = useState({ canGoBack: false, canGoForward: false });

    const updateScrollState = useCallback(() => {
        const rail = railRef.current;
        if (!rail) return;
        const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
        setScrollState({
            canGoBack: rail.scrollLeft > 2,
            canGoForward: rail.scrollLeft < maxScroll - 2,
        });
    }, []);

    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return undefined;
        updateScrollState();
        rail.addEventListener('scroll', updateScrollState, { passive: true });
        const observer = new ResizeObserver(updateScrollState);
        observer.observe(rail);
        if (rail.firstElementChild) observer.observe(rail.firstElementChild);
        return () => {
            rail.removeEventListener('scroll', updateScrollState);
            observer.disconnect();
        };
    }, [updateScrollState]);

    const scrollByPage = useCallback((direction) => {
        const rail = railRef.current;
        if (!rail) return;
        rail.scrollBy({ left: direction * Math.max(360, rail.clientWidth * 0.72), behavior: 'smooth' });
    }, []);

    return { railRef, scrollByPage, ...scrollState };
}

function MarketRailControls({ canGoBack, canGoForward, onBack, onForward }) {
    return (
        <div className="hidden items-center gap-2 xl:flex" aria-label="Odds market navigation">
            <span className="mr-1 text-[11px] font-semibold text-[var(--pf-muted)]">Slide markets</span>
            <button className="grid size-9 place-items-center rounded-full border border-[var(--pf-border)] bg-[var(--pf-panel)] text-[var(--pf-text)] transition hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)] disabled:cursor-default disabled:opacity-35" disabled={!canGoBack} onClick={onBack} type="button" aria-label="Previous odds markets">
                <UiIcon name="chevronRight" className="size-4 rotate-180" />
            </button>
            <button className="grid size-9 place-items-center rounded-full border border-[var(--pf-border)] bg-[var(--pf-panel)] text-[var(--pf-text)] transition hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)] disabled:cursor-default disabled:opacity-35" disabled={!canGoForward} onClick={onForward} type="button" aria-label="Next odds markets">
                <UiIcon name="chevronRight" className="size-4" />
            </button>
        </div>
    );
}

function NavButton({ active, icon, label, onClick }) {
    return (
        <button className={`relative flex h-[53px] shrink-0 items-center gap-2 border-0 bg-transparent px-2 text-[14px] font-extrabold transition sm:text-[15px] ${active ? 'text-[var(--pf-text)]' : 'text-slate-200 hover:text-[var(--pf-accent)]'}`} onClick={onClick} type="button">
            {icon}{label}
            {active ? <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-[#39f5ad]" /> : null}
        </button>
    );
}

function SportsControls({ activeMode, setActiveMode }) {
    const [sport, setSport] = useState('football');
    const [league, setLeague] = useState('popular');
    return (
        <>
            <div className="border-b border-[var(--pf-border)] bg-[var(--pf-surface)] px-2 sm:px-3 xl:hidden">
                <div className="flex h-[53px] items-center gap-1 sm:gap-2">
                    <NavButton active={false} icon={<UiIcon name="home" className="size-[18px]" />} label="" />
                    <NavButton active={activeMode === 'live'} label="Live" onClick={() => setActiveMode('live')} />
                    <NavButton active={activeMode === 'prematch'} label="Pre-match" onClick={() => setActiveMode('prematch')} />
                    <div className="ml-auto flex shrink-0 gap-1 sm:gap-1.5">
                        <button className="sport-square" type="button" aria-label="Top competitions"><UiIcon name="crown" className="size-[18px]" /></button>
                        <button className="sport-square" type="button" aria-label="Favourites"><UiIcon name="star" className="size-[18px]" /></button>
                        <button className="sport-square text-[var(--pf-accent)]" type="button" aria-label="Recent"><UiIcon name="clock" className="size-[18px]" /></button>
                        <button className="grid size-9 shrink-0 place-items-center bg-transparent text-[var(--pf-text)]" type="button" aria-label="Search"><UiIcon name="search" /></button>
                    </div>
                </div>
            </div>

            <div className="no-scrollbar flex h-[61px] items-center overflow-x-auto border-b border-[var(--pf-border)] bg-[var(--pf-surface)] pl-2 pr-[46px] xl:mx-[15px] xl:mt-9 xl:rounded-[9px] xl:border xl:pr-2">
                <div className="mr-2 hidden shrink-0 gap-1 xl:flex">
                    <button className="sport-square" type="button" aria-label="Home"><UiIcon name="home" className="size-[18px]" /></button>
                    <button className="sport-square" type="button" aria-label="Live now"><UiIcon name="live" className="size-[18px]" /></button>
                    <button className="sport-square bg-[#39f5ad] text-[var(--pf-accent-ink)]" type="button" aria-label="Starting soon"><UiIcon name="stopwatch" className="size-[18px]" /></button>
                    <button className="sport-square" type="button" aria-label="Top competitions"><UiIcon name="crown" className="size-[18px]" /></button>
                    <button className="sport-square" type="button" aria-label="Favourites"><UiIcon name="star" className="size-[18px]" /></button>
                </div>
                {SPORTS.map(([type, count]) => (
                    <button className={`group relative grid h-full min-w-[52px] shrink-0 place-items-center border-0 bg-transparent transition sm:min-w-[54px] ${sport === type ? 'text-[var(--pf-accent)]' : 'text-[var(--pf-text)] hover:text-[var(--pf-text)]'}`} onClick={() => setSport(type)} type="button" key={type} aria-label={type} aria-pressed={sport === type}>
                        <SportIcon type={type} className="size-8 transition-transform group-hover:scale-110 sm:size-[34px]" />
                        <span className="absolute right-0.5 top-1.5 rounded-full bg-[var(--pf-panel)] px-1 text-[9px] text-[var(--pf-text)]">{count}</span>
                    </button>
                ))}
                <button className="sticky right-1 ml-auto grid size-9 min-w-9 shrink-0 place-items-center rounded-[7px] border-0 bg-[#39f5ad] text-[var(--pf-accent-ink)] shadow-[-12px_0_16px_#071226]" type="button" aria-label="More sports"><UiIcon name="chevronDown" /></button>
            </div>

            <div className="flex h-[54px] items-center gap-2 border-b border-[var(--pf-border)] bg-[var(--pf-surface)] px-2 xl:mx-5 xl:mt-[31px] xl:rounded-[9px] xl:border">
                <button className="flex h-[43px] w-[122px] shrink-0 items-center justify-between rounded-[7px] border border-[var(--pf-border)] bg-[var(--pf-card)] px-3 text-[14px] text-[var(--pf-text)] sm:w-[150px] xl:w-[180px] xl:text-[16px]" type="button">
                    All 914 <UiIcon name="chevronDown" className="size-4" />
                </button>
                <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto">
                    {LEAGUES.map(([id, label]) => (
                        <button className={`flex h-[43px] shrink-0 items-center gap-2 rounded-[7px] border-0 px-3 text-[12px] font-bold transition xl:text-[13px] ${league === id ? 'bg-[#39f5ad] text-[var(--pf-accent-ink)]' : 'bg-transparent text-white hover:bg-white/5'}`} onClick={() => setLeague(id)} type="button" key={id} aria-pressed={league === id}>
                            {id === 'popular' ? <UiIcon name="flame" className="size-[18px]" /> : <SportIcon type="football" className="size-[18px] opacity-75" />}
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

function StarButton({ label }) {
    const [active, setActive] = useState(false);
    return (
        <button
            className={`grid size-7 shrink-0 place-items-center border-0 bg-transparent transition hover:scale-110 hover:text-[var(--pf-accent)] ${active ? 'text-[#ffb400]' : 'text-[var(--pf-text)]'}`}
            onClick={() => setActive((value) => !value)}
            type="button"
            aria-pressed={active}
            aria-label={`${active ? 'Remove' : 'Add'} ${label} ${active ? 'from' : 'to'} favourites`}
        >
            <UiIcon name={active ? 'starFilled' : 'star'} className="size-[18px]" />
        </button>
    );
}

function TopEventCard({ event }) {
    const { toggle, has } = useBetSlip();
    const openEvent = useOpenEvent();
    const selectOdd = (odd, index) => toggle({ marketId: `${event.id}-${index}`, eventId: event.id, eventName: `${event.home} vs ${event.away}`, league: event.league, marketType: 'Match Result', label: ['Home', 'Draw', 'Away'][index], selection: ['home', 'draw', 'away'][index], odds: odd });
    return (
        <article className="w-[288px] shrink-0 rounded-[9px] bg-[var(--pf-surface)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.02)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,.22)] sm:w-[330px] sm:p-[17px] xl:w-[360px]">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <b className="block text-[13px]">{event.time}</b>
                    <span className="block truncate text-[10px] text-[var(--pf-muted)]">{event.league}</span>
                </div>
                <StarButton label={`${event.home} vs ${event.away}`} />
            </div>
            <button className="mt-4 block w-full space-y-2.5 border-0 bg-transparent p-0 text-left" onClick={() => openEvent(event.id)} type="button" aria-label={`Open ${event.home} vs ${event.away}`}>
                {[event.home, event.away].map((team) => (
                    <span className="flex min-w-0 items-center gap-3 text-[15px] font-extrabold text-[var(--pf-text)] transition group-hover:text-[var(--pf-accent)] sm:text-[17px]" key={team}>
                        <TeamCrest name={team} className="size-6" /><span className="truncate hover:text-[var(--pf-accent)]">{team}</span>
                    </span>
                ))}
            </button>
            <div className="mt-4 flex items-center justify-between text-[13px] text-[var(--pf-muted)]">
                <span>Match Result</span>
                <span className="flex items-center gap-3">
                    <UiIcon name="chevronRight" className="size-3 rotate-180" /><b className="font-normal">1/5</b><UiIcon name="chevronRight" className="size-3" />
                </span>
            </div>
            <div className="mt-3 grid grid-cols-[repeat(3,minmax(0,1fr))_58px] gap-2 sm:grid-cols-[repeat(3,minmax(0,1fr))_66px]">
                {event.odds.map((odd, index) => {
                    const selected = has(`${event.id}-${index}`);
                    return (
                        <button
                            aria-pressed={selected}
                            aria-label={`${['Home win', 'Draw', 'Away win'][index]} at ${odd.toFixed(2)}`}
                            className={`flex h-[50px] flex-col items-center justify-center rounded-[8px] border border-transparent bg-[var(--pf-card)] text-[var(--pf-text)] transition hover:border-[var(--pf-accent)]/50 ${selected ? 'border-[var(--pf-accent)] bg-[var(--pf-accent-soft)] text-[var(--pf-accent)] shadow-[0_0_0_1px_rgba(57,245,173,.25)]' : ''}`}
                            onClick={() => selectOdd(odd, index)}
                            type="button"
                            key={odd}
                        >
                            <small className="text-[10px] text-[var(--pf-muted)]">{['1', 'X', '2'][index]}</small><b>{odd.toFixed(2)}</b>
                        </button>
                    );
                })}
                <button className="h-[50px] rounded-[8px] border-0 bg-[#39f5ad] text-[13px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95 sm:text-[14px]" onClick={() => openEvent(event.id)} type="button" aria-label={`View all ${event.more} markets`}>+{event.more}</button>
            </div>
        </article>
    );
}

function SectionTitle({ upcoming = false }) {
    return (
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className={upcoming ? 'text-[var(--pf-accent)]' : 'text-[#ff9e00]'}>
                <UiIcon name={upcoming ? 'stopwatch' : 'crown'} className="size-7 sm:size-8" />
            </span>
            <h2 className="m-0 truncate text-[18px] font-black text-[var(--pf-text)] sm:text-[22px]">{upcoming ? 'Upcoming events' : 'Top Events'}</h2>
        </div>
    );
}

function OddCell({ values, event, marketIndex }) {
    const { toggle, has } = useBetSlip();
    const meta = MARKET_META[marketIndex];
    return (
        <div className="mx-auto grid h-[51px] w-full max-w-[208px] grid-cols-3 overflow-hidden rounded-[9px] border border-[var(--pf-border)] bg-[var(--pf-card)]">
            {values.map((value, index) => {
                const numeric = typeof value === 'number';
                const marketId = `${event.id}-${marketIndex}-${index}`;
                const label = meta.labels[index];
                return (
                    <button
                        aria-pressed={numeric ? has(marketId) : undefined}
                        aria-label={numeric ? `${meta.type}: ${label} at ${value.toFixed(2)}` : `${meta.type} line ${value}`}
                        className={`flex items-center justify-center border-0 border-r border-[var(--pf-border)] bg-transparent text-center text-[13px] font-bold text-[var(--pf-text)] transition last:border-0 hover:bg-[var(--pf-hover)] disabled:text-[var(--pf-muted)] disabled:hover:bg-transparent ${has(marketId) ? 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]' : ''}`}
                        disabled={!numeric}
                        onClick={() => numeric && toggle({ marketId, eventId: event.id, eventName: `${event.home} vs ${event.away}`, league: event.league, marketType: meta.type, label, selection: `${marketIndex}-${index}`, odds: value })}
                        type="button"
                        key={`${value}-${index}`}
                    >
                        {numeric ? value.toFixed(2) : value}
                    </button>
                );
            })}
        </div>
    );
}

function UpcomingRow({ event }) {
    const openEvent = useOpenEvent();
    return (
        <div className={`${ROW_GRID} min-h-[89px] border-t border-[var(--pf-border)] bg-[var(--pf-surface)] transition hover:bg-[var(--pf-card)]`}>
            <div className="sticky left-0 z-10 min-w-0 bg-[var(--pf-surface)] px-3 py-2 shadow-[10px_0_18px_rgba(3,8,16,.18)]">
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--pf-muted)]">
                    <span className="shrink-0 rounded-full bg-[var(--pf-panel)] px-2 py-0.5">{event.region}</span>
                    <span className="truncate rounded-full bg-[var(--pf-panel)] px-2 py-0.5">{event.league}</span>
                    <span className="ml-auto shrink-0">{event.time}</span>
                    <StarButton label={`${event.home} vs ${event.away}`} />
                </div>
                <button className="mt-2 block w-full space-y-2 border-0 bg-transparent p-0 text-left text-[13px] font-bold" onClick={() => openEvent(event.id)} type="button" aria-label={`Open ${event.home} vs ${event.away}`}>
                    {[event.home, event.away].map((team) => (
                        <span className="flex min-w-0 items-center gap-2 text-[var(--pf-text)] transition hover:text-[var(--pf-accent)]" key={team}>
                            <TeamCrest name={team} className="size-5" /><span className="truncate">{team}</span>
                        </span>
                    ))}
                </button>
            </div>
            <div className={`${ODDS_GRID} border-l border-[var(--pf-border)]`}>
                {event.markets.map((values, index) => <OddCell values={values} event={event} marketIndex={index} key={index} />)}
                <button className="flex h-[51px] w-full items-center justify-center gap-1 rounded-[9px] border-0 bg-[#39f5ad] text-[12px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95" onClick={() => openEvent(event.id)} type="button" aria-label={`View all ${event.more} markets`}>
                    +{event.more}<UiIcon name="chevronRight" className="size-3" />
                </button>
            </div>
        </div>
    );
}

function MobileUpcomingCard({ event }) {
    const { toggle, has } = useBetSlip();
    const openEvent = useOpenEvent();
    const selectOdd = (odd, marketIndex, index) => toggle({
        marketId: `${event.id}-${marketIndex}-${index}`,
        eventId: event.id,
        eventName: `${event.home} vs ${event.away}`,
        league: event.league,
        marketType: MARKET_META[marketIndex].type,
        label: MARKET_META[marketIndex].labels[index],
        selection: `${marketIndex}-${index}`,
        odds: odd,
    });
    return (
        <article className={`${MOBILE_GRID} border-b border-[var(--pf-border)] bg-[var(--pf-surface)]`}>
            <div className="min-w-0 p-3">
                <div className="flex items-center gap-1 text-[11px] text-[var(--pf-muted)]">
                    <span className="truncate">{event.time}</span>
                    <span className="ml-auto shrink-0"><StarButton label={`${event.home} vs ${event.away}`} /></span>
                    <button className="shrink-0 rounded-[5px] border-0 bg-[#39f5ad] px-2 py-1 text-[10px] font-bold text-[var(--pf-accent-ink)] active:scale-90" onClick={() => openEvent(event.id)} type="button" aria-label={`View all ${event.more} markets`}>+{event.more}</button>
                </div>
                <div className="mt-1 flex min-w-0 gap-1 text-[10px] text-[var(--pf-muted)]">
                    <span className="shrink-0 rounded-full bg-[var(--pf-panel)] px-2 py-1">{event.region}</span>
                    <span className="truncate rounded-full bg-[var(--pf-panel)] px-2 py-1">{event.league}</span>
                </div>
                <button className="mt-3 block w-full space-y-2 border-0 bg-transparent p-0 text-left text-[13px] font-bold" onClick={() => openEvent(event.id)} type="button" aria-label={`Open ${event.home} vs ${event.away}`}>
                    {[event.home, event.away].map((team) => (
                        <span className="flex min-w-0 items-center gap-2 text-[var(--pf-text)]" key={team}>
                            <TeamCrest name={team} className="size-5" /><span className="truncate">{team}</span>
                        </span>
                    ))}
                </button>
            </div>
            <div className="min-w-0 self-center p-2">
                <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[9px]" aria-label={`Swipe odds markets for ${event.home} vs ${event.away}`}>
                    {event.markets.map((values, marketIndex) => (
                        <div className="w-full min-w-full snap-start" key={MARKET_META[marketIndex].type}>
                            <div className="mb-1 flex items-center justify-between gap-1 px-1 text-[8px] font-bold uppercase tracking-wide text-[var(--pf-muted)]">
                                <span className="truncate">{MARKET_META[marketIndex].type}</span>
                                <span className="shrink-0 text-[var(--pf-accent)]">{marketIndex + 1}/{event.markets.length}</span>
                            </div>
                            <div className="grid h-[49px] w-full grid-cols-3 overflow-hidden rounded-[9px] border border-[var(--pf-border)] bg-[var(--pf-card)]">
                                {values.map((value, index) => {
                                    const numeric = typeof value === 'number';
                                    const marketId = `${event.id}-${marketIndex}-${index}`;
                                    const selected = numeric && has(marketId);
                                    return (
                                        <button
                                            aria-pressed={numeric ? selected : undefined}
                                            aria-label={numeric ? `${MARKET_META[marketIndex].type}: ${MARKET_META[marketIndex].labels[index]} at ${value.toFixed(2)}` : `${MARKET_META[marketIndex].type} line ${value}`}
                                            className={`flex items-center justify-center border-0 border-r border-[var(--pf-border)] bg-transparent text-center text-[12px] font-bold text-[var(--pf-text)] transition last:border-0 disabled:text-[var(--pf-muted)] ${selected ? 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]' : 'hover:bg-[var(--pf-hover)]'}`}
                                            disabled={!numeric}
                                            onClick={() => numeric && selectOdd(value, marketIndex, index)}
                                            type="button"
                                            key={`${value}-${index}`}
                                        >
                                            {numeric ? value.toFixed(2) : value}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}

export default function Sports() {
    const [activeMode, setActiveMode] = useState('prematch');
    const { railRef, scrollByPage, canGoBack, canGoForward } = useHorizontalRail();
    return (
        <div className="min-h-screen bg-[var(--pf-bg)] text-[var(--pf-text)]">
            <SportsControls activeMode={activeMode} setActiveMode={setActiveMode} />

            <section className="mt-3 px-3 sm:px-4 xl:mt-[18px] xl:px-5">
                <div className="flex h-[47px] items-center justify-between gap-3">
                    <SectionTitle />
                    <button className="h-[38px] shrink-0 rounded-[19px] border-0 bg-[#39f5ad] px-4 text-[14px] font-bold text-[var(--pf-accent-ink)] transition hover:shadow-[0_0_24px_rgba(57,245,173,.25)] active:scale-95 sm:h-[42px] sm:text-[16px]" type="button">View all</button>
                </div>
                <div className="no-scrollbar -mx-3 mt-2 flex gap-3 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:gap-[18px] sm:px-4 xl:mx-0 xl:px-0">
                    {TOP_EVENTS.map((event) => <TopEventCard event={event} key={event.id} />)}
                </div>
            </section>

            <section className="mt-2 xl:px-5">
                <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4 xl:px-0">
                    <SectionTitle upcoming />
                    <MarketRailControls
                        canGoBack={canGoBack}
                        canGoForward={canGoForward}
                        onBack={() => scrollByPage(-1)}
                        onForward={() => scrollByPage(1)}
                    />
                </div>

                <div className="xl:hidden">
                    <div className={`${MOBILE_GRID} h-[46px] items-center border-b border-[var(--pf-border)] bg-[var(--pf-panel)] text-[12px] font-bold`}>
                        <span className="truncate px-3">Upcoming</span>
                        <span className="px-2 text-center text-[var(--pf-muted)]">Swipe odds →</span>
                    </div>
                    {UPCOMING.map((event) => <MobileUpcomingCard event={event} key={event.id} />)}
                </div>

                <div ref={railRef} className="sports-market-rail hidden overflow-x-auto overscroll-x-contain rounded-[9px] pb-1 xl:block" tabIndex="0" role="region" aria-label="Upcoming event odds markets">
                    <div className="min-w-[1240px] overflow-hidden rounded-[9px]">
                        <div className={`${ROW_GRID} h-[46px] items-center bg-[var(--pf-panel)] text-[12px] font-bold`}>
                            <span className="sticky left-0 z-20 flex h-full items-center bg-[var(--pf-panel)] px-3 shadow-[10px_0_18px_rgba(3,8,16,.18)]">Upcoming</span>
                            <div className={ODDS_GRID}>
                                {MARKET_META.map((meta) => (
                                    <div className="mx-auto grid w-full max-w-[208px] grid-cols-3 text-center text-[var(--pf-muted)]" key={meta.type}>
                                        {meta.heads.map((head) => <span key={head}>{head}</span>)}
                                    </div>
                                ))}
                                <span />
                            </div>
                        </div>
                        {UPCOMING.map((event) => <UpcomingRow event={event} key={event.id} />)}
                    </div>
                </div>
            </section>
        </div>
    );
}
