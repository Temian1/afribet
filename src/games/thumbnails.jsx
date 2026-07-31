/* Original SVG illustration thumbnails for each in-house game.
   viewBox 120x160 (3:4), fill the card. */
const wrap = (bg, children) => (
    <svg viewBox="0 0 120 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect width="120" height="160" fill={bg[0]} />
        <rect width="120" height="160" fill="url(#glow)" opacity="0.5" />
        <defs>
            <radialGradient id="glow" cx="50%" cy="28%" r="70%">
                <stop offset="0%" stopColor={bg[1]} stopOpacity="0.9" />
                <stop offset="100%" stopColor={bg[0]} stopOpacity="0" />
            </radialGradient>
        </defs>
        {children}
    </svg>
);

export const THUMBS = {
    slots: wrap(['#2a0f52', '#7c3aed'], <>
        {[26, 60, 94].map((x, i) => <g key={i}><rect x={x - 15} y="52" width="30" height="56" rx="6" fill="#0b0417" stroke="#f59e0b" strokeWidth="1.5" /><text x={x} y="86" textAnchor="middle" fontSize="22">{['💎', '7️⃣', '🍒'][i]}</text></g>)}
        <line x1="14" y1="80" x2="106" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="60" y="132" textAnchor="middle" fill="#fbbf24" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">SLOTS</text>
    </>),
    roulette: wrap(['#1a0a00', '#dc2626'], <>
        <circle cx="60" cy="72" r="40" fill="none" stroke="#f59e0b" strokeWidth="3" />
        {Array.from({ length: 12 }).map((_, i) => { const a = i / 12 * Math.PI * 2; return <path key={i} d={`M60 72 L${60 + 40 * Math.cos(a)} ${72 + 40 * Math.sin(a)}`} stroke={i % 2 ? '#dc2626' : '#111'} strokeWidth="8" />; })}
        <circle cx="60" cy="72" r="14" fill="#1a0a00" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="60" cy="34" r="4" fill="#fff" />
        <text x="60" y="132" textAnchor="middle" fill="#fbbf24" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">ROULETTE</text>
    </>),
    blackjack: wrap(['#032317', '#10b981'], <>
        {[[46, -8], [60, 0], [74, 8]].map(([x, r], i) => <g key={i} transform={`rotate(${r} ${x} 70)`}><rect x={x - 13} y="46" width="26" height="40" rx="4" fill="#fff" /><text x={x} y="72" textAnchor="middle" fontSize="16" fill={i === 1 ? '#dc2626' : '#111'} fontWeight="900">{['K', 'A', 'J'][i]}</text></g>)}
        <text x="60" y="118" textAnchor="middle" fontSize="20">♠♥♣</text>
        <text x="60" y="140" textAnchor="middle" fill="#34d399" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">BLACKJACK</text>
    </>),
    crash: wrap(['#0b1026', '#ef4444'], <>
        {[[20, 120], [40, 110], [60, 92], [80, 66], [98, 40]].map((p, i, a) => i > 0 && <line key={i} x1={a[i - 1][0]} y1={a[i - 1][1]} x2={p[0]} y2={p[1]} stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />)}
        <text x="100" y="34" textAnchor="middle" fontSize="18">🚀</text>
        <text x="46" y="70" fill="#fbbf24" fontFamily="Orbitron,monospace" fontWeight="900" fontSize="16">2.4x</text>
        <text x="60" y="140" textAnchor="middle" fill="#f87171" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">CRASH</text>
    </>),
    dice: wrap(['#0f172a', '#3b82f6'], <>
        <g transform="rotate(-12 44 70)"><rect x="26" y="52" width="36" height="36" rx="8" fill="#1e3a8a" stroke="#a78bfa" strokeWidth="2" /><circle cx="36" cy="62" r="3.5" fill="#a78bfa" /><circle cx="52" cy="78" r="3.5" fill="#a78bfa" /><circle cx="44" cy="70" r="3.5" fill="#a78bfa" /></g>
        <g transform="rotate(10 78 74)"><rect x="62" y="58" width="34" height="34" rx="8" fill="#1e40af" stroke="#a78bfa" strokeWidth="2" /><circle cx="70" cy="66" r="3.5" fill="#a78bfa" /><circle cx="88" cy="66" r="3.5" fill="#a78bfa" /><circle cx="70" cy="84" r="3.5" fill="#a78bfa" /><circle cx="88" cy="84" r="3.5" fill="#a78bfa" /></g>
        <text x="60" y="134" textAnchor="middle" fill="#60a5fa" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">DICE</text>
    </>),
    plinko: wrap(['#04070c', '#22d3ee'], <>
        {[1, 2, 3, 4, 5].map(row => Array.from({ length: row + 1 }).map((_, c) => <circle key={`${row}-${c}`} cx={60 - row * 9 + c * 18} cy={30 + row * 15} r="3" fill="#22d3ee" />))}
        <circle cx="60" cy="20" r="4" fill="#fbbf24" />
        {['10', '3', '1', '3', '10'].map((m, i) => <rect key={i} x={14 + i * 19} y="112" width="16" height="12" rx="2" fill={i === 2 ? '#8b5cf6' : i % 4 === 0 ? '#ef4444' : '#f59e0b'} opacity="0.7" />)}
        <text x="60" y="144" textAnchor="middle" fill="#22d3ee" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">PLINKO</text>
    </>),
    mines: wrap(['#1a1206', '#f59e0b'], <>
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={30 + (i % 3) * 22} y={40 + Math.floor(i / 3) * 22} width="18" height="18" rx="4" fill="#2a1c08" stroke="#f59e0b" strokeWidth="1" />)}
        <text x="41" y="55" textAnchor="middle" fontSize="13">💎</text>
        <text x="85" y="99" textAnchor="middle" fontSize="13">💣</text>
        <text x="60" y="132" textAnchor="middle" fill="#fbbf24" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">MINES</text>
    </>),
    limbo: wrap(['#0a0a1e', '#a78bfa'], <>
        <text x="60" y="80" textAnchor="middle" fill="#a78bfa" fontFamily="Orbitron,monospace" fontWeight="900" fontSize="30">×</text>
        <text x="60" y="58" textAnchor="middle" fill="#fbbf24" fontFamily="Orbitron,monospace" fontWeight="900" fontSize="22">9.9</text>
        <path d="M20 100 L100 100" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 3" />
        <text x="60" y="132" textAnchor="middle" fill="#a78bfa" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">LIMBO</text>
    </>),
    coinflip: wrap(['#1a1400', '#fbbf24'], <>
        <circle cx="60" cy="68" r="30" fill="url(#coinG)" stroke="#b45309" strokeWidth="2" />
        <defs><radialGradient id="coinG" cx="38%" cy="32%"><stop offset="0%" stopColor="#fde68a" /><stop offset="100%" stopColor="#f59e0b" /></radialGradient></defs>
        <text x="60" y="78" textAnchor="middle" fontSize="26" fontWeight="900" fill="#7c2d12">$</text>
        <text x="60" y="132" textAnchor="middle" fill="#fbbf24" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">COIN FLIP</text>
    </>),
    wheel: wrap(['#12002e', '#a78bfa'], <>
        {Array.from({ length: 8 }).map((_, i) => { const a0 = i / 8 * Math.PI * 2, a1 = (i + 1) / 8 * Math.PI * 2; const R = 38, cx = 60, cy = 70; return <path key={i} d={`M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`} fill={['#8b5cf6', '#f59e0b', '#22d3ee', '#34d399'][i % 4]} />; })}
        <circle cx="60" cy="70" r="8" fill="#12002e" stroke="#fff" strokeWidth="1.5" />
        <path d="M60 26 L55 36 L65 36 Z" fill="#fff" />
        <text x="60" y="134" textAnchor="middle" fill="#c4b5fd" fontFamily="Orbitron,monospace" fontWeight="700" fontSize="11">WHEEL</text>
    </>),
};
