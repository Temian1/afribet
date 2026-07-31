import { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import { TeamCrest, UiIcon } from '../components/SportIcons';
import { buildMarkets, findEvent, MARKET_GROUPS } from '../data/sportsData';

/** "Today at 16:00" -> { date: '29/07', time: '16:00' } for the hero card. */
function kickoff(event) {
    const time = /(\d{1,2}:\d{2})/.exec(event.time)?.[1] ?? '00:00';
    const when = new Date();
    if (/tomorrow/i.test(event.time)) when.setDate(when.getDate() + 1);
    const date = `${String(when.getDate()).padStart(2, '0')}/${String(when.getMonth() + 1).padStart(2, '0')}`;
    return { date, time };
}

function Crumb({ children, className = '' }) {
    return <span className={`shrink-0 rounded-full bg-[var(--pf-panel)] px-3 py-1.5 text-[12px] font-semibold text-[var(--pf-text)] ${className}`}>{children}</span>;
}

function PinIcon() {
    return (
        <svg className="size-4 shrink-0 -rotate-45 text-[var(--pf-accent)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14.5 2.5 21.5 9.5l-2.1 2.1-1.4-.4-3.4 3.4.6 3.3-1.8 1.8-3.9-3.9-4.6 4.6-1.1-1.1 4.6-4.6-3.9-3.9L6.3 9l3.3.6L13 6.2l-.4-1.4z" />
        </svg>
    );
}

function BoostIcon() {
    return (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M7 10.5v3M17 10.5v3M11 12h2" />
        </svg>
    );
}

function MarketCard({ market, event, collapsedAll }) {
    const { toggle, has } = useBetSlip();
    const [override, setOverride] = useState(null);
    const open = override ?? !collapsedAll;
    const columns = market.columns === 3 ? 'grid-cols-3' : 'grid-cols-2';

    return (
        <section className="mb-2.5 overflow-hidden rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-card)]">
            <button
                className="flex w-full items-center gap-2.5 border-0 bg-transparent px-3.5 py-3.5 text-left"
                onClick={() => setOverride(!open)}
                type="button"
                aria-expanded={open}
            >
                <PinIcon />
                <b className="min-w-0 flex-1 truncate text-[14px] font-bold text-[var(--pf-text)]">{market.name}</b>
                <span className="shrink-0 text-[var(--pf-faint)]"><BoostIcon /></span>
                <UiIcon name="chevronDown" className={`size-4 shrink-0 text-[var(--pf-faint)] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>

            <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className={`grid ${columns} gap-px border-t border-[var(--pf-border)] bg-[var(--pf-border)]`}>
                        {market.selections.map((selection) => {
                            const marketId = `${event.id}-${market.id}-${selection.key}`;
                            const selected = has(marketId);
                            return (
                                <button
                                    className={`flex min-h-[52px] items-center justify-between gap-2 border-0 px-3.5 text-left transition ${selected ? 'bg-[var(--pf-accent-soft)]' : 'bg-[var(--pf-card)] hover:bg-[var(--pf-panel)]'}`}
                                    onClick={() => toggle({
                                        marketId,
                                        eventId: event.id,
                                        eventName: `${event.home} vs ${event.away}`,
                                        league: event.league,
                                        marketType: market.name,
                                        label: selection.name,
                                        selection: selection.key,
                                        odds: selection.odds,
                                    })}
                                    type="button"
                                    aria-pressed={selected}
                                    aria-label={`${market.name}: ${selection.name} at ${selection.odds.toFixed(2)}`}
                                    key={selection.key}
                                >
                                    <span className={`min-w-0 truncate text-[13px] ${selected ? 'text-[var(--pf-accent)]' : 'text-[var(--pf-odds-label)]'}`}>{selection.label}</span>
                                    <b className={`shrink-0 text-[13px] font-bold ${selected ? 'text-[var(--pf-accent)]' : 'text-[var(--pf-text)]'}`}>{selection.odds.toFixed(2)}</b>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function EventDetail() {
    const { currentEvent, setPage } = useApp();
    const [group, setGroup] = useState('all');
    const [collapsedAll, setCollapsedAll] = useState(false);
    const [starred, setStarred] = useState(false);
    const [query, setQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const event = findEvent(currentEvent);

    const markets = useMemo(() => (event ? buildMarkets(event) : []), [event]);
    const byGroup = group === 'all' ? markets : markets.filter((market) => market.group === group);
    const term = query.trim().toLowerCase();
    const visible = term ? byGroup.filter((market) => market.name.toLowerCase().includes(term)) : byGroup;

    if (!event) {
        return (
            <div className="grid min-h-[60vh] place-items-center bg-[var(--pf-bg)] px-6 text-center text-[var(--pf-text)]">
                <div className="animate-fade-up">
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name="search" className="size-7" /></span>
                    <h1 className="mt-4 text-[20px] font-black">Event not found</h1>
                    <p className="mt-1 text-[13px] text-[var(--pf-muted)]">This match may have finished or been removed from the board.</p>
                    <button className="mt-5 h-[42px] rounded-[19px] border-0 bg-[var(--pf-accent)] px-5 text-[14px] font-bold text-[var(--pf-accent-ink)] transition active:scale-95" onClick={() => setPage('sports')} type="button">
                        Back to sports
                    </button>
                </div>
            </div>
        );
    }

    const { date, time } = kickoff(event);
    const counts = {
        all: markets.length,
        main: markets.filter((market) => market.group === 'main').length,
        specials: markets.filter((market) => market.group === 'specials').length,
    };

    return (
        <div className="min-h-screen bg-[var(--pf-bg)] pb-10">
            <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4">
                <button className="grid size-9 shrink-0 place-items-center rounded-full border-0 bg-[var(--pf-panel)] text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90" onClick={() => setPage('sports')} type="button" aria-label="Back to sports">
                    <UiIcon name="chevronRight" className="size-5 rotate-180" />
                </button>
                <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
                    <Crumb>Football</Crumb>
                    <Crumb>{event.region}</Crumb>
                    <Crumb className="max-sm:max-w-[190px] max-sm:truncate">{event.league}</Crumb>
                </div>
                <button
                    className={`grid size-9 shrink-0 place-items-center rounded-full border-0 bg-[var(--pf-panel)] transition active:scale-90 ${starred ? 'text-[#ffb400]' : 'text-[var(--pf-text)]'}`}
                    onClick={() => setStarred((value) => !value)}
                    type="button"
                    aria-pressed={starred}
                    aria-label="Add to favourites"
                >
                    <UiIcon name={starred ? 'starFilled' : 'star'} className="size-5" />
                </button>
            </div>

            <header className="event-pitch relative mx-3 flex h-[110px] items-center justify-center overflow-hidden rounded-[10px] sm:mx-4 sm:h-[130px]">
                <div className="relative z-[1] flex items-center gap-6 sm:gap-10">
                    <TeamCrest name={event.home} className="size-8 drop-shadow-[0_2px_6px_rgba(0,0,0,.55)] sm:size-9" />
                    <div className="rounded-[8px] bg-[color-mix(in_oklab,var(--pf-surface)_88%,transparent)] px-4 py-1.5 text-center backdrop-blur-sm">
                        <b className="block text-[15px] font-bold leading-tight text-[var(--pf-text)] sm:text-[16px]">{date}</b>
                        <span className="block text-[15px] leading-tight text-[var(--pf-text)] sm:text-[16px]">{time}</span>
                    </div>
                    <TeamCrest name={event.away} className="size-8 drop-shadow-[0_2px_6px_rgba(0,0,0,.55)] sm:size-9" />
                </div>
                <span className="absolute inset-x-0 bottom-1 z-[1] truncate px-3 text-center text-[11px] font-semibold text-white/90 drop-shadow sm:hidden">
                    {event.home} — {event.away}
                </span>
            </header>

            <div className="sticky top-[61px] z-20 mt-2.5 flex items-center gap-2 bg-[var(--pf-bg)]/95 px-3 py-2.5 backdrop-blur-xl sm:px-4 xl:top-[74px]">
                <button className="order-2 grid size-9 shrink-0 place-items-center rounded-full border-0 bg-[var(--pf-panel)] text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90 xl:order-1" onClick={() => setSearchOpen((value) => !value)} type="button" aria-label="Search markets" aria-expanded={searchOpen}>
                    <UiIcon name="search" className="size-[18px]" />
                </button>
                <div className="no-scrollbar order-1 flex min-w-0 flex-1 gap-2 overflow-x-auto xl:order-2 xl:flex-none">
                    {MARKET_GROUPS.map(([id, label]) => (
                        <button
                            className={`h-9 shrink-0 rounded-full border px-4 text-[13px] font-semibold transition active:scale-95 ${group === id ? 'border-transparent bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]' : 'border-[var(--pf-border)] bg-transparent text-[var(--pf-text)] hover:bg-[var(--pf-panel)]'}`}
                            onClick={() => setGroup(id)}
                            type="button"
                            aria-pressed={group === id}
                            key={id}
                        >
                            {label} ({counts[id]})
                        </button>
                    ))}
                </div>
                <button className="order-3 ml-auto grid size-9 shrink-0 place-items-center rounded-full border-0 bg-transparent text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90" onClick={() => setCollapsedAll((value) => !value)} type="button" aria-label={collapsedAll ? 'Expand all markets' : 'Collapse all markets'}>
                    <svg className={`size-5 transition-transform duration-300 ${collapsedAll ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m6 13 6-6 6 6M6 18l6-6 6 6" />
                    </svg>
                </button>
            </div>

            {searchOpen ? (
                <div className="animate-fade-up px-3 pb-2 sm:px-4">
                    <input
                        className="w-full rounded-full border border-[var(--pf-border)] bg-[var(--pf-input)] px-4 py-2.5 text-[13px] text-[var(--pf-text)] outline-none transition placeholder:text-[var(--pf-faint)] focus:border-[var(--pf-accent)]"
                        value={query}
                        onChange={(fromEvent) => setQuery(fromEvent.target.value)}
                        placeholder="Filter markets…"
                        aria-label="Filter markets"
                    />
                </div>
            ) : null}

            <div className="px-3 sm:px-4 xl:columns-2 xl:gap-2.5">
                {visible.map((market, index) => (
                    <div className="animate-fade-up break-inside-avoid" style={{ animationDelay: `${index * 40}ms` }} key={market.id}>
                        <MarketCard market={market} event={event} collapsedAll={collapsedAll} />
                    </div>
                ))}
                {visible.length === 0 ? <p className="py-10 text-center text-[13px] text-[var(--pf-muted)]">No markets match that filter.</p> : null}
            </div>
        </div>
    );
}
