// Material-style (Google) SVG icon set for the sports/home surfaces.
// Outlined icons follow the Material Symbols look: 24x24 grid, currentColor stroke, round joins.

const Outlined = ({ className = 'size-5', strokeWidth = 1.6, children }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);

const Solid = ({ className = 'size-5', children }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{children}</svg>
);

const SPORT_PATHS = {
    football: <><circle cx="12" cy="12" r="9" /><path d="m12 8.3 3.3 2.4-1.3 3.9h-4l-1.3-3.9z" /><path d="M12 3v5.3M20.6 9.4l-5.3 1.3M17.3 19.6 14 14.6M6.7 19.6 10 14.6M3.4 9.4l5.3 1.3" /></>,
    basketball: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /><path d="M18.4 5.6a9 9 0 0 0 0 12.8M5.6 5.6a9 9 0 0 1 0 12.8" /></>,
    tennis: <><circle cx="12" cy="12" r="9" /><path d="M4.6 5.6a12 12 0 0 1 0 12.8M19.4 5.6a12 12 0 0 0 0 12.8" /></>,
    hockey: <><path d="M4 19h8M6.5 19 15 4.5M15 4.5h2.6l1.4 2.4" /><ellipse cx="18.3" cy="18.4" rx="2.7" ry="1.6" /></>,
    volleyball: <><circle cx="12" cy="12" r="9" /><path d="M12 3c-2.4 3.1-2.9 6.6-1.4 10.4M3.3 10.4c3.9-.6 7.2.6 9.6 3.7M8.6 20.4c1.6-3.6 4.3-5.8 8.2-6.5" /></>,
    boxing: <><path d="M7 9a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v2.5a2.5 2.5 0 0 1-2.5 2.5H7z" /><path d="M7 14h11v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" /><path d="M7 9H5.8A1.8 1.8 0 0 0 4 10.8v1.4A1.8 1.8 0 0 0 5.8 14H7" /></>,
    baseball: <><circle cx="12" cy="12" r="9" /><path d="M7.4 4.4c2 2.2 3.1 4.8 3.1 7.6s-1.1 5.4-3.1 7.6M16.6 4.4c-2 2.2-3.1 4.8-3.1 7.6s1.1 5.4 3.1 7.6" /></>,
    handball: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.2" /><path d="M12 3v4.2M20.4 9.3l-6 2M17.1 19.4l-3.7-5.1M6.9 19.4l3.7-5.1M3.6 9.3l6 2" /></>,
    golf: <><path d="M9 21V3l9 3.6L9 10.2" /><path d="M6.5 21h6" /><circle cx="17" cy="18" r="2.2" /></>,
    rugby: <><path d="M4.6 19.4c-2.6-2.6-.9-9 3.1-13s10.4-5.7 13-3.1.9 9-3.1 13-10.4 5.7-13 3.1Z" /><path d="m9.2 14.8 5.6-5.6M10.6 11.6l1.8 1.8M12.8 9.4l1.8 1.8" /></>,
    pool: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.6" /><circle cx="12" cy="12" r="1" /></>,
    soccer: <><circle cx="12" cy="12" r="9" /><path d="m12 8.3 3.3 2.4-1.3 3.9h-4l-1.3-3.9z" /><path d="M12 3v5.3M20.6 9.4l-5.3 1.3M17.3 19.6 14 14.6M6.7 19.6 10 14.6M3.4 9.4l5.3 1.3" /></>,
    chess: <><path d="M12 3a3 3 0 0 1 1.9 5.3c1.5 1.2 2.2 3 2.2 5.4H7.9c0-2.4.7-4.2 2.2-5.4A3 3 0 0 1 12 3Z" /><path d="M7 16.5h10l1 4.5H6z" /></>,
    racing: <><path d="M5 21V3.6" /><path d="M5 3.6h14l-2.6 4.6L19 12.8H5z" /><path d="M9.7 3.6v4.6h4.6v4.6M5 8.2h4.7M14.3 8.2H19" /></>,
    cricket: <><path d="M16.8 3.4a3 3 0 0 1 3.4 3.4l-8.4 8.4-3.4-3.4z" /><path d="m8.4 11.8-3.9 3.9a2.4 2.4 0 0 0 3.4 3.4l3.9-3.9" /><circle cx="5.6" cy="6" r="2.4" /></>,
    badminton: <><ellipse cx="14.8" cy="9.2" rx="4.5" ry="5.6" transform="rotate(45 14.8 9.2)" /><path d="M11.6 12.4 5 19M4.4 19.6 3 21M11.6 5.9l6.4 6.4M17.9 6l-6.4 6.3" /></>,
    table: <><circle cx="13.6" cy="8.6" r="5.4" /><path d="m9.7 12.4-4.4 4.4a2 2 0 0 0 2.8 2.8l4.4-4.4" /><circle cx="4.8" cy="6.2" r="1.7" /></>,
    virtual: <><rect x="2.5" y="7.5" width="19" height="10" rx="4" /><path d="M7 10.5v4M5 12.5h4M15.5 11.5h.01M18 13.5h.01" /></>,
};

export function SportIcon({ type, className = 'size-6', strokeWidth = 1.6 }) {
    return <Outlined className={className} strokeWidth={strokeWidth}>{SPORT_PATHS[type] ?? SPORT_PATHS.football}</Outlined>;
}

const UI_OUTLINED = {
    star: <path d="m12 3.4 2.7 5.6 6.1.9-4.4 4.4 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.4 6.1-.9z" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5.3l3.4 2" /></>,
    chevronDown: <path d="m6 9.5 6 6 6-6" />,
    chevronRight: <path d="m9.5 6 6 6-6 6" />,
    stopwatch: <><circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5v4h3M9.5 2.5h5M19.4 6.6l1.4-1.4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4.2-4.2" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5.5 9.6V20h13V9.6M9.5 20v-6h5v6" /></>,
    live: <><rect x="2.5" y="6" width="14" height="12" rx="2.5" /><path d="m16.5 10.5 5-2.5v8l-5-2.5z" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3.2 10.5h17.6M3.2 14.5h17.6M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>,
    settings: <><circle cx="12" cy="12" r="3.2" /><path d="M19.5 12a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-2.1-1.2L14.6 3H9.4l-.4 2.7c-.8.3-1.5.7-2.1 1.2l-2.3-1-2 3.4 2 1.5a7.6 7.6 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1c.6.5 1.3.9 2.1 1.2l.4 2.7h5.2l.4-2.7c.8-.3 1.5-.7 2.1-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" /></>,
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></>,
    menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
    slip: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8.5h6M9 12.5h6" /></>,
    rocket: <><path d="M14 4c3-2 6-1 6-1s1 3-1 6l-7 7-4-4z" /><path d="m9 15-1 5-3-3 5-1" /><path d="M14.5 7.5h.01" /></>,
    gift: <><rect x="3" y="8.5" width="18" height="4" rx="1.4" /><path d="M12 8.5V21M5 12.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.5" /><path d="M7.6 8.5a2.6 2.6 0 0 1 0-5.2C10.9 3.3 12 8.5 12 8.5s1.1-5.2 4.4-5.2a2.6 2.6 0 0 1 0 5.2" /></>,
    results: <><rect x="3" y="4.5" width="18" height="16" rx="2.4" /><path d="M7 9h10M7 13h6M7 17h8" /></>,
    headset: <><path d="M4 13.5v-1.5a8 8 0 0 1 16 0v1.5" /><rect x="2.5" y="12" width="4.5" height="7" rx="2" /><rect x="17" y="12" width="4.5" height="7" rx="2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2.4" /><path d="M7.5 3v4M16.5 3v4M3 10h18M8.5 14.8l2.2 2.2 4.8-4.8" /></>,
    casino: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.2" /><path d="m12 3 1.4 5.7M20.5 8.2l-5.3 3M18.2 18.4l-5-4.1M6 19l3.9-4.8M4 8.2l5.4 3" /></>,
    slots: <><rect x="3" y="5" width="18" height="14" rx="2.4" /><path d="M7.5 9.5v5M12 9.5v5M16.5 9.5v5" /></>,
    monitor: <><rect x="3" y="4.5" width="18" height="13" rx="2.4" /><path d="M8.5 21h7M12 17.5V21M7.5 9.5h2M14.5 9.5h2M7.5 13.5h9" /></>,
    dice: <><rect x="3.5" y="8.5" width="9.5" height="9.5" rx="2.2" /><rect x="11" y="4.5" width="9.5" height="9.5" rx="2.2" /><path d="M7 12.5h.01M9.5 15.5h.01M15 8h.01M17.5 10.5h.01" /></>,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    wallet: <><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1.5" /><rect x="3" y="7.5" width="18" height="12" rx="2.4" /><path d="M15.5 13.5h.01" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></>,
    users: <><circle cx="9.5" cy="8" r="3.6" /><path d="M3 20.5a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.6 3.6 0 0 1 0 6.8M18 14.4a6.5 6.5 0 0 1 3 6.1" /></>,
    signal: <><path d="M8.4 16.6a5 5 0 0 1 0-9.2M5.4 19.6a9 9 0 0 1 0-15.2M15.6 7.4a5 5 0 0 1 0 9.2M18.6 4.4a9 9 0 0 1 0 15.2" /><circle cx="12" cy="12" r="1.6" /></>,
    tune: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9M4 12h5M13 12h7" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /><circle cx="11" cy="12" r="2" /></>,
};

const UI_SOLID = {
    starFilled: <path d="m12 17.3-5.6 3.1 1.1-6.3-4.5-4.4 6.2-.9L12 3.2l2.8 5.6 6.2.9-4.5 4.4 1.1 6.3z" />,
    crown: <><path d="M3.2 6.6a1.6 1.6 0 1 1 1.4 2.3l1.2 6.6h12.4l1.2-6.6a1.6 1.6 0 1 1 1.4-2.3 1.6 1.6 0 0 1-2.4 1.4L15.6 11 13.4 5.8a1.6 1.6 0 1 0-2.8 0L8.4 11 5.6 8a1.6 1.6 0 0 1-2.4-1.4Z" /><path d="M5.8 17h12.4l.4 2.2H5.4z" /></>,
    flame: <path d="M13.4 2.2c.4 3 2 4.1 3.4 5.6a7.7 7.7 0 0 1 2.4 5.6c0 4.2-3.2 7.4-7.2 7.4s-7.2-3-7.2-7.1c0-2.6 1.2-4.4 2.6-6 .1 1.3.7 2.2 1.7 2.6.6-2.9 1.8-5.9 4.3-8.1ZM12 20.2c1.9 0 3.4-1.4 3.4-3.2 0-1.6-.9-2.4-1.8-3.4-.4 1.1-1.1 1.7-2 2-.9-.6-1.2-1.4-1.2-2.3-1 .9-1.8 2.1-1.8 3.7 0 1.8 1.5 3.2 3.4 3.2Z" />,
    trophy: <path d="M7 3h10v1.5h3.5V8a4 4 0 0 1-3.6 4 5.2 5.2 0 0 1-3.1 2.4v2.9h2.4a2 2 0 0 1 2 2V21H5.8v-1.7a2 2 0 0 1 2-2h2.4v-2.9A5.2 5.2 0 0 1 7.1 12 4 4 0 0 1 3.5 8V4.5H7zm10 3v4.3A2.5 2.5 0 0 0 19 8V6zM5 6v2a2.5 2.5 0 0 0 2 2.3V6z" />,
};

export function UiIcon({ name, className = 'size-5', strokeWidth = 1.9 }) {
    if (UI_SOLID[name]) return <Solid className={className}>{UI_SOLID[name]}</Solid>;
    return <Outlined className={className} strokeWidth={strokeWidth}>{UI_OUTLINED[name] ?? UI_OUTLINED.star}</Outlined>;
}

const CREST_COLORS = ['#39f5ad', '#ffb400', '#5aa9ff', '#ff7a7a', '#c08bff', '#4ade80', '#f472b6', '#fb923c'];

function crestOf(name = '') {
    const words = name.replace(/[^a-zA-Z ]/g, ' ').split(' ').filter(Boolean);
    const initials = (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? '?').slice(0, 2)).toUpperCase();
    let hash = 0;
    for (const character of name) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
    return { initials, color: CREST_COLORS[hash % CREST_COLORS.length] };
}

export function TeamCrest({ name, className = 'size-6' }) {
    const { initials, color } = crestOf(name);
    return (
        <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1.9 20.8 4.5v6.9c0 4.9-3.6 8.8-8.8 10.7-5.2-1.9-8.8-5.8-8.8-10.7V4.5z" fill={color} fillOpacity=".16" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
            <text x="12" y="14.6" textAnchor="middle" fontSize="8.2" fontWeight="800" fill={color}>{initials}</text>
        </svg>
    );
}
