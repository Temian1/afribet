import { useEffect, useMemo, useState } from 'react';
import { useBetSlip } from '../contexts/BetSlipContext';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import sportsApi from '../services/sportsApi';
import { X } from './Icons';

const QUICK_STAKES = [5, 10, 25, 50, 100];

function StakeInput({ value, onChange, ariaLabel }) {
    return (
        <div className="relative w-24">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
            <input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="0.00"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={ariaLabel}
                className="input py-1.5 pl-6 pr-2 text-xs tabular-nums"
            />
        </div>
    );
}

export default function BetSlip() {
    const { items, remove, clear, open, setOpen } = useBetSlip();
    const { user } = useAuth();
    const { loadWallet, balance } = useApp();
    const toast = useToast();

    const [mode, setMode] = useState('singles'); // singles | multi
    const [stakes, setStakes] = useState({});    // marketId -> stake (singles)
    const [multiStake, setMultiStake] = useState('');
    const [placing, setPlacing] = useState(false);

    // Prune stakes for removed selections.
    useEffect(() => {
        setStakes((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => items.some((i) => String(i.marketId) === id))));
    }, [items]);

    // Multi requires one selection per event across at least two events.
    const distinctEvents = useMemo(() => new Set(items.map((i) => i.eventId)).size, [items]);
    const multiAllowed = items.length >= 2 && distinctEvents === items.length;

    useEffect(() => {
        if (!multiAllowed && mode === 'multi') setMode('singles');
    }, [multiAllowed, mode]);

    const combinedOdds = useMemo(() => items.reduce((acc, i) => acc * (i.odds || 1), 1), [items]);

    const singlesTotal = useMemo(() => items.reduce((sum, i) => sum + (parseFloat(stakes[i.marketId]) || 0), 0), [items, stakes]);
    const singlesReturn = useMemo(() => items.reduce((sum, i) => sum + (parseFloat(stakes[i.marketId]) || 0) * i.odds, 0), [items, stakes]);
    const multiReturn = (parseFloat(multiStake) || 0) * combinedOdds;

    const setAllStakes = (v) => setStakes(Object.fromEntries(items.map((i) => [i.marketId, v])));

    if (items.length === 0) return null;

    const placeSingles = async () => {
        const legs = items.filter((i) => parseFloat(stakes[i.marketId]) > 0);
        if (legs.length === 0) { toast.error('Enter a stake for at least one selection.'); return; }
        const total = legs.reduce((s, i) => s + parseFloat(stakes[i.marketId]), 0);
        if (total > balance) { toast.error('Insufficient balance for total stake.'); return; }

        setPlacing(true);
        const results = await Promise.allSettled(
            legs.map((i) => sportsApi.placeBet({ market_id: i.marketId, stake: parseFloat(stakes[i.marketId]) }))
        );
        setPlacing(false);

        const ok = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.length - ok;

        if (ok > 0) {
            toast.success(`${ok} bet${ok > 1 ? 's' : ''} placed.`, { title: 'Bet Slip' });
            legs.forEach((leg, idx) => { if (results[idx].status === 'fulfilled') remove(leg.marketId); });
            loadWallet();
        }
        if (failed > 0) {
            const firstError = results.find((r) => r.status === 'rejected');
            toast.error(`${failed} bet${failed > 1 ? 's' : ''} failed: ${firstError?.reason?.message ?? 'unknown error'}`);
        }
    };

    const placeMulti = async () => {
        const stake = parseFloat(multiStake);
        if (!stake || stake <= 0) { toast.error('Enter a stake for your multi.'); return; }
        if (stake > balance) { toast.error('Insufficient balance.'); return; }

        setPlacing(true);
        try {
            const res = await sportsApi.placeMultiBet({ market_ids: items.map((i) => i.marketId), stake });
            toast.success(`Multi placed — potential win $${Number(res.bet?.potential_win ?? 0).toFixed(2)}`, { title: 'Bet Slip' });
            clear();
            setMultiStake('');
            loadWallet();
        } catch (e) {
            toast.error(e.message ?? 'Failed to place multi bet.');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <>
            {/* Floating toggle bubble */}
            {!open && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="animate-scale-in fixed bottom-[76px] left-4 z-[1300] flex items-center gap-2.5 rounded-2xl bg-gradient-to-b from-purple-l to-purple-d py-3 pl-4 pr-5 font-heading text-sm font-bold text-[#03150e] shadow-xl shadow-purple/20 transition hover:-translate-y-0.5 hover:brightness-110 sm:left-6 xl:bottom-6"
                    aria-label={`Open bet slip (${items.length} selections)`}
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-black tabular-nums">{items.length}</span>
                    Bet Slip
                    <span className="text-xs font-semibold text-white/75 tabular-nums">@ {combinedOdds.toFixed(2)}</span>
                </button>
            )}

            {/* Slip panel */}
            {open && (
                <aside
                    className="animate-fade-up fixed inset-x-0 bottom-[63px] z-[1300] flex max-h-[80vh] flex-col overflow-hidden rounded-t-3xl border border-[#39f5ad]/20 bg-ink-2 shadow-[0_-20px_60px_rgba(0,0,0,.45),0_0_40px_rgba(57,245,173,.06)] sm:inset-x-auto sm:left-6 sm:w-[380px] sm:rounded-3xl xl:bottom-6"
                    aria-label="Bet slip"
                >
                    <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-white/[.07]">
                        <h2 className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[1.5px] text-slate-900 dark:text-white">
                            Bet Slip
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple px-1.5 text-[11px] font-black tabular-nums text-white">{items.length}</span>
                        </h2>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={clear} className="btn-ghost px-2.5 py-1.5 text-[11px] uppercase tracking-wider !text-neon-red">Clear</button>
                            <button type="button" onClick={() => setOpen(false)} aria-label="Minimize bet slip" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/10">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                        </div>
                    </header>

                    {/* Mode tabs */}
                    <div className="grid grid-cols-2 gap-1 border-b border-slate-200 p-2 dark:border-white/[.07]" role="tablist" aria-label="Bet type">
                        {[['singles', 'Singles'], ['multi', `Multi (${combinedOdds.toFixed(2)})`]].map(([id, label]) => (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={mode === id}
                                disabled={id === 'multi' && !multiAllowed}
                                onClick={() => setMode(id)}
                                className={`rounded-xl py-2 font-heading text-xs font-bold uppercase tracking-wide transition disabled:opacity-40 ${mode === id ? 'bg-purple/15 text-purple-d dark:bg-purple/25 dark:text-purple-l' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[.06]'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    {!multiAllowed && items.length >= 2 && (
                        <p className="border-b border-slate-200 px-5 py-2 text-[11px] text-slate-500 dark:border-white/[.07]">Multi needs one selection per event.</p>
                    )}

                    {/* Selections */}
                    <div className="min-h-0 flex-1 overflow-y-auto p-3">
                        {items.map((item) => (
                            <div key={item.marketId} className="mb-2 rounded-xl border border-slate-200 p-3 dark:border-white/[.08]">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                                        <p className="mt-0.5 truncate text-xs text-slate-500">{item.eventName}</p>
                                        <p className="text-[10px] uppercase tracking-wide text-slate-400">{item.marketType}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className="rounded-lg bg-gold/12 px-2 py-1 font-display text-sm font-bold tabular-nums text-amber-600 dark:text-gold-l">{item.odds.toFixed(2)}</span>
                                        <button type="button" onClick={() => remove(item.marketId)} aria-label={`Remove ${item.label}`} className="rounded-md p-1 text-slate-400 transition hover:text-neon-red">
                                            <X size={15} />
                                        </button>
                                    </div>
                                </div>
                                {mode === 'singles' && (
                                    <div className="mt-2 flex items-center justify-between gap-2">
                                        <StakeInput
                                            value={stakes[item.marketId] ?? ''}
                                            onChange={(v) => setStakes((prev) => ({ ...prev, [item.marketId]: v }))}
                                            ariaLabel={`Stake for ${item.label}`}
                                        />
                                        <span className="text-[11px] tabular-nums text-slate-500">
                                            Returns <strong className="text-emerald-600 dark:text-neon-green-l">${(((parseFloat(stakes[item.marketId]) || 0) * item.odds) || 0).toFixed(2)}</strong>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer: stakes + place */}
                    <footer className="border-t border-slate-200 p-4 dark:border-white/[.07]">
                        <div className="mb-3 flex flex-wrap gap-1.5">
                            {QUICK_STAKES.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => (mode === 'multi' ? setMultiStake(q) : setAllStakes(q))}
                                    className="rounded-lg border border-slate-200 px-2.5 py-1 font-heading text-xs font-bold tabular-nums text-slate-600 transition hover:border-gold/50 hover:text-amber-600 dark:border-white/10 dark:text-slate-300 dark:hover:text-gold-l"
                                >
                                    ${q}
                                </button>
                            ))}
                        </div>

                        {mode === 'multi' && (
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <StakeInput value={multiStake} onChange={setMultiStake} ariaLabel="Multi stake" />
                                <div className="text-right text-xs text-slate-500">
                                    <span className="block">Combined odds <strong className="tabular-nums text-slate-900 dark:text-white">{combinedOdds.toFixed(2)}</strong></span>
                                    <span className="block">Returns <strong className="tabular-nums text-emerald-600 dark:text-neon-green-l">${multiReturn.toFixed(2)}</strong></span>
                                </div>
                            </div>
                        )}

                        {mode === 'singles' && (
                            <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                                <span>Total stake <strong className="tabular-nums text-slate-900 dark:text-white">${singlesTotal.toFixed(2)}</strong></span>
                                <span>Returns <strong className="tabular-nums text-emerald-600 dark:text-neon-green-l">${singlesReturn.toFixed(2)}</strong></span>
                            </div>
                        )}

                        {user ? (
                            <button
                                type="button"
                                disabled={placing}
                                onClick={mode === 'multi' ? placeMulti : placeSingles}
                                className="btn-gold w-full py-3 text-sm uppercase tracking-[1.5px]"
                            >
                                {placing ? 'Placing…' : mode === 'multi' ? `Place Multi $${(parseFloat(multiStake) || 0).toFixed(2)}` : `Place ${items.filter((i) => parseFloat(stakes[i.marketId]) > 0).length || ''} Bet${items.filter((i) => parseFloat(stakes[i.marketId]) > 0).length !== 1 ? 's' : ''} $${singlesTotal.toFixed(2)}`}
                            </button>
                        ) : (
                            <p className="rounded-xl border border-gold/30 bg-gold/10 p-3 text-center text-xs font-semibold text-amber-700 dark:text-gold-l">
                                Log in to place your bets — your slip is saved.
                            </p>
                        )}
                    </footer>
                </aside>
            )}
        </>
    );
}
