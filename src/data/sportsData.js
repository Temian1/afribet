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
    { id: 'top-5', sport: 'football', region: 'England', time: 'Today at 19:00', league: 'Premier League', home: 'Arsenal', away: 'Chelsea', odds: [1.88, 3.62, 4.10], more: 186 },
    { id: 'top-6', sport: 'football', region: 'Spain', time: 'Today at 20:00', league: 'La Liga', home: 'Barcelona', away: 'Atletico Madrid', odds: [1.74, 3.85, 4.65], more: 174 },
    { id: 'top-7', sport: 'football', region: 'Italy', time: 'Today at 20:45', league: 'Serie A', home: 'Inter Milan', away: 'Napoli', odds: [2.02, 3.38, 3.68], more: 162 },
    { id: 'top-8', sport: 'football', region: 'Germany', time: 'Today at 21:00', league: 'Bundesliga', home: 'Bayern Munich', away: 'Borussia Dortmund', odds: [1.56, 4.55, 5.20], more: 192 },
    { id: 'top-9', sport: 'football', region: 'France', time: 'Today at 21:15', league: 'Ligue 1', home: 'Paris Saint-Germain', away: 'Marseille', odds: [1.48, 4.60, 6.10], more: 158 },
    { id: 'top-10', sport: 'football', region: 'Africa', time: 'Today at 22:00', league: 'CAF Champions League', home: 'Al Ahly', away: 'Esperance Tunis', odds: [1.82, 3.22, 4.72], more: 118 },
];

export const UPCOMING = [
    { id: 'up-1', sport: 'football', region: 'Europe', league: 'UEFA Conference League Qualification', time: 'Today at 15:30', home: 'Dukagjini FK', away: 'Lugano', more: 120, odds: [5.93, 4.52, 1.45], markets: [[5.93, 4.52, 1.45], [1.70, '+2.5-', 2.03], [1.83, '–', 1.84], [1.99, '+1-', 1.73]] },
    { id: 'up-2', sport: 'football', region: 'Russia', league: 'Russia Cup', time: 'Today at 15:30', home: 'Moskovskaya Zastava-Kristall', away: 'Krasnoe Znamya Noginsk', more: 68, odds: [6.43, 4.04, 1.48], markets: [[6.43, 4.04, 1.48], [1.76, '+3.5-', 1.95], [1.41, '–', 2.52], [2.08, '+1-', 1.66]] },
    { id: 'up-3', sport: 'football', region: 'World', league: 'Club Friendly Games', time: 'Today at 16:00', home: 'Riga FC', away: 'Suduva', more: 84, odds: [1.62, 3.78, 4.80], markets: [[1.62, 3.78, 4.80], [1.85, '+2.5-', 1.88], [1.74, '–', 1.96], [1.51, '-1+', 2.31]] },
    { id: 'up-4', sport: 'football', region: 'England', league: 'Premier League', time: 'Today at 16:30', home: 'Manchester City', away: 'Liverpool', more: 196, odds: [1.95, 3.74, 3.62], markets: [[1.95, 3.74, 3.62], [1.67, '+3.5-', 2.12], [1.58, '–', 2.28], [1.86, '-0.5+', 1.91]] },
    { id: 'up-5', sport: 'football', region: 'Spain', league: 'La Liga', time: 'Today at 17:00', home: 'Real Sociedad', away: 'Valencia', more: 142, odds: [1.84, 3.28, 4.55], markets: [[1.84, 3.28, 4.55], [2.06, '+2.5-', 1.72], [1.95, '–', 1.78], [1.62, '-0.5+', 2.20]] },
    { id: 'up-6', sport: 'football', region: 'Italy', league: 'Serie A', time: 'Today at 17:30', home: 'Juventus', away: 'AS Roma', more: 154, odds: [2.08, 3.15, 3.82], markets: [[2.08, 3.15, 3.82], [2.18, '+2.5-', 1.64], [2.04, '–', 1.70], [1.78, '-0.5+', 1.98]] },
    { id: 'up-7', sport: 'football', region: 'Germany', league: 'Bundesliga', time: 'Today at 18:00', home: 'Bayer Leverkusen', away: 'RB Leipzig', more: 168, odds: [1.92, 3.90, 3.58], markets: [[1.92, 3.90, 3.58], [1.55, '+3.5-', 2.34], [1.48, '–', 2.48], [1.84, '-0.5+', 1.94]] },
    { id: 'up-8', sport: 'football', region: 'France', league: 'Ligue 1', time: 'Today at 18:30', home: 'AS Monaco', away: 'Lille', more: 136, odds: [2.14, 3.46, 3.28], markets: [[2.14, 3.46, 3.28], [1.80, '+2.5-', 1.98], [1.72, '–', 2.02], [1.96, '-0.5+', 1.80]] },
    { id: 'up-9', sport: 'football', region: 'Netherlands', league: 'Eredivisie', time: 'Today at 19:00', home: 'Ajax', away: 'PSV Eindhoven', more: 148, odds: [2.68, 3.80, 2.30], markets: [[2.68, 3.80, 2.30], [1.46, '+3.5-', 2.58], [1.42, '–', 2.68], [2.16, '+0.5-', 1.64]] },
    { id: 'up-10', sport: 'football', region: 'Portugal', league: 'Primeira Liga', time: 'Today at 19:30', home: 'Sporting CP', away: 'SC Braga', more: 130, odds: [1.58, 4.08, 5.25], markets: [[1.58, 4.08, 5.25], [1.72, '+2.5-', 2.06], [1.66, '–', 2.12], [1.88, '-1+', 1.90]] },
    { id: 'up-11', sport: 'football', region: 'USA', league: 'Major League Soccer', time: 'Today at 20:00', home: 'Inter Miami', away: 'Atlanta United', more: 126, odds: [1.66, 4.20, 4.35], markets: [[1.66, 4.20, 4.35], [1.49, '+3.5-', 2.50], [1.45, '–', 2.60], [1.76, '-1+', 2.02]] },
    { id: 'up-12', sport: 'football', region: 'Brazil', league: 'Brasileirão Serie A', time: 'Today at 20:30', home: 'Flamengo', away: 'Palmeiras', more: 144, odds: [2.05, 3.18, 3.76], markets: [[2.05, 3.18, 3.76], [2.12, '+2.5-', 1.68], [1.98, '–', 1.76], [1.82, '-0.5+', 1.95]] },
    { id: 'up-13', sport: 'football', region: 'Argentina', league: 'Liga Profesional', time: 'Today at 21:00', home: 'River Plate', away: 'Boca Juniors', more: 138, odds: [2.00, 3.08, 4.02], markets: [[2.00, 3.08, 4.02], [2.30, '+2.5-', 1.57], [2.16, '–', 1.62], [1.78, '-0.5+', 2.00]] },
    { id: 'up-14', sport: 'football', region: 'Africa', league: 'CAF Champions League', time: 'Today at 21:30', home: 'Wydad Casablanca', away: 'Mamelodi Sundowns', more: 112, odds: [2.42, 2.94, 3.18], markets: [[2.42, 2.94, 3.18], [2.44, '+2.5-', 1.51], [2.28, '–', 1.55], [1.96, '0+', 1.78]] },
    { id: 'up-15', sport: 'football', region: 'Nigeria', league: 'Nigeria Premier Football League', time: 'Tomorrow at 14:00', home: 'Enyimba', away: 'Rivers United', more: 92, odds: [1.80, 3.05, 5.10], markets: [[1.80, 3.05, 5.10], [2.36, '+2.5-', 1.54], [2.20, '–', 1.60], [1.72, '-0.5+', 2.04]] },
    { id: 'up-16', sport: 'football', region: 'South Africa', league: 'Premier Soccer League', time: 'Tomorrow at 15:30', home: 'Orlando Pirates', away: 'Kaizer Chiefs', more: 104, odds: [2.28, 2.90, 3.48], markets: [[2.28, 2.90, 3.48], [2.52, '+2.5-', 1.48], [2.34, '–', 1.52], [1.88, '0+', 1.86]] },
    { id: 'up-17', sport: 'football', region: 'Scotland', league: 'Scottish Premiership', time: 'Tomorrow at 16:00', home: 'Celtic', away: 'Rangers', more: 152, odds: [1.86, 3.65, 3.95], markets: [[1.86, 3.65, 3.95], [1.78, '+2.5-', 2.00], [1.70, '–', 2.08], [1.68, '-0.5+', 2.12]] },
    { id: 'up-18', sport: 'football', region: 'England', league: "Women's Super League", time: 'Tomorrow at 17:00', home: 'Arsenal Women', away: 'Chelsea Women', more: 124, odds: [2.34, 3.52, 2.84], markets: [[2.34, 3.52, 2.84], [1.64, '+3.5-', 2.18], [1.54, '–', 2.36], [1.92, '0+', 1.82]] },
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
