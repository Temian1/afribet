import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import { THUMBS } from '../games/thumbnails';
import { BrandDiscord, BrandFacebook, BrandInstagram, BrandTelegram, BrandX } from '../components/Icons';
import { SportIcon, TeamCrest, UiIcon } from '../components/SportIcons';

const WINNERS = [
    ['Super Hot Tea...', '34k ETB', 'hot', '2', false],
    ['Goldenrace Lo...', '32.2k ETB', 'gold', '2', false],
    ['Queen of the ...', '30k ETB', 'queen', '2', false],
    ['Space Coins', '30k ETB', 'space', '2', false],
    ['Super Hot Tea...', '28.2k ETB', 'hot', '2', false],
    ['Hit the Gold!', '28k ETB', 'goldhit', '2', false],
    ['Goldenrace Lo...', '27.7k ETB', 'gold', '2', false],
    ['Bingo Star', '24.3k ETB', 'bingo', '4', true],
    ['Bingo Star', '24.2k ETB', 'bingo', '4', true],
    ['3 Coins', '23.9k ETB', 'coins', '2', true],
];

const SPORTS = [
    ['football', 'Football'],
    ['basketball', 'Basketball'],
    ['tennis', 'Tennis'],
    ['volleyball', 'Volleyball'],
    ['baseball', 'Baseball'],
    ['rugby', 'American Football'],
    ['cricket', 'Cricket'],
    ['boxing', 'Combat Sports'],
    ['rugby', 'Rugby League'],
];

const DESKTOP_MATCHES = [
    { time: '16:00', home: 'Kairat Almaty', away: 'AC Omonia Nicosia', odds: ['2.08', '3.26', '3.41'], more: '+137' },
    { time: '17:00', home: 'FK Kauno Zalgiris', away: 'Klaksvik', odds: ['1.72', '3.50', '4.70'], more: '+134' },
    { time: '18:00', home: 'Lech Poznan', away: 'AGF Aarhus', odds: ['1.61', '3.85', '5.03'], more: '+138', featured: true },
    { time: '18:30', home: 'CS U Craiova', away: 'Levski Sofia', odds: ['1.90', '3.39', '3.86'], more: '+135' },
    { time: '18:45', home: 'Hapoel Beer Sheva', away: 'Viking FK', odds: ['1.58', '3.64', '5.20'], more: '+128' },
];

const MOBILE_MATCHES = [
    {
        date: '13 Aug at 01:30',
        league: 'Test Series',
        home: 'Australia',
        away: 'Bangladesh',
        odds: ['1.08', '8.18', '20.20'],
        more: '+22',
    },
    {
        date: 'Today at 16:00',
        league: 'UEFA Champions League',
        home: 'Kairat Almaty',
        away: 'AC Omonia Nicosia',
        odds: ['2.08', '3.26', '3.41'],
        more: '+137',
    },
    {
        date: 'Today at 18:30',
        league: 'UEFA Conference League',
        home: 'CS U Craiova',
        away: 'Levski Sofia',
        odds: ['1.90', '3.39', '3.86'],
        more: '+135',
        featured: true,
    },
];

const CASINO_SECTIONS = [
    {
        title: 'Casino',
        games: [
            ['Spinz Roulette', 'roulette', true],
            ['Crash Kick', 'crash', true],
            ['Shaktimaan', 'blackjack', true],
            ['Magic Aladdin', 'slots', true],
            ['Joker Rush', 'coinflip', true],
            ['Just Jump', 'plinko', true],
        ],
    },
    {
        title: 'Live Casino',
        games: [
            ['Midnight Roulette', 'roulette', true],
            ['Replay Roulette', 'roulette', true],
            ['Cosmic Roulette', 'wheel', true],
            ['Golden Blackjack', 'blackjack', true],
            ['Lucky Dice', 'dice', true],
        ],
    },
    {
        title: 'Crash Games',
        games: [
            ['Helicrash', 'crash', true],
            ['Aviator', 'crash', true],
            ['Tiny Roulette', 'roulette', true],
            ['The Skyscraper', 'limbo', true],
            ['Chicken Road', 'mines', true],
        ],
    },
];

const ART_STYLES = {
    hot: 'from-[#ff375f] to-[#d500b6]',
    gold: 'from-[#17120b] to-[#4f2e00] text-[#ffd35b]',
    queen: 'from-[#ff315f] to-[#95186e] text-[#ffe0a0]',
    space: 'from-[#0967b0] to-[#eb00d7]',
    goldhit: 'from-[#d14c00] to-[#ff8d00] text-[#fff1b0]',
    bingo: 'from-[#a912a0] to-[#dc35cd]',
    coins: 'from-[#3b1800] to-[#a45b00] text-[#ffe376]',
};

const ART_LABELS = {
    hot: ['☕', 'SUPER HOT', 'TEAPOTS'],
    gold: ['♞', 'GOLDEN', 'RACE'],
    queen: ['♛', 'QUEEN', 'OF SUN'],
    space: ['777', 'SPACE', 'COINS'],
    goldhit: ['♜', 'HIT THE', 'GOLD'],
    bingo: ['★', 'BINGO', 'STAR'],
    coins: ['◉', '3 COINS', 'FORTUNE'],
};

function Brand({ compact = false }) {
    return (
        <span className="inline-flex items-center text-[#39f5ad]">
            <svg className={`${compact ? 'size-[18px]' : 'size-7'} shrink-0`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
                <path d="M16 3 20 10l8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1Z" fill="currentColor" fillOpacity=".9" />
                <circle cx="16" cy="16" r="4" fill="#071226" />
            </svg>
            <span className={`relative font-semibold leading-none tracking-[-1px] ${compact ? 'text-[21px]' : 'text-[31px]'}`}>
                AFRIBET
                <small className={`absolute right-0 font-extrabold tracking-normal ${compact ? 'top-[18px] text-[7px]' : 'top-[27px] text-[10px]'}`}>BET</small>
            </span>
        </span>
    );
}

function WinnerArt({ type }) {
    const [icon, first, second] = ART_LABELS[type];
    return (
        <div className={`flex h-[70px] w-[54px] shrink-0 flex-col items-center justify-center overflow-hidden rounded bg-gradient-to-br text-center text-white shadow-inner ${ART_STYLES[type]}`}>
            <b className="text-[20px] leading-none">{icon}</b>
            <span className="mt-1 text-[7px] font-black leading-none">{first}<br />{second}</span>
        </div>
    );
}

function WinnerRail() {
    return (
        <section
            className="order-2 mx-5 mt-10 flex h-[95px] gap-3 overflow-hidden rounded-lg border border-[#263752] bg-[#0b1528] p-[7px] xl:order-1 xl:mx-0 xl:mt-0 xl:h-[103px] xl:gap-3 xl:p-[10px_12px]"
            aria-label="Recent wins"
        >
            {WINNERS.map(([title, prize, type, stars, mobile], index) => (
                <article
                    className={`${mobile ? 'flex' : 'hidden'} h-[80px] min-w-[153px] items-center gap-2 overflow-hidden rounded-md bg-[#19243a] p-[5px] xl:flex`}
                    key={`${title}-${index}`}
                >
                    <WinnerArt type={type} />
                    <div className="flex min-w-0 flex-col gap-[3px] text-[10px] text-[#8bb2ee]">
                        <span className="flex items-center gap-1 truncate text-[9px] text-[#bdd1f2]"><UiIcon name="crown" className="size-3 shrink-0 text-[#ffb400]" />J.*******{stars}</span>
                        <span className="truncate">{title}</span>
                        <strong className="text-[11px] text-[#39f5ad]">{prize}</strong>
                    </div>
                </article>
            ))}
        </section>
    );
}

function MatchCard({ match, mobile = false }) {
    const { toggle, has } = useBetSlip();
    const labels = mobile ? ['1', 'X', '2'] : ['1', 'X', '2'];
    const eventId = `home-${match.home}-${match.away}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const selectOdd = (odd, index) => {
        const marketId = `${eventId}-1x2-${index}`;
        toggle({
            marketId,
            eventId,
            eventName: `${match.home} vs ${match.away}`,
            league: match.league || 'UEFA Champions League Qualifying',
            marketType: 'Match Result',
            label: [match.home, 'Draw', match.away][index],
            selection: ['home', 'draw', 'away'][index],
            odds: Number(odd),
        });
    };
    return (
        <article className={`${mobile ? 'w-[276px] p-[14px_14px_13px] sm:w-[318px]' : 'min-h-[243px] w-[360px] p-[19px_18px_17px]'} shrink-0 rounded-[9px] ${match.featured ? 'bg-[#102445]' : 'bg-[#071328]'}`}>
            <div className="flex justify-between">
                <div className="flex min-w-0 flex-col">
                    <b className="text-[12px] text-[#edf2fb] xl:text-[13px]">{mobile ? match.date : `Today at ${match.time}`}</b>
                    <span className={`mt-0.5 truncate text-[10px] text-[#7ea9ec] xl:text-[11px] ${mobile ? '' : 'whitespace-nowrap'}`}>
                        {mobile ? match.league : 'Football  •  UEFA Champions League Qualifying'}
                    </span>
                </div>
                <button className="grid size-7 shrink-0 place-items-center border-0 bg-transparent text-white transition hover:scale-110 hover:text-[#39f5ad]" type="button" aria-label="Add match to favorites">
                    <UiIcon name="star" className={mobile ? 'size-[18px]' : 'size-5'} />
                </button>
            </div>
            <div className={mobile ? 'mt-3' : 'mt-[17px]'}>
                {[match.home, match.away].map((team) => (
                    <p className={`${mobile ? 'h-7 gap-2.5' : 'h-8 gap-3'} m-0 flex min-w-0 items-center`} key={team}>
                        <TeamCrest name={team} className={mobile ? 'size-[22px]' : 'size-6'} />
                        <b className="truncate text-[15px] text-[#f0f2f7] xl:text-[17px]">{team}</b>
                    </p>
                ))}
            </div>
            <div className={`${mobile ? 'mt-1.5' : 'mt-2'} flex items-center justify-between text-[12px] text-[#7ea9ec] xl:text-[13px]`}>
                <span>Match Result</span>
                <span className="flex items-center gap-2.5 text-[#96bbf5]">
                    <UiIcon name="chevronRight" className="size-3 rotate-180" />{mobile ? '1/3' : '1/5'}<UiIcon name="chevronRight" className="size-3" />
                </span>
            </div>
            <div className={`${mobile ? 'mt-2 grid-cols-[repeat(3,minmax(0,1fr))_54px] gap-1.5' : 'mt-[9px] grid-cols-[repeat(3,minmax(0,1fr))_67px] gap-[7px]'} grid`}>
                {match.odds.map((odd, index) => (
                    <button aria-pressed={has(`${eventId}-1x2-${index}`)} aria-label={`${[match.home, 'Draw', match.away][index]} at ${odd}`} className={`${mobile ? 'h-[42px]' : 'h-[50px]'} flex flex-col items-center justify-center rounded-[9px] border border-transparent bg-[#0b1931] transition hover:border-[#39f5ad]/50 ${has(`${eventId}-1x2-${index}`) ? 'border-[#39f5ad] bg-[#174b3c] shadow-[0_0_0_1px_rgba(57,245,173,.2)]' : ''}`} onClick={() => selectOdd(odd, index)} type="button" key={odd}>
                        <small className="text-[10px] text-[#6686b7]">{labels[index]}</small>
                        <b className={`mt-1 text-[14px] xl:text-[15px] ${has(`${eventId}-1x2-${index}`) ? 'text-[#39f5ad]' : 'text-white xl:text-[#768195]'}`}>{odd}</b>
                    </button>
                ))}
                <button className={`${mobile ? 'h-[42px]' : 'h-[50px]'} rounded-[9px] border-0 bg-[#39f5ad] text-[13px] font-extrabold text-[#061810] xl:text-sm`} type="button">{match.more}</button>
            </div>
        </article>
    );
}

function CasinoCard({ game, index, onOpen }) {
    const [name, art, mobile] = game;
    return (
        <button
            className={`${mobile ? 'block' : 'hidden xl:block'} group relative h-[172px] min-w-[125px] overflow-hidden rounded-[7px] border border-[#263755] bg-[#101c31] p-0 text-left transition duration-200 active:scale-[.98] xl:h-[214px] xl:min-w-[151px] xl:rounded-[9px]`}
            type="button"
            onClick={() => onOpen(art)}
        >
            <span className={`absolute inset-0 block ${index % 3 === 1 ? 'hue-rotate-15 saturate-125' : index % 3 === 2 ? '-hue-rotate-15 saturate-150' : ''}`}>
                {THUMBS[art]}
            </span>
            <span className="absolute right-1.5 top-1.5 z-[2] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.9)]"><UiIcon name="star" className="size-5" /></span>
            <span className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-[#020810] to-transparent px-2.5 pb-2.5 pt-6 text-[12px] font-extrabold text-white [text-shadow:0_1px_2px_#000] xl:text-[13px]">
                {name}
            </span>
        </button>
    );
}

function SectionControls({ label, onViewAll }) {
    return (
        <div className="flex gap-1.5 xl:gap-[5px]">
            <button className="grid size-8 place-items-center rounded-full border-0 bg-[#10203b] text-white transition hover:bg-[#17304f] active:scale-90 xl:size-[42px]" type="button" aria-label={`Previous ${label}`}><UiIcon name="chevronRight" className="size-4 rotate-180 xl:size-5" /></button>
            <button className="grid size-8 place-items-center rounded-full border-0 bg-[#10203b] text-white transition hover:bg-[#17304f] active:scale-90 xl:size-[42px]" type="button" aria-label={`Next ${label}`}><UiIcon name="chevronRight" className="size-4 xl:size-5" /></button>
            <button className="h-8 min-w-[70px] rounded-[15px] border-0 bg-[#39f5ad] px-2 text-[13px] font-bold text-[#03150e] transition active:scale-95 xl:h-[42px] xl:min-w-[82px] xl:rounded-[19px] xl:px-3 xl:text-base" onClick={onViewAll} type="button">View all</button>
        </div>
    );
}

function CasinoRailSection({ section, onOpen, onViewAll, orderClass = '' }) {
    return (
        <section className={`${orderClass} mx-1 mt-5 xl:mx-0 xl:mt-[23px]`}>
            <div className="flex h-9 items-start justify-between xl:h-[61px]">
                <h2 className="m-0 text-[18px] font-extrabold text-white xl:text-[22px] xl:tracking-[-.4px]">{section.title}</h2>
                <SectionControls label={section.title} onViewAll={onViewAll} />
            </div>
            <div className="no-scrollbar -mx-1 flex h-[178px] gap-1.5 overflow-x-auto px-1 pb-1 xl:mx-0 xl:h-[220px] xl:gap-2.5 xl:overflow-hidden xl:px-0">
                {section.games.map((game, index) => <CasinoCard game={game} index={index} onOpen={onOpen} key={`${section.title}-${game[0]}`} />)}
            </div>
        </section>
    );
}

function HomeFooter({ go }) {
    const socials = [
        ['X', BrandX],
        ['Facebook', BrandFacebook],
        ['Instagram', BrandInstagram],
        ['Telegram', BrandTelegram],
        ['Discord', BrandDiscord],
    ];
    return (
        <footer className="order-6 mx-1 mt-8 border-t border-[#263752] pb-8 pt-5 text-[#8fb0df] xl:mx-0 xl:mt-10">
            <div className="flex items-center justify-between gap-4">
                <Brand compact />
                <div className="flex gap-2">
                    {socials.map(([label, Icon]) => (
                        <a className="grid size-8 place-items-center rounded-full bg-[#10203b] text-white transition hover:bg-[#39f5ad] hover:text-[#03150e]" href="#" aria-label={label} key={label}>
                            <Icon size={15} />
                        </a>
                    ))}
                </div>
            </div>
            <p className="mt-4 max-w-md text-[12px] leading-relaxed">
                Afribet brings sports, casino, live games and instant rewards into one fast betting platform.
            </p>
            <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-bold text-white" aria-label="Footer links">
                <button className="border-0 bg-transparent p-0 text-inherit" onClick={() => go('promotions')} type="button">About</button>
                <button className="border-0 bg-transparent p-0 text-inherit" onClick={() => go('support')} type="button">Support</button>
                <button className="border-0 bg-transparent p-0 text-inherit" onClick={() => go('sports')} type="button">Sports</button>
                <button className="border-0 bg-transparent p-0 text-inherit" onClick={() => go('casino')} type="button">Casino</button>
            </nav>
        </footer>
    );
}

export default function Home() {
    const { setPage, setCurrentGame } = useApp();
    const [activeSport, setActiveSport] = useState('Football');

    const go = (page) => setPage(page);
    const openGame = (id) => {
        setCurrentGame(id);
        setPage('game');
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#030810] pb-[63px] text-white xl:pb-0">
            <main className="flex min-h-screen flex-col xl:px-[23px] xl:pb-7 xl:pt-[68px]">
                <WinnerRail />

                <section className="order-1 mx-5 mt-[27px] xl:order-2 xl:mx-0 xl:mt-[59px]">
                    <div className="flex h-[44px] items-start justify-between xl:h-[42px]">
                        <h1 className="m-0 text-[18px] font-extrabold text-white xl:text-[22px] xl:tracking-[-.4px]">Top Events</h1>
                        <button className="h-[40px] min-w-[76px] rounded-[17px] border-0 bg-[#39f5ad] px-2.5 text-[14px] font-bold text-[#03150e] xl:h-[42px] xl:min-w-[82px] xl:px-3 xl:text-base" onClick={() => go('sports')} type="button">View all</button>
                    </div>
                    <div className="no-scrollbar flex h-[60px] items-start gap-3 overflow-x-auto xl:h-[58px] xl:gap-[5px]">
                        {SPORTS.map(([icon, name]) => (
                            <button className={`flex h-[40px] shrink-0 items-center gap-1.5 rounded-[18px] border-0 bg-transparent px-2 text-[14px] font-bold text-[#e4e7eb] transition xl:h-[43px] xl:text-base ${activeSport === name ? 'bg-[#39f5ad] px-3 text-[#02140d]' : 'hover:text-white'}`} onClick={() => setActiveSport(name)} type="button" key={name} aria-pressed={activeSport === name}>
                                <SportIcon type={icon} className="size-6 shrink-0" />{name}
                            </button>
                        ))}
                    </div>
                    <div className="overflow-hidden">
                        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 xl:hidden">
                            {MOBILE_MATCHES.map((match) => <MatchCard match={match} mobile key={`${match.date}-${match.home}`} />)}
                        </div>
                        <div className="hidden gap-[17px] xl:flex">
                            {DESKTOP_MATCHES.map((match) => <MatchCard match={match} key={`${match.time}-${match.home}`} />)}
                        </div>
                    </div>
                </section>

                {CASINO_SECTIONS.map((section, index) => (
                    <CasinoRailSection section={section} onOpen={openGame} onViewAll={() => go('casino')} orderClass={['order-3', 'order-4', 'order-5'][index]} key={section.title} />
                ))}

                <HomeFooter go={go} />
            </main>
        </div>
    );
}
