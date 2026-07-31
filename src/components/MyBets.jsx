import { useCallback, useEffect, useState } from 'react';
import sportsApi from '../services/sportsApi';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { SectionHeader, Skeleton, EmptyState } from './ui';

const STATUS_META = {
    pending: { label: 'Open', cls: 'border-gold/40 bg-gold/10 text-amber-600 dark:text-gold-l' },
    won: { label: 'Won', cls: 'border-neon-green/40 bg-neon-green/10 text-emerald-600 dark:text-neon-green-l' },
    lost: { label: 'Lost', cls: 'border-neon-red/40 bg-neon-red/10 text-neon-red' },
    cashout: { label: 'Cashed Out', cls: 'border-cyan/40 bg-cyan/10 text-cyan-700 dark:text-cyan-l' },
    void: { label: 'Void', cls: 'border-slate-300 bg-slate-100 text-slate-500 dark:border-white/15 dark:bg-white/[.06]' },
};

const FILTERS = [
    { id: '', label: 'All' },
    { id: 'pending', label: 'Open' },
    { id: 'won', label: 'Won' },
    { id: 'lost', label: 'Lost' },
    { id: 'cashout', label: 'Cashed Out' },
];

export default function MyBets() {
    const { user } = useAuth();
    const { loadWallet } = useApp();
    const toast = useToast();
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [cashingOut, setCashingOut] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await sportsApi.getMyBets(filter ? { status: filter } : {});
            setBets(data.data ?? data.bets ?? []);
        } catch {
            setBets([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { if (user) load(); }, [user, load]);

    if (!user) return null;

    const cashout = async (bet) => {
        setCashingOut(bet.id);
        try {
            const res = await sportsApi.cashoutBet(bet.id);
            toast.success(`Cashed out $${Number(res.amount).toFixed(2)}`, { title: 'Cash Out' });
            await Promise.all([load(), loadWallet()]);
        } catch (e) {
            toast.error(e.message ?? 'Cash out failed.');
        } finally {
            setCashingOut(null);
        }
    };

    return (
        <section className="py-16">
            <div className="shell">
                <SectionHeader
                    badge="Your Bets"
                    accent="My"
                    title="bets"
                    description="Track open positions and cash out early before the final whistle."
                >
                    <div className="flex flex-wrap gap-1.5">
                        {FILTERS.map((f) => (
                            <button key={f.id} type="button" onClick={() => setFilter(f.id)}
                                className={`chip ${filter === f.id ? 'chip-active' : ''}`} aria-pressed={filter === f.id}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </SectionHeader>

                {loading && (
                    <div className="grid gap-3">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
                    </div>
                )}

                {!loading && bets.length === 0 && (
                    <EmptyState
                        icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" /><path d="M4 9h16M9 4v16" /></svg>}
                        title="No bets yet"
                        description="Place a bet on any live or upcoming event and it will show up here."
                    />
                )}

                {!loading && bets.length > 0 && (
                    <div className="grid gap-3">
                        {bets.map((bet) => {
                            const meta = STATUS_META[bet.status] ?? STATUS_META.void;
                            const canCashout = bet.status === 'pending' && bet.cashout_value != null && bet.cashout_value > 0;
                            let legs = null;
                            if (bet.market_type === 'multi' && bet.notes) {
                                try { legs = JSON.parse(bet.notes); } catch { legs = null; }
                            }
                            return (
                                <article key={bet.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`badge border ${meta.cls}`}>{meta.label}</span>
                                            <span className="font-heading text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                                {bet.market_type} · {bet.selection}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {bet.market_type === 'multi'
                                                ? `Multi — ${bet.selection}`
                                                : bet.event?.event_name ?? `Event #${bet.sports_event_id}`}
                                        </p>
                                        {legs && (
                                            <ul className="mt-1.5 grid gap-1">
                                                {legs.map((leg, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-purple/60" />
                                                        <span className="truncate">{leg.event ?? `Event #${leg.event_id}`} — {leg.selection}</span>
                                                        <span className="shrink-0 tabular-nums text-amber-600 dark:text-gold-l">{Number(leg.odds).toFixed(2)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <p className="mt-0.5 text-xs tabular-nums text-slate-500">
                                            ${Number(bet.stake).toFixed(2)} @ {Number(bet.odds_at_bet).toFixed(2)}
                                            {' · '}to win ${Number(bet.potential_win).toFixed(2)}
                                            {bet.status === 'cashout' && bet.cashout_amount != null && ` · cashed out $${Number(bet.cashout_amount).toFixed(2)}`}
                                        </p>
                                    </div>
                                    {canCashout && (
                                        <button
                                            type="button"
                                            onClick={() => cashout(bet)}
                                            disabled={cashingOut === bet.id}
                                            className="btn-gold px-5 py-2.5 text-xs uppercase tracking-wider"
                                        >
                                            {cashingOut === bet.id ? 'Cashing out…' : `Cash Out $${Number(bet.cashout_value).toFixed(2)}`}
                                        </button>
                                    )}
                                    {bet.status === 'won' && (
                                        <span className="font-display text-base font-bold tabular-nums text-emerald-600 dark:text-neon-green-l">
                                            +${Number(bet.potential_win).toFixed(2)}
                                        </span>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
