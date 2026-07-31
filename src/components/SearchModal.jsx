import { useEffect, useMemo, useRef, useState } from 'react';
import Portal from './Portal';
import { SportIcon, TeamCrest, UiIcon } from './SportIcons';
import { ALL_EVENTS } from '../data/sportsData';
import { MENU_SECTIONS } from '../data/menu';

const GAMES = [
    ['roulette', 'Spinz Roulette'], ['crash', 'Aviator'], ['blackjack', 'Golden Blackjack'],
    ['slots', 'Magic Aladdin'], ['mines', 'Chicken Road'], ['plinko', 'Just Jump'],
    ['dice', 'Lucky Dice'], ['limbo', 'The Skyscraper'], ['wheel', 'Cosmic Roulette'],
    ['coinflip', 'Joker Rush'],
];

const PAGE_TARGETS = MENU_SECTIONS.flatMap((section) => section.items.map(([target, label, icon]) => ({ target, label, icon })));

const QUICK_SUGGESTIONS = ['Champions League', 'Aviator', 'Wallet', 'Withdrawals', 'Premier League'];

export default function SearchModal({ open, onClose, onNavigate, onOpenGame }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (event) => event.key === 'Escape' && onClose();
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        const timer = setTimeout(() => inputRef.current?.focus(), 60);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKey);
            clearTimeout(timer);
        };
    }, [open, onClose]);

    useEffect(() => { if (!open) setQuery(''); }, [open]);

    const term = query.trim().toLowerCase();

    const results = useMemo(() => {
        if (!term) return { events: [], games: [], pages: [] };
        const match = (value) => value.toLowerCase().includes(term);
        return {
            events: ALL_EVENTS.filter((event) => match(event.home) || match(event.away) || match(event.league)).slice(0, 6),
            games: GAMES.filter(([, label]) => match(label)).slice(0, 6),
            pages: PAGE_TARGETS.filter((entry) => match(entry.label)).slice(0, 5),
        };
    }, [term]);

    if (!open) return null;

    const total = results.events.length + results.games.length + results.pages.length;

    return (
        <Portal>
            <div className="fixed inset-0 z-[96] flex justify-center px-3 pt-[8vh]" role="dialog" aria-modal="true" aria-label="Search">
                <button className="app-drawer-backdrop absolute inset-0 border-0 bg-black/70 backdrop-blur-sm" onClick={onClose} type="button" aria-label="Close search" />

                <div className="app-search-panel relative flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-[16px] border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#0a1424] dark:text-white">
                    <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2.5 dark:border-white/10">
                        <span className="text-slate-400 dark:text-[#5f83b8]"><UiIcon name="search" /></span>
                        <input
                            className="min-w-0 flex-1 border-0 bg-transparent py-2 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#4d6b91]"
                            ref={inputRef}
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search teams, leagues, games or pages…"
                            aria-label="Search Afribet"
                            type="search"
                        />
                        <button className="grid size-8 shrink-0 place-items-center rounded-full border-0 bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-90 dark:bg-[#122038] dark:text-white dark:hover:bg-[#1a2b48]" onClick={onClose} type="button" aria-label="Close search">
                            <UiIcon name="close" className="size-4" />
                        </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
                        {!term ? (
                            <div>
                                <h3 className="m-0 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#5f83b8]">Popular searches</h3>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_SUGGESTIONS.map((suggestion) => (
                                        <button
                                            className="h-8 rounded-full border border-slate-200 bg-slate-50 px-3 text-[12px] font-semibold text-slate-600 transition hover:border-[#0cb978]/40 hover:text-[#0cb978] active:scale-95 dark:border-white/[.07] dark:bg-[#122038] dark:text-[#bad0f5] dark:hover:border-[#39f5ad]/40 dark:hover:text-[#39f5ad]"
                                            onClick={() => setQuery(suggestion)}
                                            type="button"
                                            key={suggestion}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : total === 0 ? (
                            <p className="py-10 text-center text-[13px] text-slate-500 dark:text-[#7ea9ec]">No matches for “{query}”.</p>
                        ) : (
                            <div className="space-y-4">
                                {results.events.length ? (
                                    <div>
                                        <h3 className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#5f83b8]">Events</h3>
                                        <div className="space-y-1.5">
                                            {results.events.map((event, index) => (
                                                <button
                                                    className="app-search-row flex w-full items-center gap-3 rounded-[10px] border border-slate-200 bg-slate-50 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#0cb978]/40 active:scale-[.99] dark:border-white/[.06] dark:bg-[#0d1b31] dark:hover:border-[#39f5ad]/40"
                                                    style={{ animationDelay: `${index * 35}ms` }}
                                                    onClick={() => { onClose(); onNavigate('event', event.id); }}
                                                    type="button"
                                                    key={event.id}
                                                >
                                                    <TeamCrest name={event.home} className="size-7" />
                                                    <div className="min-w-0 flex-1">
                                                        <b className="block truncate text-[13px]">{event.home} vs {event.away}</b>
                                                        <span className="block truncate text-[11px] text-slate-500 dark:text-[#7ea9ec]">{event.league} • {event.time}</span>
                                                    </div>
                                                    <UiIcon name="chevronRight" className="size-4 shrink-0 opacity-40" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                {results.games.length ? (
                                    <div>
                                        <h3 className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#5f83b8]">Casino games</h3>
                                        <div className="space-y-1.5">
                                            {results.games.map(([id, label], index) => (
                                                <button
                                                    className="app-search-row flex w-full items-center gap-3 rounded-[10px] border border-slate-200 bg-slate-50 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#0cb978]/40 active:scale-[.99] dark:border-white/[.06] dark:bg-[#0d1b31] dark:hover:border-[#39f5ad]/40"
                                                    style={{ animationDelay: `${index * 35}ms` }}
                                                    onClick={() => { onClose(); onOpenGame(id); }}
                                                    type="button"
                                                    key={label}
                                                >
                                                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white text-[#0cb978] dark:bg-[#122038] dark:text-[#39f5ad]"><UiIcon name="slots" className="size-4" /></span>
                                                    <b className="min-w-0 flex-1 truncate text-[13px]">{label}</b>
                                                    <UiIcon name="chevronRight" className="size-4 shrink-0 opacity-40" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                {results.pages.length ? (
                                    <div>
                                        <h3 className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#5f83b8]">Pages</h3>
                                        <div className="space-y-1.5">
                                            {results.pages.map((entry, index) => (
                                                <button
                                                    className="app-search-row flex w-full items-center gap-3 rounded-[10px] border border-slate-200 bg-slate-50 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#0cb978]/40 active:scale-[.99] dark:border-white/[.06] dark:bg-[#0d1b31] dark:hover:border-[#39f5ad]/40"
                                                    style={{ animationDelay: `${index * 35}ms` }}
                                                    onClick={() => { onClose(); onNavigate(entry.target); }}
                                                    type="button"
                                                    key={entry.label}
                                                >
                                                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white text-[#0cb978] dark:bg-[#122038] dark:text-[#39f5ad]">
                                                        {entry.icon === 'ball' ? <SportIcon type="football" className="size-4" /> : <UiIcon name={entry.icon} className="size-4" />}
                                                    </span>
                                                    <b className="min-w-0 flex-1 truncate text-[13px]">{entry.label}</b>
                                                    <UiIcon name="chevronRight" className="size-4 shrink-0 opacity-40" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
}
