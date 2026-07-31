// Single source of truth for the demo sports feed. The events list, the event
// show page and the global search all read from here so ids stay consistent.

export const SPORTS = [
    ['football', 914], ['basketball', 11], ['tennis', 257], ['hockey', 77],
    ['volleyball', 11], ['boxing', 56], ['baseball', 16], ['handball', 6],
    ['golf', 3], ['rugby', 11], ['pool', 1], ['soccer', 92], ['chess', 3],
    ['racing', 1], ['cricket', 576], ['badminton', 10], ['table', 19],
];

export const LEAGUES = [
    ['popular', 'Popular'],
    ['champions', 'UEFA Champions League Qualifying'],
    ['europa', 'UEFA Europa League Qualification'],
    ['conference', 'UEFA Conference League Qualification'],
    ['premier', 'Premier League'],
    ['laliga', 'La Liga'],
    ['seriea', 'Serie A'],
    ['ligue1', 'Ligue 1'],
];

export const TOP_EVENTS = [
    { id: 'top-1', sport: 'football', region: 'Europe', time: 'Today at 16:00', league: 'UEFA Champions League Qualifying', home: 'Kairat Almaty', away: 'AC Omonia Nicosia', odds: [2.11, 3.10, 3.53], more: 150 },
    { id: 'top-2', sport: 'football', region: 'Europe', time: 'Today at 17:00', league: 'UEFA Champions League Qualifying', home: 'FK Kauno Zalgiris', away: 'Klaksvik', odds: [1.71, 3.43, 4.86], more: 134 },
    { id: 'top-3', sport: 'football', region: 'Europe', time: 'Today at 18:00', league: 'UEFA Champions League Qualifying', home: 'Lech Poznan', away: 'AGF Aarhus', odds: [1.72, 3.79, 4.24], more: 153 },
    { id: 'top-4', sport: 'football', region: 'Europe', time: 'Today at 18:30', league: 'UEFA Champions League Qualifying', home: 'CS U Craiova', away: 'Levski Sofia', odds: [1.96, 3.31, 3.72], more: 134 },
];

export const UPCOMING = [
    { id: 'up-1', sport: 'football', region: 'Europe', league: 'UEFA Conference League Qualification', time: 'Today at 15:30', home: 'Dukagjini FK', away: 'Lugano', more: 120, odds: [5.93, 4.52, 1.45], markets: [[5.93, 4.52, 1.45], [1.70, '+2.5-', 2.03], [1.83, '–', 1.84], [1.99, '+1-', 1.73]] },
    { id: 'up-2', sport: 'football', region: 'Russia', league: 'Russia Cup', time: 'Today at 15:30', home: 'Moskovskaya Zastava-Kristall', away: 'Krasnoe Znamya Noginsk', more: 68, odds: [6.43, 4.04, 1.48], markets: [[6.43, 4.04, 1.48], [1.76, '+3.5-', 1.95], [1.41, '–', 2.52], [2.08, '+1-', 1.66]] },
    { id: 'up-3', sport: 'football', region: 'World', league: 'Club Friendly Games', time: 'Today at 16:00', home: 'Riga FC', away: 'Suduva', more: 84, odds: [1.62, 3.78, 4.80], markets: [[1.62, 3.78, 4.80], [1.85, '+2.5-', 1.88], [1.74, '–', 1.96], [1.51, '-1+', 2.31]] },
];

export const MARKET_META = [
    { type: 'Match Result', heads: ['1', 'X', '2'], labels: ['Home', 'Draw', 'Away'] },
    { type: 'Total Goals', heads: ['O', 'Totals', 'U'], labels: ['Over', 'Line', 'Under'] },
    { type: 'Both Teams to Score', heads: ['Yes', 'BTS', 'No'], labels: ['Yes', 'Market', 'No'] },
    { type: 'Asian Handicap', heads: ['1', 'AH', '2'], labels: ['Home', 'Line', 'Away'] },
];

export const ALL_EVENTS = [...TOP_EVENTS, ...UPCOMING];

export function findEvent(id) {
    return ALL_EVENTS.find((event) => event.id === id) ?? null;
}

/* Deterministic pseudo-random so a given event always renders the same book. */
function seeded(seed) {
    let value = 0;
    for (const character of seed) value = (value * 31 + character.charCodeAt(0)) >>> 0;
    return () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 4294967296;
    };
}

function price(random, low, high) {
    return Number((low + random() * (high - low)).toFixed(2));
}

/**
 * Expands an event's headline odds into the full market board shown on the
 * event page. Derived rather than hand-authored so every event has depth.
 */
export function buildMarkets(event) {
    const random = seeded(event.id);
    const [home, draw, away] = event.odds;

    return [
        {
            id: 'result',
            name: 'Match Result',
            group: 'popular',
            selections: [
                { key: '1', label: event.home, odds: home },
                { key: 'X', label: 'Draw', odds: draw },
                { key: '2', label: event.away, odds: away },
            ],
        },
        {
            id: 'double-chance',
            name: 'Double Chance',
            group: 'popular',
            selections: [
                { key: '1X', label: `${event.home} or Draw`, odds: price(random, 1.15, 1.55) },
                { key: '12', label: 'Home or Away', odds: price(random, 1.2, 1.5) },
                { key: 'X2', label: `Draw or ${event.away}`, odds: price(random, 1.3, 2.1) },
            ],
        },
        {
            id: 'btts',
            name: 'Both Teams to Score',
            group: 'popular',
            selections: [
                { key: 'yes', label: 'Yes', odds: price(random, 1.55, 2.05) },
                { key: 'no', label: 'No', odds: price(random, 1.6, 2.2) },
            ],
        },
        {
            id: 'totals',
            name: 'Total Goals',
            group: 'goals',
            selections: [1.5, 2.5, 3.5].flatMap((line) => [
                { key: `o${line}`, label: `Over ${line}`, odds: price(random, 1.25, 2.9) },
                { key: `u${line}`, label: `Under ${line}`, odds: price(random, 1.3, 3.1) },
            ]),
        },
        {
            id: 'team-totals',
            name: 'Team Totals',
            group: 'goals',
            selections: [
                { key: 'h-o1', label: `${event.home} Over 1.5`, odds: price(random, 1.7, 2.8) },
                { key: 'h-u1', label: `${event.home} Under 1.5`, odds: price(random, 1.4, 2.2) },
                { key: 'a-o1', label: `${event.away} Over 1.5`, odds: price(random, 1.8, 3.2) },
                { key: 'a-u1', label: `${event.away} Under 1.5`, odds: price(random, 1.3, 2.0) },
            ],
        },
        {
            id: 'handicap',
            name: 'Asian Handicap',
            group: 'handicap',
            selections: ['-1.5', '-0.5', '+0.5', '+1.5'].flatMap((line) => [
                { key: `h${line}`, label: `${event.home} ${line}`, odds: price(random, 1.3, 4.4) },
            ]),
        },
        {
            id: 'half',
            name: 'Half Time / Full Time',
            group: 'specials',
            selections: [
                { key: 'hh', label: 'Home / Home', odds: price(random, 2.2, 4.5) },
                { key: 'dd', label: 'Draw / Draw', odds: price(random, 4.5, 7.5) },
                { key: 'aa', label: 'Away / Away', odds: price(random, 3.0, 6.5) },
                { key: 'dh', label: 'Draw / Home', odds: price(random, 3.4, 5.6) },
                { key: 'da', label: 'Draw / Away', odds: price(random, 4.0, 6.8) },
                { key: 'hd', label: 'Home / Draw', odds: price(random, 5.0, 9.0) },
            ],
        },
        {
            id: 'corners',
            name: 'Total Corners',
            group: 'specials',
            selections: [
                { key: 'c-o8', label: 'Over 8.5', odds: price(random, 1.5, 2.2) },
                { key: 'c-u8', label: 'Under 8.5', odds: price(random, 1.6, 2.4) },
                { key: 'c-o10', label: 'Over 10.5', odds: price(random, 2.0, 3.2) },
                { key: 'c-u10', label: 'Under 10.5', odds: price(random, 1.3, 1.8) },
            ],
        },
    ];
}

export const MARKET_GROUPS = [
    ['all', 'All markets'],
    ['popular', 'Popular'],
    ['goals', 'Goals'],
    ['handicap', 'Handicap'],
    ['specials', 'Specials'],
];

/** Form + head-to-head panel data, also derived from the event id. */
export function buildStats(event) {
    const random = seeded(`${event.id}-stats`);
    const form = () => Array.from({ length: 5 }, () => ['W', 'D', 'L'][Math.floor(random() * 3)]);
    const homeWins = Math.floor(random() * 6);
    const awayWins = Math.floor(random() * 5);
    const draws = Math.floor(random() * 4);
    return {
        form: { home: form(), away: form() },
        h2h: { home: homeWins, draws, away: awayWins, total: homeWins + draws + awayWins },
        possession: 40 + Math.floor(random() * 21),
    };
}
