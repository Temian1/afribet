// Pure-Tailwind win celebration: confetti rain + coin burst. Render when `show` is true.
const COLORS = ['bg-purple-l', 'bg-gold-l', 'bg-cyan-l', 'bg-neon-green-l', 'bg-neon-red', 'bg-pink-400'];

export default function Celebrate({ show, coins = true, count = 36 }) {
    if (!show) return null;
    return (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden>
            {Array.from({ length: count }).map((_, i) => (
                <span
                    key={i}
                    className={`absolute top-0 h-3 w-1.5 rounded-sm ${COLORS[i % COLORS.length]} animate-confetti`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${1 + Math.random()}s`,
                    }}
                />
            ))}
            {coins && Array.from({ length: 10 }).map((_, i) => (
                <span
                    key={`c${i}`}
                    className="absolute left-1/2 top-1/3 h-4 w-4 rounded-full bg-gradient-to-br from-yellow-200 to-gold animate-confetti"
                    style={{
                        left: `${40 + Math.random() * 20}%`,
                        animationDelay: `${Math.random() * 0.3}s`,
                        animationDuration: `${0.9 + Math.random() * 0.6}s`,
                    }}
                />
            ))}
        </div>
    );
}
