import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];

export default function Limbo() {
    const { balance, updateBalance, addTransaction, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [target, setTarget] = useState('2.00');
    const [display, setDisplay] = useState(1);
    const [result, setResult] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [win, setWin] = useState(false);
    const iv = useRef(null);

    useEffect(() => () => clearInterval(iv.current), []);

    const chance = Math.min(99, (99 / Math.max(1.01, Number(target) || 1.01))).toFixed(2);

    const playRound = async () => {
        if (rolling || balance < bet) return;
        const t = Math.max(1.01, Number(target) || 1.01);
        play('launch');
        setRolling(true); setResult(null); setWin(false);

        // Server-authoritative when signed in; local demo otherwise.
        let final; let won; let newBalance = null;
        if (user) {
            try {
                const res = await originalsApi.play('limbo', bet, { target: t });
                final = Number(res.result.result);
                won = res.result.won;
                newBalance = res.new_balance;
            } catch (e) {
                setRolling(false);
                setResult({ won: false, final: 0, error: e.message });
                return;
            }
        } else {
            updateBalance(-bet);
            final = Number(Math.max(1, 0.99 / (1 - Math.random())).toFixed(2));
            won = final >= t;
        }

        let step = 0;
        iv.current = setInterval(() => {
            step++;
            setDisplay(Number((1 + Math.random() * Math.min(final, 10)).toFixed(2)));
            if (step > 12) {
                clearInterval(iv.current);
                setDisplay(final);
                if (won) {
                    const payout = bet * t;
                    if (!user) updateBalance(payout);
                    addTransaction?.({ type: 'win', method: 'Limbo', amount: parseFloat(payout.toFixed(2)) });
                    play('bigWin'); setWin(true); setTimeout(() => setWin(false), 1800);
                } else play('lose');
                if (newBalance != null) setBalance(newBalance);
                setResult({ won, final });
                setRolling(false);
            }
        }, 55);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-purple-l to-purple bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Limbo</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                <div className="my-6 flex h-40 items-center justify-center rounded-2xl border border-purple/20 bg-gradient-to-b from-[#0a0a1e] to-black">
                    <div className={`font-display text-6xl font-black ${result ? (result.won ? 'text-neon-green-l' : 'text-neon-red') : 'text-purple-l'}`} style={{ textShadow: '0 0 30px currentColor' }}>
                        {display.toFixed(2)}x
                    </div>
                </div>

                {result && <div className={`mb-4 rounded-lg border p-3 text-center font-bold ${result.won ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'animate-shake border-neon-red/40 bg-neon-red/10 text-neon-red'}`}>{result.won ? `Won $${(bet * Number(target)).toFixed(2)}!` : `Rolled ${result.final}x — under target`}</div>}

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Target Multiplier</label>
                        <input type="number" min="1.01" step="0.01" value={target} onChange={(e) => setTarget(e.target.value)} disabled={rolling} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-display text-lg outline-none focus:border-purple-l dark:border-white/10 dark:bg-white/[.04]" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Win Chance</label>
                        <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-display text-lg text-cyan-l dark:border-white/10 dark:bg-white/[.04]">{chance}%</div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {BETS.map((b) => <button key={b} onClick={() => { setBet(b); play('bet'); }} disabled={rolling} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 disabled:opacity-60 ${bet === b ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} type="button">${b}</button>)}
                </div>
                <button onClick={playRound} disabled={rolling || balance < bet} className="mt-5 w-full rounded-lg bg-gradient-to-br from-purple to-purple-d px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-white transition active:scale-[.98] disabled:opacity-50" type="button">{rolling ? 'Rolling...' : `Bet $${bet}`}</button>
            </div>
        </div>
    );
}
