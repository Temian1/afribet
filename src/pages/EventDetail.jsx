import { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import { SportIcon, TeamCrest, UiIcon } from '../components/SportIcons';
import { buildMarkets, buildStats, findEvent, MARKET_GROUPS } from '../data/sportsData';

const FORM_TONE = { W: 'bg-[#39f5ad] text-[#03150e]', D: 'bg-[#3d5480] text-white', L: 'bg-[#f0435c] text-white' };

function FormRun({ run }) {
    return (
        <div className="flex gap-1">
            {run.map((result, index) => (
                <span
                    className={`grid size-6 place-items-center rounded-md text-[11px] font-black ${FORM_TONE[result]} animate-scale-in`}
                    style={{ animationDelay: `${index * 60}ms` }}
                    key={`${result}-${index}`}
                >
                    {result}
                </span>
            ))}
        </div>
    );
}

function MarketBoard({ market, event }) {
    const { toggle, has } = useBetSlip();
    const [open, setOpen] = useState(true);

    return (
        <section className="overflow-hidden rounded-[12px] border border-[#22314c] bg-[#071226] transition hover:border-[#39f5ad]/25">
            <button
                className="flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3 text-left text-[14px] font-bold text-white"
                onClick={() => setOpen((value) => !value)}
                type="button"
                aria-expanded={open}
            >
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#12233f] text-[#39f5ad]"><UiIcon name="tune" className="size-4" /></span>
                <span className="truncate">{market.name}</span>
                <span className="ml-auto shrink-0 rounded-full bg-[#12233f] px-2 py-0.5 text-[10px] font-bold text-[#7ea9ec]">{market.selections.length}</span>
                <UiIcon name="chevronDown" className={`size-4 shrink-0 text-[#7ea9ec] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>

            <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-2 px-3 pb-3 sm:grid-cols-3">
                        {market.selections.map((selection, index) => {
                            const marketId = `${event.id}-${market.id}-${selection.key}`;
                            const selected = has(marketId);
                            return (
                                <button
                                    className={`animate-fade-up flex min-h-[52px] items-center justify-between gap-2 rounded-[9px] border px-3 text-left transition duration-200 hover:-translate-y-0.5 active:scale-[.98] ${selected ? 'border-[#39f5ad] bg-[#14392f] text-[#39f5ad]' : 'border-transparent bg-[#0d1930] text-white hover:border-[#39f5ad]/45'}`}
                                    style={{ animationDelay: `${index * 35}ms` }}
                                    onClick={() => toggle({
                                        marketId,
                                        eventId: event.id,
                                        eventName: `${event.home} vs ${event.away}`,
                                        league: event.league,
                                        marketType: market.name,
                                        label: selection.label,
                                        selection: selection.key,
                                        odds: selection.odds,
                                    })}
                                    type="button"
                                    aria-pressed={selected}
                                    key={selection.key}
                                >
                                    <small className="min-w-0 flex-1 truncate text-[11px] text-[#89a9d8]">{selection.label}</small>
                                    <b className="shrink-0 text-[14px]">{selection.odds.toFixed(2)}</b>
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
    const { items } = useBetSlip();
    const [group, setGroup] = useState('all');
    const event = findEvent(currentEvent);

    const markets = useMemo(() => (event ? buildMarkets(event) : []), [event]);
    const stats = useMemo(() => (event ? buildStats(event) : null), [event]);
    const visible = group === 'all' ? markets : markets.filter((market) => market.group === group);
    const legs = event ? items.filter((item) => item.eventId === event.id).length : 0;

    if (!event) {
        return (
            <div className="grid min-h-[60vh] place-items-center bg-[#030810] px-6 text-center text-white">
                <div className="animate-fade-up">
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#12233f] text-[#39f5ad]"><UiIcon name="search" className="size-7" /></span>
                    <h1 className="mt-4 text-[20px] font-black">Event not found</h1>
                    <p className="mt-1 text-[13px] text-[#7ea9ec]">This match may have finished or been removed from the board.</p>
                    <button className="mt-5 h-[42px] rounded-[19px] border-0 bg-[#39f5ad] px-5 text-[14px] font-bold text-[#03150e] transition active:scale-95" onClick={() => setPage('sports')} type="button">
                        Back to sports
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030810] pb-10 text-white">
            <header className="relative overflow-hidden border-b border-[#22314c] bg-gradient-to-b from-[#0b1c38] to-[#071226] px-3 pb-5 pt-3 sm:px-5">
                <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#39f5ad]/10 blur-[70px]" aria-hidden="true" />
                <div className="relative">
                    <div className="flex items-center gap-2">
                        <button className="grid size-9 shrink-0 place-items-center rounded-[10px] border-0 bg-[#12233f] text-white transition hover:text-[#39f5ad] active:scale-90" onClick={() => setPage('sports')} type="button" aria-label="Back to sports">
                            <UiIcon name="chevronRight" className="size-5 rotate-180" />
                        </button>
                        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-[10px] text-[#74a4fb]">
                            <span className="shrink-0 rounded-full bg-[#102653] px-2 py-0.5">{event.region}</span>
                            <span className="truncate rounded-full bg-[#102653] px-2 py-0.5">{event.league}</span>
                        </div>
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#102653] px-2.5 py-1 text-[10px] font-bold text-[#39f5ad]">
                            <span className="relative flex size-1.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#39f5ad] opacity-70" />
                                <span className="relative size-1.5 rounded-full bg-[#39f5ad]" />
                            </span>
                            {event.time}
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        {[event.home, event.away].map((team, index) => (
                            <div className={`animate-fade-up flex min-w-0 flex-col items-center gap-2 ${index === 1 ? 'order-3' : ''}`} style={{ animationDelay: `${index * 90}ms` }} key={team}>
                                <TeamCrest name={team} className="size-14 drop-shadow-[0_6px_18px_rgba(57,245,173,.18)]" />
                                <b className="line-clamp-2 text-center text-[14px] font-extrabold sm:text-[16px]">{team}</b>
                            </div>
                        ))}
                        <div className="order-2 flex flex-col items-center gap-1">
                            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#7ea9ec]">VS</span>
                            <span className="text-[#39f5ad]"><SportIcon type={event.sport} className="size-7" /></span>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#8ab1f1]">
                        <span className="rounded-full border border-[#22314c] bg-[#0a1830] px-3 py-1.5">{markets.length} market groups</span>
                        <span className="rounded-full border border-[#22314c] bg-[#0a1830] px-3 py-1.5">+{event.more} selections</span>
                        {legs > 0 ? <span className="animate-scale-in rounded-full border border-[#39f5ad]/40 bg-[#14392f] px-3 py-1.5 font-bold text-[#39f5ad]">{legs} in bet slip</span> : null}
                    </div>
                </div>
            </header>

            {stats ? (
                <section className="mx-3 mt-4 rounded-[12px] border border-[#22314c] bg-[#071226] p-4 sm:mx-5">
                    <h2 className="m-0 flex items-center gap-2 text-[14px] font-black">
                        <span className="text-[#39f5ad]"><UiIcon name="results" className="size-5" /></span>Form &amp; head-to-head
                    </h2>
                    <div className="mt-3 space-y-2.5">
                        {[['home', event.home], ['away', event.away]].map(([side, team]) => (
                            <div className="flex items-center gap-3" key={side}>
                                <TeamCrest name={team} className="size-5" />
                                <span className="min-w-0 flex-1 truncate text-[12px] font-bold">{team}</span>
                                <FormRun run={stats.form[side]} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-[11px] text-[#8ab1f1]">
                            <span>{stats.h2h.home}W</span><span>{stats.h2h.draws}D</span><span>{stats.h2h.away}W</span>
                        </div>
                        <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-[#12233f]">
                            {[['#39f5ad', stats.h2h.home], ['#3d5480', stats.h2h.draws], ['#f0435c', stats.h2h.away]].map(([color, value]) => (
                                <span
                                    className="h-full transition-[width] duration-700 ease-out"
                                    style={{ width: `${stats.h2h.total ? (value / stats.h2h.total) * 100 : 33.3}%`, background: color }}
                                    key={color}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <div className="no-scrollbar sticky top-[61px] z-20 mt-4 flex gap-1.5 overflow-x-auto border-y border-[#22314c] bg-[#030810]/95 px-3 py-2.5 backdrop-blur-xl sm:px-5 xl:top-[74px]">
                {MARKET_GROUPS.map(([id, label]) => (
                    <button
                        className={`h-9 shrink-0 rounded-[18px] border-0 px-3.5 text-[12px] font-bold transition active:scale-95 ${group === id ? 'bg-[#39f5ad] text-[#03150e] shadow-[0_0_20px_rgba(57,245,173,.25)]' : 'bg-[#12233f] text-[#bad0f5] hover:bg-[#1a2f52]'}`}
                        onClick={() => setGroup(id)}
                        type="button"
                        aria-pressed={group === id}
                        key={id}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="mt-3 space-y-2.5 px-3 sm:px-5">
                {visible.map((market, index) => (
                    <div className="animate-fade-up" style={{ animationDelay: `${index * 45}ms` }} key={market.id}>
                        <MarketBoard market={market} event={event} />
                    </div>
                ))}
                {visible.length === 0 ? <p className="py-10 text-center text-[13px] text-[#7ea9ec]">No markets in this group.</p> : null}
            </div>
        </div>
    );
}
