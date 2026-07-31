import { useState } from 'react';
import { useBetSlip } from '../contexts/BetSlipContext';
import { PlatformIcon } from '../components/PlatformShell';

const SPORTS = [
    ['football', 914], ['basketball', 11], ['tennis', 257], ['hockey', 77],
    ['volleyball', 11], ['boxing', 56], ['baseball', 16], ['handball', 6],
    ['golf', 3], ['rugby', 11], ['pool', 1], ['soccer', 92], ['chess', 3],
    ['racing', 1], ['cricket', 576], ['badminton', 10], ['table', 19],
];

const LEAGUES = [
    ['popular', 'Popular'],
    ['champions', 'UEFA Champions League Qualifying'],
    ['europa', 'UEFA Europa League Qualification'],
    ['conference', 'UEFA Conference League Qualification'],
    ['premier', 'Premier League'],
    ['laliga', 'La Liga'],
    ['seriea', 'Serie A'],
    ['ligue1', 'Ligue 1'],
];

const TOP_EVENTS = [
    { id: 'top-1', time: 'Today at 16:00', league: 'UEFA Champions League Qualifying', home: 'Kairat Almaty', away: 'AC Omonia Nicosia', emblems: ['♟', '☘'], odds: [2.11, 3.10, 3.53], more: 150 },
    { id: 'top-2', time: 'Today at 17:00', league: 'UEFA Champions League Qualifying', home: 'FK Kauno Zalgiris', away: 'Klaksvik', emblems: ['🛡', '🔷'], odds: [1.71, 3.43, 4.86], more: 134 },
    { id: 'top-3', time: 'Today at 18:00', league: 'UEFA Champions League Qualifying', home: 'Lech Poznan', away: 'AGF Aarhus', emblems: ['🔱', '🛡'], odds: [1.72, 3.79, 4.24], more: 153 },
    { id: 'top-4', time: 'Today at 18:30', league: 'UEFA Champions League Qualifying', home: 'CS U Craiova', away: 'Levski Sofia', emblems: ['🛡', '🔰'], odds: [1.96, 3.31, 3.72], more: 134 },
];

const UPCOMING = [
    { id: 'up-1', region: 'Europe', league: 'UEFA Conference League Qualification', time: 'Today at 15:30', home: 'Dukagjini FK', away: 'Lugano', emblems: ['🛡', '◉'], more: 120, odds: [[5.93, 4.52, 1.45], [1.70, '+2.5-', 2.03], [1.83, '–', 1.84], [1.99, '+1-', 1.73]] },
    { id: 'up-2', region: 'Russia', league: 'Russia Cup', time: 'Today at 15:30', home: 'Moskovskaya Zastava-Kristall', away: 'Krasnoe Znamya Noginsk', emblems: ['⬟', '♦'], more: 68, odds: [[6.43, 4.04, 1.48], [1.76, '+3.5-', 1.95], [1.41, '–', 2.52], [2.08, '+1-', 1.66]] },
    { id: 'up-3', region: 'World', league: 'Club Friendly Games', time: 'Today at 16:00', home: 'Riga FC', away: 'Suduva', emblems: ['●', '◆'], more: 84, odds: [[1.62, 3.78, 4.80], [1.85, '+2.5-', 1.88], [1.74, '–', 1.96], [1.51, '-1+', 2.31]] },
];

function SportGlyph({ type, className = 'size-8' }) {
    const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    return (
        <svg className={className} viewBox="0 0 32 32" aria-hidden="true" {...common}>
            <circle cx="16" cy="16" r="12" />
            {type === 'football' || type === 'soccer' ? <><path d="m12 6 4 4 4-4M5 13l6 3-2 7m18-10-6 3 2 7M11 16h10l2 7-7 5-7-5Z" /><path d="m16 10-5 6 5 4 5-4Z" /></> : null}
            {type === 'basketball' ? <><path d="M5 12c7 1 14 7 15 14M12 5c1 7 7 14 14 15M4 20 28 12M20 4 12 28" /></> : null}
            {type === 'tennis' ? <><path d="M7 7c9 2 16 9 18 18M25 7C16 9 9 16 7 25" /></> : null}
            {type === 'hockey' ? <><path d="m8 23 3-3h13l3 3M11 20l5-14M18 21l4-15" /></> : null}
            {type === 'volleyball' ? <><path d="M16 4c2 6 1 10-3 13M4 15c7-1 11 1 14 6M25 8c-5 4-7 8-6 14" /></> : null}
            {!['football', 'soccer', 'basketball', 'tennis', 'hockey', 'volleyball'].includes(type) ? <><path d="M8 8c4 4 12 12 16 16M24 8 8 24M16 4v24M4 16h24" /></> : null}
        </svg>
    );
}

function TinyIcon({ name, className = 'size-5' }) {
    const paths = {
        crown: <path d="m3 7 4 4 5-7 5 7 4-4-2 11H5Z" />,
        star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />,
        clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></>,
        chevron: <path d="m8 10 4 4 4-4" />,
        trophy: <><path d="M7 4h10v4c0 4-2 7-5 7s-5-3-5-7Z" /><path d="M7 6H4c0 4 2 6 5 6m8-6h3c0 4-2 6-5 6M12 15v4m-4 1h8" /></>,
        stopwatch: <><circle cx="12" cy="13" r="8" /><path d="M12 13V8m-3-6h6m-3 3V2m6 4 2-2" /></>,
        flame: <path d="M13 22c4 0 7-3 7-7 0-5-4-8-6-12 0 5-3 6-4 10-1-2-2-3-4-4 0 2-2 4-2 7 0 4 4 6 9 6Z" />,
    };
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function NavButton({ active, icon, label, onClick }) {
    return (
        <button className={`relative flex h-[53px] items-center gap-2 border-0 bg-transparent px-2 text-[15px] font-extrabold transition ${active ? 'text-white' : 'text-slate-200 hover:text-[#39f5ad]'}`} onClick={onClick} type="button">
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
            <div className="border-b border-[#263653] bg-[#071226] px-3 xl:hidden">
                <div className="flex h-[53px] items-center gap-2">
                    <NavButton active={false} icon={<PlatformIcon name="home" className="size-4" />} label="" />
                    <NavButton active={activeMode === 'live'} label="Live" onClick={() => setActiveMode('live')} />
                    <NavButton active={activeMode === 'prematch'} label="Pre-match" onClick={() => setActiveMode('prematch')} />
                    <div className="ml-auto flex gap-1.5">
                        <button className="sport-square" type="button" aria-label="Top competitions"><TinyIcon name="crown" /></button>
                        <button className="sport-square" type="button" aria-label="Favourites"><TinyIcon name="star" /></button>
                        <button className="sport-square text-[#39f5ad]" type="button" aria-label="Recent"><TinyIcon name="clock" /></button>
                        <button className="grid size-9 place-items-center bg-transparent text-[#bad0f5]" type="button" aria-label="Search"><PlatformIcon name="search" /></button>
                    </div>
                </div>
            </div>

            <div className="no-scrollbar flex h-[61px] items-center overflow-x-auto border-b border-[#283753] bg-[#071226] pl-2 pr-[51px] xl:mx-[15px] xl:mt-9 xl:h-[61px] xl:rounded-[9px] xl:border xl:px-2">
                <div className="mr-2 hidden shrink-0 gap-1 xl:flex">
                    <button className="sport-square" type="button"><PlatformIcon name="home" className="size-4" /></button>
                    <button className="sport-square" type="button"><PlatformIcon name="live" className="size-4" /></button>
                    <button className="sport-square bg-[#39f5ad] text-[#03150e]" type="button"><TinyIcon name="stopwatch" /></button>
                    <button className="sport-square" type="button"><TinyIcon name="crown" /></button>
                    <button className="sport-square" type="button"><TinyIcon name="star" /></button>
                </div>
                {SPORTS.map(([type, count]) => (
                    <button className={`group relative grid h-full min-w-[54px] place-items-center border-0 bg-transparent transition ${sport === type ? 'text-[#39f5ad]' : 'text-[#b7c9e8] hover:text-white'}`} onClick={() => setSport(type)} type="button" key={type} aria-label={type}>
                        <SportGlyph type={type} className="size-[37px] transition-transform group-hover:scale-110" />
                        <span className="absolute right-1 top-1.5 rounded-full bg-[#15233d] px-1 text-[9px] text-white">{count}</span>
                    </button>
                ))}
                <button className="sticky right-1 ml-auto grid size-9 min-w-9 place-items-center rounded-[7px] border-0 bg-[#39f5ad] text-[#03150e] shadow-[-12px_0_16px_#071226]" type="button" aria-label="More sports"><TinyIcon name="chevron" /></button>
            </div>

            <div className="flex h-[54px] items-center gap-2 border-b border-[#263653] bg-[#091326] px-2 xl:mx-5 xl:mt-[31px] xl:rounded-[9px] xl:border">
                <button className="flex h-[43px] w-[180px] shrink-0 items-center justify-between rounded-[7px] border border-[#2b4269] bg-[#0d1e3b] px-3 text-[16px] text-white xl:w-[180px]" type="button">
                    All 914 <TinyIcon name="chevron" />
                </button>
                <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto">
                    {LEAGUES.map(([id, label]) => (
                        <button className={`flex h-[43px] shrink-0 items-center gap-2 rounded-[7px] border-0 px-3 text-[12px] font-bold transition xl:text-[13px] ${league === id ? 'bg-[#39f5ad] text-[#03150e]' : 'bg-transparent text-white hover:bg-white/5'}`} onClick={() => setLeague(id)} type="button" key={id}>
                            {id === 'popular' ? <TinyIcon name="flame" className="size-5 fill-current" /> : <span className="grid size-5 place-items-center rounded-full bg-white text-[10px] text-[#101a2c]">⚽</span>}
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

function StarButton() {
    return <button className="grid size-7 place-items-center border-0 bg-transparent text-white transition hover:scale-110 hover:text-[#39f5ad]" type="button" aria-label="Add to favourites"><TinyIcon name="star" className="size-[18px]" /></button>;
}

function TopEventCard({ event }) {
    const { toggle, has } = useBetSlip();
    const selectOdd = (odd, index) => toggle({ marketId: `${event.id}-${index}`, eventId: event.id, eventName: `${event.home} vs ${event.away}`, league: event.league, marketType: '1x2', label: ['Home', 'Draw', 'Away'][index], selection: ['home', 'draw', 'away'][index], odds: odd });
    return (
        <article className="h-[243px] w-[360px] shrink-0 rounded-[9px] bg-[#071226] p-[17px] shadow-[inset_0_1px_0_rgba(255,255,255,.02)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,.22)] max-xl:h-[243px] max-xl:w-[360px] max-[500px]:h-[243px] max-[500px]:w-[360px]">
            <div className="flex items-start justify-between">
                <div><b className="block text-[13px]">{event.time}</b><span className="text-[10px] text-[#81affb]">{event.league}</span></div><StarButton />
            </div>
            <div className="mt-[17px] space-y-2.5">
                {[event.home, event.away].map((team, index) => <div className="flex items-center gap-3 text-[17px] font-extrabold" key={team}><span className="grid size-5 place-items-center text-sm">{event.emblems[index]}</span>{team}</div>)}
            </div>
            <div className="mt-[17px] flex items-center justify-between text-[13px] text-[#8ab1f1]"><span>Match Result</span><span className="flex items-center gap-4">‹ <b className="font-normal">1/5</b> ›</span></div>
            <div className="mt-3 grid grid-cols-[repeat(3,1fr)_66px] gap-2">
                {event.odds.map((odd, index) => <button aria-pressed={has(`${event.id}-${index}`)} aria-label={`${['Home win', 'Draw', 'Away win'][index]} at ${odd.toFixed(2)}`} className={`h-[50px] rounded-[8px] border border-transparent bg-[#0d1930] text-white transition hover:border-[#39f5ad]/50 ${has(`${event.id}-${index}`) ? 'border-[#39f5ad] bg-[#14392f] text-[#39f5ad] shadow-[0_0_0_1px_rgba(57,245,173,.25)]' : ''}`} onClick={() => selectOdd(odd, index)} type="button" key={odd}><small className="block text-[10px] text-[#7395cd]">{['1', 'X', '2'][index]}</small><b>{odd.toFixed(2)}</b></button>)}
                <button className="h-[50px] rounded-[8px] border-0 bg-[#39f5ad] text-[14px] font-bold text-[#03150e] transition hover:brightness-110" type="button">+{event.more}</button>
            </div>
        </article>
    );
}

function SectionTitle({ upcoming = false }) {
    return (
        <div className="flex items-center gap-3">
            <span className={upcoming ? 'text-[#39f5ad]' : 'text-[#ff9e00]'}>{upcoming ? <TinyIcon name="stopwatch" className="size-8 fill-current" /> : <TinyIcon name="crown" className="size-9 fill-current" />}</span>
            <h2 className="m-0 text-[22px] font-black text-white">{upcoming ? 'Upcoming events' : 'Top Events'}</h2>
        </div>
    );
}

const MARKET_META = [
    { type: 'Match Result', labels: ['Home', 'Draw', 'Away'] },
    { type: 'Total Goals', labels: ['Over', 'Line', 'Under'] },
    { type: 'Both Teams to Score', labels: ['Yes', 'Market', 'No'] },
    { type: 'Asian Handicap', labels: ['Home', 'Line', 'Away'] },
];

function OddCell({ values, event, marketIndex }) {
    const { toggle, has } = useBetSlip();
    const meta = MARKET_META[marketIndex];
    return (
        <div className="grid h-[51px] min-w-[188px] grid-cols-3 overflow-hidden rounded-[9px] border border-[#263958] bg-[#0e1b31]">
            {values.map((value, index) => {
                const numeric = typeof value === 'number';
                const marketId = `${event.id}-${marketIndex}-${index}`;
                const label = meta.labels[index];
                return <button aria-pressed={numeric ? has(marketId) : undefined} aria-label={numeric ? `${meta.type}: ${label} at ${value.toFixed(2)}` : `${meta.type} line ${value}`} className={`border-0 border-r border-[#2b3a53] bg-transparent text-[13px] font-bold text-white transition last:border-0 hover:bg-[#183458] ${has(marketId) ? 'bg-[#174b3c] text-[#39f5ad]' : ''}`} disabled={!numeric} onClick={() => numeric && toggle({ marketId, eventId: event.id, eventName: `${event.home} vs ${event.away}`, league: event.league, marketType: meta.type, label, selection: `${marketIndex}-${index}`, odds: value })} type="button" key={`${value}-${index}`}>{numeric ? value.toFixed(2) : value}</button>;
            })}
        </div>
    );
}

function UpcomingRow({ event }) {
    return (
        <div className="grid min-h-[89px] grid-cols-[minmax(460px,1fr)_minmax(930px,1.45fr)] border-t border-[#2c3c56] bg-[#071226]">
            <div className="px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] text-[#74a4fb]"><span className="rounded-full bg-[#102653] px-2 py-0.5">{event.region}</span><span className="rounded-full bg-[#102653] px-2 py-0.5">{event.league}</span><span className="ml-auto">{event.time}</span><StarButton /></div>
                <div className="mt-2 grid grid-cols-[20px_1fr] gap-x-2 gap-y-2 text-[13px] font-bold"><span>{event.emblems[0]}</span><span>{event.home}</span><span>{event.emblems[1]}</span><span>{event.away}</span></div>
            </div>
            <div className="flex items-center gap-6 border-l border-[#2b3a53] px-4">
                {event.odds.map((values, index) => <OddCell values={values} event={event} marketIndex={index} key={index} />)}
                <button className="h-[51px] min-w-[70px] rounded-[9px] border-0 bg-[#39f5ad] text-[12px] font-bold text-[#03150e]" type="button">+{event.more} ›</button>
            </div>
        </div>
    );
}

function MobileUpcomingCard({ event }) {
    const { toggle, has } = useBetSlip();
    const selectOdd = (odd, index) => {
        const marketId = `${event.id}-mobile-1x2-${index}`;
        toggle({
            marketId,
            eventId: event.id,
            eventName: `${event.home} vs ${event.away}`,
            league: event.league,
            marketType: 'Match Result',
            label: [event.home, 'Draw', event.away][index],
            selection: ['home', 'draw', 'away'][index],
            odds: odd,
        });
    };
    return (
        <article className="border-b border-[#33425a] bg-[#071226]">
            <div className="grid grid-cols-[1fr_180px]">
                <div className="min-w-0 p-3">
                    <div className="flex items-center text-[11px] text-[#68a1ff]"><span>{event.time}</span><span className="ml-auto"><StarButton /></span><b className="ml-1 rounded-[5px] bg-[#39f5ad] px-2 py-1 text-[10px] text-[#03150e]">+{event.more}</b></div>
                    <div className="no-scrollbar flex gap-1 overflow-hidden text-[10px] text-[#70a4f7]"><span className="rounded-full bg-[#102653] px-2 py-1">{event.region}</span><span className="truncate rounded-full bg-[#102653] px-2 py-1">{event.league}</span></div>
                    <div className="mt-3 space-y-2 text-[13px] font-bold"><p className="m-0 flex gap-2"><span>{event.emblems[0]}</span>{event.home}</p><p className="m-0 flex gap-2"><span>{event.emblems[1]}</span>{event.away}</p></div>
                </div>
                <div className="grid grid-cols-3 self-end overflow-hidden rounded-[9px] border border-[#2c3c56] bg-[#0e1b31]">
                    {event.odds[0].map((odd, index) => {
                        const marketId = `${event.id}-mobile-1x2-${index}`;
                        const selected = has(marketId);
                        return <button aria-pressed={selected} aria-label={`${[event.home, 'Draw', event.away][index]} at ${odd.toFixed(2)}`} className={`h-[49px] border-0 border-r border-[#2c3c56] bg-transparent text-[13px] font-bold text-white transition last:border-0 ${selected ? 'bg-[#174b3c] text-[#39f5ad]' : 'hover:bg-[#183458]'}`} onClick={() => selectOdd(odd, index)} type="button" key={odd}>{odd.toFixed(2)}</button>;
                    })}
                </div>
            </div>
        </article>
    );
}

export default function Sports() {
    const [activeMode, setActiveMode] = useState('prematch');
    return (
        <div className="min-h-screen bg-[#030810] text-white">
            <SportsControls activeMode={activeMode} setActiveMode={setActiveMode} />

            <section className="mt-3 px-4 xl:mt-[18px] xl:px-5">
                <div className="flex h-[47px] items-center justify-between">
                    <SectionTitle />
                    <button className="h-[42px] rounded-[19px] border-0 bg-[#39f5ad] px-4 text-[16px] font-bold text-[#03150e] transition hover:shadow-[0_0_24px_rgba(57,245,173,.25)] active:scale-95" type="button">View all</button>
                </div>
                <div className="no-scrollbar -mx-4 mt-2 flex gap-[18px] overflow-x-auto px-4 pb-2 xl:-mx-0 xl:px-0">
                    {TOP_EVENTS.map((event) => <TopEventCard event={event} key={event.id} />)}
                </div>
            </section>

            <section className="mt-2 xl:mt-[8px] xl:px-5">
                <div className="px-4 py-2 xl:px-0"><SectionTitle upcoming /></div>
                <div className="xl:hidden">
                    <div className="grid h-[46px] grid-cols-[1fr_54px_54px_54px] items-center border-b border-[#2c3c56] bg-[#10254a] px-3 text-[12px] font-bold"><span>Upcoming</span><span className="text-center">1</span><span className="text-center">X</span><span className="text-center">2</span></div>
                    {UPCOMING.map((event) => <MobileUpcomingCard event={event} key={event.id} />)}
                </div>
                <div className="hidden overflow-hidden rounded-[9px] xl:block">
                    <div className="grid h-[46px] grid-cols-[minmax(460px,1fr)_minmax(930px,1.45fr)] items-center bg-[#10254a] px-3 text-[12px] font-bold"><span>Upcoming</span><div className="grid grid-cols-12 text-center text-[#8bb2ff]"><span>1</span><span>X</span><span>2</span><span>O</span><span>Totals</span><span>U</span><span>Yes</span><span>BTS</span><span>No</span><span>1</span><span>AH</span><span>2</span></div></div>
                    {UPCOMING.map((event) => <UpcomingRow event={event} key={event.id} />)}
                </div>
            </section>
        </div>
    );
}
