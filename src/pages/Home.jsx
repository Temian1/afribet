import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { THUMBS } from '../games/thumbnails';
import AuthModal from '../components/AuthModal';
import { BrandDiscord, BrandFacebook, BrandInstagram, BrandTelegram, BrandX } from '../components/Icons';

const SIDEBAR_ITEMS = [
    ['home', 'Home', 'home'],
    ['sports', 'Today', 'calendar'],
    ['sports', 'Live', 'video'],
    ['sports', 'Live Results', 'score'],
    ['casino', 'Live Casino', 'casino'],
    ['sports', 'Virtual Sports', 'headset'],
    ['game', 'Crash Games', 'crash'],
    ['promotions', 'Promotions', 'gift'],
];

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
    ['⚽', 'Football'],
    ['🏀', 'Basketball'],
    ['◒', 'Tennis'],
    ['◉', 'Volleyball'],
    ['⚾', 'Baseball'],
    ['🏈', 'American Football'],
    ['🏏', 'Cricket'],
    ['🥊', 'Combat Sports'],
    ['◒', 'Rugby League'],
];

const DESKTOP_MATCHES = [
    { time: '16:00', home: 'Kairat Almaty', away: 'AC Omonia Nicosia', marks: ['◆', '◉'], odds: ['2.08', '3.26', '3.41'], more: '+137' },
    { time: '17:00', home: 'FK Kauno Zalgiris', away: 'Klaksvik', marks: ['♜', '♢'], odds: ['1.72', '3.50', '4.70'], more: '+134' },
    { time: '18:00', home: 'Lech Poznan', away: 'AGF Aarhus', marks: ['♜', '♜'], odds: ['1.61', '3.85', '5.03'], more: '+138', featured: true },
    { time: '18:30', home: 'CS U Craiova', away: 'Levski Sofia', marks: ['♙', '▲'], odds: ['1.90', '3.39', '3.86'], more: '+135' },
    { time: '18:45', home: 'Hapoel Beer Sheva', away: 'Viking FK', marks: ['⊕', '♜'], odds: ['1.58', '3.64', '5.20'], more: '+128' },
];

const MOBILE_MATCHES = [
    {
        date: '13 Aug at 01:30',
        league: 'Test Series',
        home: 'Australia',
        away: 'Bangladesh',
        marks: ['🇦🇺', '●'],
        odds: ['1.08', '8.18', '20.20'],
        more: '+22',
    },
    {
        date: 'Today at 16:00',
        league: 'UEFA Champions League',
        home: 'Kairat Almaty',
        away: 'AC Omonia Nicosia',
        marks: ['◆', '◉'],
        odds: ['2.08', '3.26', '3.41'],
        more: '+137',
    },
    {
        date: 'Today at 18:30',
        league: 'UEFA Conference League',
        home: 'CS U Craiova',
        away: 'Levski Sofia',
        marks: ['♙', '▲'],
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

function Glyph({ name, className = '' }) {
    const paths = {
        home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
        calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 15l2 2 5-5" /></>,
        video: <><rect x="3" y="6" width="14" height="12" rx="2" /><path d="m17 10 4-2v8l-4-2z" /></>,
        score: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 13h3v4H8zM15 13h1" /></>,
        casino: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="m12 3 1.5 6M20 8l-5 3M18 18l-5-4M6 19l4-5M4 8l6 3" /></>,
        headset: <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="12" width="4" height="7" rx="2" /><rect x="17" y="12" width="4" height="7" rx="2" /></>,
        crash: <><path d="M12 3c3 2 5 5 5 9l-5 5-5-5c0-4 2-7 5-9Z" /><path d="M9 16 6 21M15 16l3 5M12 7h.01" /></>,
        gift: <><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M12 9v12M3 13h18M12 9H8a3 3 0 1 1 4-3Zm0 0h4a3 3 0 1 0-4-3Z" /></>,
    };
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths[name]}
        </svg>
    );
}

function Brand({ compact = false }) {
    return (
        <span className="inline-flex items-center text-[#39f5ad]">
            <span className={`${compact ? 'text-lg' : 'text-[27px]'} -mr-1.5 inline-block w-4 overflow-hidden leading-none`}>◉</span>
            <span className={`relative font-semibold leading-none tracking-[-2px] ${compact ? 'text-[21px]' : 'text-[31px]'}`}>
                AQUAISH
                <small className={`absolute right-0 font-extrabold tracking-normal ${compact ? 'top-[18px] text-[7px]' : 'top-[27px] text-[10px]'}`}>BET</small>
            </span>
        </span>
    );
}

function RewardWheel() {
    return (
        <button
            className="grid size-[42px] shrink-0 place-items-center rounded-full border-[5px] border-[#ffb400] bg-[conic-gradient(#ef3340_0_12.5%,#f8fafc_0_25%,#3b9bea_0_37.5%,#f8fafc_0_50%,#ef3340_0_62.5%,#f8fafc_0_75%,#3b9bea_0_87.5%,#f8fafc_0)] text-sm text-amber-500 shadow-[inset_0_0_0_2px_white]"
            type="button"
            aria-label="Spin rewards wheel"
        >
            ◉
        </button>
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
                        <span className="truncate text-[9px] text-[#bdd1f2]">♛ J.*******{stars}</span>
                        <span className="truncate">{title}</span>
                        <strong className="text-[11px] text-[#39f5ad]">{prize}</strong>
                    </div>
                </article>
            ))}
        </section>
    );
}

function MatchCard({ match, mobile = false }) {
    const labels = mobile ? ['1', 'X', '2'] : ['1', 'X', '2'];
    return (
        <article className={`${mobile ? 'h-[204px] w-[318px] p-[14px_14px_13px]' : 'h-[243px] w-[360px] p-[19px_18px_17px]'} shrink-0 rounded-[9px] ${match.featured ? 'bg-[#102445]' : 'bg-[#071328]'}`}>
            <div className="flex justify-between">
                <div className="flex min-w-0 flex-col">
                    <b className="text-[12px] text-[#edf2fb] xl:text-[13px]">{mobile ? match.date : `Today at ${match.time}`}</b>
                    <span className={`mt-0.5 truncate text-[10px] text-[#7ea9ec] xl:text-[11px] ${mobile ? '' : 'whitespace-nowrap'}`}>
                        {mobile ? match.league : 'Football  •  UEFA Champions League Qualifying'}
                    </span>
                </div>
                <button className={`border-0 bg-transparent leading-none text-white ${mobile ? 'text-[22px]' : 'text-[25px]'}`} type="button" aria-label="Add match to favorites">☆</button>
            </div>
            <div className={mobile ? 'mt-3' : 'mt-[17px]'}>
                {[match.home, match.away].map((team, index) => (
                    <p className={`${mobile ? 'h-7 gap-2.5' : 'h-8 gap-3'} m-0 flex items-center`} key={team}>
                        <i className={`grid ${mobile ? 'size-[22px] text-[12px]' : 'size-6 text-[13px]'} place-items-center rounded-full bg-[#e9f1f6] font-black not-italic ${mobile && index === 1 ? 'bg-[#18b97c] text-[#ef315a]' : index === 0 ? 'text-[#92710a]' : 'text-[#153463]'}`}>
                            {match.marks[index]}
                        </i>
                        <b className="truncate text-[15px] text-[#f0f2f7] xl:text-[17px]">{team}</b>
                    </p>
                ))}
            </div>
            <div className={`${mobile ? 'mt-1.5' : 'mt-2'} flex items-center justify-between text-[12px] text-[#7ea9ec] xl:text-[13px]`}>
                <span>Match Result</span>
                <span className="text-sm text-[#96bbf5] xl:text-base">‹ &nbsp; {mobile ? '1/3' : '1/5'} &nbsp; ›</span>
            </div>
            <div className={`${mobile ? 'mt-2 grid-cols-[repeat(3,1fr)_58px] gap-1.5' : 'mt-[9px] grid-cols-[repeat(3,1fr)_67px] gap-[7px]'} grid`}>
                {match.odds.map((odd, index) => (
                    <button className={`${mobile ? 'h-[42px]' : 'h-[50px]'} flex flex-col items-center justify-center rounded-[9px] border-0 bg-[#0b1931]`} type="button" key={odd}>
                        <small className="text-[10px] text-[#6686b7]">{labels[index]}</small>
                        <b className="mt-1 text-[14px] text-white xl:text-[15px] xl:text-[#768195]">{odd}</b>
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
            <span className="absolute right-1.5 top-1.5 z-[2] text-[25px] leading-none text-white [text-shadow:0_1px_4px_#000]">☆</span>
            <span className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-[#020810] to-transparent px-2.5 pb-2.5 pt-6 text-[12px] font-extrabold text-white [text-shadow:0_1px_2px_#000] xl:text-[13px]">
                {name}
            </span>
        </button>
    );
}

function SectionControls({ label, onViewAll }) {
    return (
        <div className="flex gap-1.5 xl:gap-[5px]">
            <button className="grid size-8 place-items-center rounded-full border-0 bg-[#10203b] text-[18px] text-white transition active:scale-90 xl:size-[42px] xl:text-[25px]" type="button" aria-label={`Previous ${label}`}>‹</button>
            <button className="grid size-8 place-items-center rounded-full border-0 bg-[#10203b] text-[18px] text-white transition active:scale-90 xl:size-[42px] xl:text-[25px]" type="button" aria-label={`Next ${label}`}>›</button>
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
                Aquaish Bet brings sports, casino, live games and instant rewards into one fast betting platform.
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

function MobileHeader({ user, go, openAuth }) {
    return (
        <header className="xl:hidden">
            <div className="flex h-[61px] items-center bg-[#071226] px-3">
                <Brand compact />
                <button className="ml-1 grid size-[43px] shrink-0 place-items-center rounded-[19px] border-0 bg-[#111d34] text-[26px] text-white" type="button" aria-label="Search">⌕</button>
                <div className="ml-auto flex items-center gap-1">
                    <RewardWheel />
                    {user ? (
                        <button className="h-[42px] rounded-[18px] border-0 bg-[#39f5ad] px-3 font-bold text-[#03150e]" onClick={() => go('profile')} type="button">Account</button>
                    ) : (
                        <>
                            <button className="h-[42px] rounded-[18px] border-0 bg-white px-2.5 text-[15px] font-bold text-[#0e1116]" onClick={() => openAuth('login')} type="button">Sign in</button>
                            <button className="h-[42px] rounded-[18px] border-0 bg-[#39f5ad] px-2.5 text-[15px] font-bold text-[#03150e]" onClick={() => openAuth('register')} type="button">Sign up</button>
                        </>
                    )}
                </div>
            </div>
            <nav className="no-scrollbar flex h-12 gap-2 overflow-x-auto bg-[#071226] px-3 pb-1" aria-label="Game categories">
                <button className="flex h-11 min-w-[98px] items-center justify-center gap-2 rounded-[20px] border-0 bg-[#18aa58] text-[12px] font-black uppercase text-white" onClick={() => go('sports')} type="button">⚽ Sports</button>
                <button className="flex h-11 min-w-[98px] items-center justify-center gap-2 rounded-[20px] border-0 bg-[#b85118] text-[12px] font-black uppercase text-white" onClick={() => go('casino')} type="button">▤ Slots</button>
                <button className="flex h-11 min-w-[129px] items-center justify-center gap-2 rounded-[20px] border-0 bg-gradient-to-r from-[#8d2700] to-[#3e150e] text-[11px] font-black uppercase text-white" onClick={() => go('casino')} type="button">⚄ Live Casino</button>
                <button className="grid size-11 min-w-11 place-items-center rounded-[18px] border-0 bg-[#39f5ad] text-[23px] text-[#02140d]" type="button" aria-label="All categories">⌘</button>
            </nav>
        </header>
    );
}

function DesktopChrome({ theme, setTheme, user, go, openAuth }) {
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-[264px] flex-col bg-[#071327] xl:flex">
                <div className="flex h-[74px] shrink-0 items-center gap-2.5 bg-[#071226] px-[9px]">
                    <button className="grid size-[45px] place-items-center rounded-[20px] border-0 bg-[#111d34] text-2xl text-white" type="button" aria-label="Open menu">☷</button>
                    <Brand />
                </div>
                <div className="flex h-[70px] shrink-0 items-start gap-[7px] px-2 pt-[9px]">
                    <button className="flex h-11 items-center gap-2 rounded-r-[22px] border-0 bg-[#183468] pr-[15px] font-bold text-white" onClick={() => go('sports')} type="button"><span className="grid size-11 place-items-center rounded-full bg-slate-300 text-2xl">⚽</span>Sports</button>
                    <button className="flex h-11 items-center gap-2 rounded-r-[22px] border-0 bg-[#183468] pr-[15px] font-bold text-white" onClick={() => go('casino')} type="button"><span className="grid size-11 place-items-center rounded-full bg-[#222] text-2xl">⚄</span>Casino</button>
                </div>
                <nav className="mx-2 mt-[7px] rounded-[9px] bg-[#192338] p-[9px]" aria-label="Desktop navigation">
                    {SIDEBAR_ITEMS.map(([page, label, icon], index) => (
                        <button className={`flex h-[55px] w-full items-center gap-[19px] rounded-lg border-0 px-[15px] text-left text-[15px] font-semibold ${index === 0 ? 'bg-[#071327] text-[#39f5ad]' : 'bg-transparent text-[#78a4ff]'}`} onClick={() => go(page)} type="button" key={label}>
                            <Glyph className="size-[27px] shrink-0" name={icon} /><span>{label}</span>
                        </button>
                    ))}
                </nav>
                <div className="mx-2 mb-2 mt-auto grid grid-cols-2 gap-1 rounded-[9px] bg-[#111d34] p-[9px]">
                    <button className={`h-[41px] rounded-lg border-0 font-bold ${theme === 'dark' ? 'bg-[#193669] text-white' : 'bg-transparent text-[#88a8df]'}`} onClick={() => setTheme('dark')} type="button">◕ Dark</button>
                    <button className={`h-[41px] rounded-lg border-0 font-bold ${theme === 'light' ? 'bg-[#193669] text-white' : 'bg-transparent text-[#88a8df]'}`} onClick={() => setTheme('light')} type="button">☀ Light</button>
                </div>
            </aside>
            <header className="fixed inset-x-0 top-0 z-40 ml-[264px] hidden h-[74px] items-center justify-between bg-[#071226] px-[23px] xl:flex">
                <button className="grid size-[45px] place-items-center rounded-[20px] border-0 bg-[#111d34] font-serif text-[32px] text-white" type="button" aria-label="Search">⌕</button>
                <div className="flex items-center gap-[9px]">
                    <RewardWheel />
                    {user ? (
                        <button className="h-[45px] rounded-[18px] border-0 bg-[#39f5ad] px-4 font-bold text-[#03150e]" onClick={() => go('profile')} type="button">My account</button>
                    ) : (
                        <>
                            <button className="h-[45px] rounded-[18px] border-0 bg-white px-[17px] font-bold text-[#0f1115]" onClick={() => openAuth('login')} type="button">Sign in</button>
                            <button className="h-[45px] rounded-[18px] border-0 bg-[#39f5ad] px-[17px] font-bold text-[#03150e]" onClick={() => openAuth('register')} type="button">Sign up</button>
                        </>
                    )}
                    <button className="h-[45px] w-[41px] rounded-l-[20px] border border-[#52637d] bg-[#122037] text-xl" type="button" aria-label="Language">🇬🇧</button>
                    <button className="-ml-2.5 h-[45px] w-[41px] rounded-r-[20px] border border-l-0 border-[#52637d] bg-[#122037] text-xl text-[#39f5ad]" type="button" aria-label="Settings">⚙</button>
                </div>
            </header>
        </>
    );
}

function BottomNav({ go }) {
    const items = [
        ['⌂', 'Home', 'home'],
        ['➤', 'Crash', 'game'],
        ['▤', 'Bet slip', 'mybets'],
        ['⚽', 'Sports', 'sports'],
        ['⌁', 'Live', 'sports'],
        ['☰', 'Menu', 'profile'],
    ];
    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[63px] grid-cols-6 border-t-2 border-[#263751] bg-[#071226] xl:hidden" aria-label="Bottom navigation">
            {items.map(([icon, label, page], index) => (
                <button className={`relative flex flex-col items-center justify-center gap-0.5 border-0 bg-transparent text-[11px] font-bold ${index === 0 ? 'text-[#39f5ad]' : 'text-white'}`} onClick={() => go(page)} type="button" key={label}>
                    <span className="text-[23px] leading-none">{icon}</span>
                    {label}
                    {label === 'Bet slip' ? <i className="absolute left-1/2 top-1 h-4 min-w-4 rounded-full bg-[#f03e52] px-1 text-[10px] not-italic text-white">0</i> : null}
                </button>
            ))}
        </nav>
    );
}

export default function Home({ embedded = false }) {
    const { setPage, setCurrentGame } = useApp();
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [auth, setAuth] = useState({ open: false, mode: 'login' });
    const [activeSport, setActiveSport] = useState('Football');

    const go = (page) => setPage(page);
    const openAuth = (mode) => setAuth({ open: true, mode });
    const openGame = (id) => {
        setCurrentGame(id);
        setPage('game');
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#030810] pb-[63px] text-white xl:pb-0">
            {embedded ? null : <MobileHeader user={user} go={go} openAuth={openAuth} />}
            {embedded ? null : <DesktopChrome theme={theme} setTheme={setTheme} user={user} go={go} openAuth={openAuth} />}

            <main className={`flex min-h-screen flex-col xl:px-[23px] xl:pb-7 ${embedded ? 'xl:pt-[68px]' : 'xl:ml-[264px] xl:pt-[142px]'}`}>
                <WinnerRail />

                <section className="order-1 mx-5 mt-[27px] xl:order-2 xl:mx-0 xl:mt-[59px]">
                    <div className="flex h-[44px] items-start justify-between xl:h-[42px]">
                        <h1 className="m-0 text-[18px] font-extrabold text-white xl:text-[22px] xl:tracking-[-.4px]">Top Events</h1>
                        <button className="h-[40px] min-w-[76px] rounded-[17px] border-0 bg-[#39f5ad] px-2.5 text-[14px] font-bold text-[#03150e] xl:h-[42px] xl:min-w-[82px] xl:px-3 xl:text-base" onClick={() => go('sports')} type="button">View all</button>
                    </div>
                    <div className="no-scrollbar flex h-[60px] items-start gap-3 overflow-x-auto xl:h-[58px] xl:gap-[5px]">
                        {SPORTS.map(([icon, name]) => (
                            <button className={`flex h-[40px] shrink-0 items-center gap-1 rounded-[18px] border-0 bg-transparent px-1.5 text-[15px] font-bold text-[#e4e7eb] xl:h-[43px] xl:px-2 xl:text-base ${activeSport === name ? 'xl:bg-[#39f5ad] xl:px-3 xl:text-[#02140d]' : ''}`} onClick={() => setActiveSport(name)} type="button" key={name}>
                                <span className="text-[22px] grayscale brightness-[2.2] xl:text-2xl">{icon}</span>{name}
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

            {embedded ? null : <BottomNav go={go} />}
            {embedded ? null : <AuthModal open={auth.open} initialMode={auth.mode} onClose={() => setAuth((current) => ({ ...current, open: false }))} />}
        </div>
    );
}
