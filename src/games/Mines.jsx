import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];
const SIZE = 25;

function calcMult(picks, mines) {
    let m = 1;
    for (let j = 0; j < picks; j++) m *= (SIZE - j) / (SIZE - mines - j);
    return m * 0.99;
}

export default function Mines() {
    const { balance, updateBalance, addTransaction, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [mines, setMines] = useState(3);
    const [layout, setLayout] = useState(new Set());
    const [revealed, setRevealed] = useState(new Set());
    const [phase, setPhase] = useState('idle'); // idle | playing | busted | cashed
    const [win, setWin] = useState(false);
    const [roundId, setRoundId] = useState(null);
    const [busy, setBusy] = useState(false);

    const picks = revealed.size;
    const mult = calcMult(picks, mines);
    const nextMult = calcMult(picks + 1, mines);

    const start = async () => {
        if (phase === 'playing' || balance < bet || busy) return;
        play('bet');

        // Server holds the mine layout when signed in; local demo otherwise.
        if (user) {
            setBusy(true);
            try {
                const res = await originalsApi.minesStart(bet, mines);
                setRoundId(res.round_id);
                setBalance(res.new_balance);
                setLayout(new Set());
            } catch {
                setBusy(false);
                setPhase('idle');
                return;
            }
            setBusy(false);
        } else {
            updateBalance(-bet);
            const set = new Set();
            while (set.size < mines) set.add(Math.floor(Math.random() * SIZE));
            setLayout(set);
        }
        setRevealed(new Set()); setPhase('playing'); setWin(false);
    };

    const reveal = async (i) => {
        if (phase !== 'playing' || revealed.has(i) || busy) return;

        if (user && roundId) {
            setBusy(true);
            try {
                const res = await originalsApi.minesReveal(roundId, i);
                if (res.hit_mine) {
                    setLayout(new Set(res.mines));
                    setRevealed(new Set([...revealed, i]));
                    setPhase('busted'); play('crash');
                    if (res.new_balance != null) setBalance(res.new_balance);
                } else if (res.completed) {
                    setLayout(new Set(res.mines));
                    setRevealed(new Set([...revealed, i]));
                    setBalance(res.new_balance);
                    addTransaction?.({ type: 'win', method: 'Mines', amount: Number(res.payout) });
                    setPhase('cashed'); setWin(true); play('bigWin');
                    setTimeout(() => setWin(false), 1800);
                } else {
                    setRevealed(new Set([...revealed, i])); play('pegHit');
                }
            } catch { /* keep state */ }
            setBusy(false);
            return;
        }

        if (layout.has(i)) {
            setRevealed(new Set([...revealed, i]));
            setPhase('busted'); play('crash');
            return;
        }
        const next = new Set([...revealed, i]);
        setRevealed(next); play('pegHit');
        if (next.size === SIZE - mines) cashOut(next.size); // all gems found
    };

    const cashOut = async (picksOverride) => {
        if (phase !== 'playing' || busy) return;

        if (user && roundId) {
            setBusy(true);
            try {
                const res = await originalsApi.minesCashout(roundId);
                setLayout(new Set(res.mines));
                setBalance(res.new_balance);
                addTransaction?.({ type: 'win', method: 'Mines', amount: Number(res.payout) });
                setPhase('cashed'); setWin(true); play('bigWin');
                setTimeout(() => setWin(false), 1800);
            } catch { /* keep state */ }
            setBusy(false);
            return;
        }

        const p = picksOverride || picks;
        const payout = bet * calcMult(p, mines);
        updateBalance(payout);
        addTransaction?.({ type: 'win', method: 'Mines', amount: parseFloat(payout.toFixed(2)) });
        setPhase('cashed'); setWin(true); play('bigWin');
        setTimeout(() => setWin(false), 1800);
    };

    const tileState = (i) => {
        if (revealed.has(i)) return layout.has(i) ? 'bomb' : 'gem';
        if ((phase === 'busted' || phase === 'cashed') && layout.has(i)) return 'bomb-faded';
        return 'hidden';
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-gold-l to-gold bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Diamond Mines</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                {phase !== 'idle' && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-white/[.04]">
                        <span className="text-sm text-slate-500">Current: <b className="font-display text-gold-l">{mult.toFixed(2)}x</b></span>
                        {phase === 'playing' && <span className="text-sm text-slate-500">Next: <b className="font-display text-neon-green-l">{nextMult.toFixed(2)}x</b></span>}
                    </div>
                )}

                <div className="my-5 grid grid-cols-5 gap-2">
                    {Array.from({ length: SIZE }).map((_, i) => {
                        const st = tileState(i);
                        return (
                            <button key={i} onClick={() => reveal(i)} disabled={phase !== 'playing'} type="button"
                                className={`flex aspect-square items-center justify-center rounded-lg border text-xl transition active:scale-95 ${
                                    st === 'hidden' ? 'border-slate-200 bg-slate-100 hover:border-purple/40 hover:bg-purple/10 dark:border-white/10 dark:bg-white/[.05]'
                                    : st === 'gem' ? 'border-neon-green/50 bg-neon-green/15'
                                    : st === 'bomb' ? 'border-neon-red/60 bg-neon-red/20 animate-shake'
                                    : 'border-neon-red/30 bg-neon-red/10 opacity-60'}`}>
                                {st === 'gem' && <span className="animate-pop">💎</span>}
                                {(st === 'bomb' || st === 'bomb-faded') && <span>💣</span>}
                            </button>
                        );
                    })}
                </div>

                {phase === 'busted' && <div className="mb-4 rounded-lg border border-neon-red/40 bg-neon-red/10 p-3 text-center font-bold text-neon-red animate-shake">Boom! You hit a mine.</div>}
                {phase === 'cashed' && <div className="mb-4 rounded-lg border border-neon-green/40 bg-neon-green/10 p-3 text-center font-bold text-neon-green-l animate-pop">Cashed out {mult.toFixed(2)}x!</div>}

                {phase === 'playing' ? (
                    <button onClick={() => cashOut()} disabled={picks === 0} className="w-full rounded-lg bg-neon-green px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98] disabled:opacity-50" type="button">
                        {picks === 0 ? 'Pick a tile' : `Cash Out $${(bet * mult).toFixed(2)}`}
                    </button>
                ) : (
                    <>
                        <div className="mb-3">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Mines: <span className="text-purple-l">{mines}</span></p>
                            <input type="range" min="1" max="24" value={mines} onChange={(e) => setMines(Number(e.target.value))} className="w-full accent-purple" />
                        </div>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {BETS.map((b) => <button key={b} onClick={() => { setBet(b); play('bet'); }} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 ${bet === b ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} type="button">${b}</button>)}
                        </div>
                        <button onClick={start} disabled={balance < bet} className="w-full rounded-lg bg-gradient-to-br from-gold-l to-gold px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98] disabled:opacity-50" type="button">Start Game ${bet}</button>
                    </>
                )}
            </div>
        </div>
    );
}
