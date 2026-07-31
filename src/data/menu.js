// Every destination the app can reach. The drawer, the global search and the
// desktop rail all read from here, so adding a page means editing one list.

export const MENU_SECTIONS = [
    {
        title: 'Sportsbook',
        items: [
            ['sports', 'Sports', 'ball'],
            ['sports', 'Live betting', 'signal'],
            ['mybets', 'My bets', 'slip'],
            ['event', 'Featured event', 'calendar'],
        ],
    },
    {
        title: 'Casino',
        items: [
            ['casino', 'Casino', 'slots'],
            ['casino', 'Live casino', 'casino'],
            ['game', 'Crash games', 'rocket'],
        ],
    },
    {
        title: 'Account',
        items: [
            ['wallet', 'Wallet', 'wallet'],
            ['profile', 'Profile', 'user'],
            ['vip', 'VIP club', 'crown'],
            ['referral', 'Refer a friend', 'users'],
        ],
    },
    {
        title: 'More',
        items: [
            ['promotions', 'Promotions', 'gift'],
            ['support', 'Support centre', 'headset'],
            ['legal', 'Legal & terms', 'results'],
        ],
    },
];

export const QUICK_TILES = [
    ['sports', 'Sports', 'ball'],
    ['casino', 'Casino', 'slots'],
    ['game', 'Crash', 'rocket'],
    ['promotions', 'Bonuses', 'gift'],
    ['wallet', 'Wallet', 'wallet'],
    ['mybets', 'Bets', 'slip'],
    ['support', 'Help', 'headset'],
    ['vip', 'VIP', 'crown'],
];
