import { useState } from 'react';
import CasinoSection from '../components/CasinoSection';
import Carousel from '../components/Carousel';

const CATS = [
    { id: 'all', label: 'All Games' },
    { id: 'slots', label: 'Slots' },
    { id: 'live', label: 'Live Casino' },
    { id: 'crash', label: 'Crash' },
    { id: 'mines', label: 'Mines' },
    { id: 'roulette', label: 'Roulette' },
    { id: 'blackjack', label: 'Blackjack' },
    { id: 'dice', label: 'Dice' },
    { id: 'plinko', label: 'Plinko' },
    { id: 'wheel', label: 'Wheel' },
    { id: 'limbo', label: 'Limbo' },
    { id: 'coinflip', label: 'Coin Flip' },
];

export default function Casino() {
    const [cat, setCat] = useState('all');
    const [search, setSearch] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-ink">
            <Carousel />

            <div className="sticky top-[68px] z-30 border-b border-[var(--pf-border)] bg-white/92 py-3 backdrop-blur-xl dark:bg-ink-2/92">
                <div className="shell flex flex-wrap items-center gap-3">
                    <div className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
                        {CATS.map((catItem) => (
                            <button
                                key={catItem.id}
                                className={`chip shrink-0 ${cat === catItem.id ? 'chip-active' : ''}`}
                                onClick={() => setCat(catItem.id)}
                                type="button"
                                aria-pressed={cat === catItem.id}
                            >
                                {catItem.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-60">
                        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search games…"
                            aria-label="Search games"
                            className="input py-2.5 pl-10 text-sm"
                        />
                    </div>
                </div>
            </div>

            <CasinoSection category={cat} search={search} />
        </div>
    );
}
