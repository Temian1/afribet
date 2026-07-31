import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];
const PAYOUT = 1.96;

export default function CoinFlip() {
    const { balance, updateBalance, addTransaction, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [pick, setPick] = useState('heads');
    const [face, setFace] = useState('heads');
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState(null);
    const [win, setWin] = useState(false);
    const [streak, setStreak] = useState(0);
    const iv = useRef(null);

    useEffect(() => () => clearInterval(iv.current), []);

    const flip = async () => {
        if (flipping || balance < bet) return;
        play('spin');
        setFlipping(true); setResult(null); setWin(false);
        iv.current = setInterval(() => setFace((f) => (f === 'heads' ? 'tails' : 'heads')), 90);

        // Server-authoritative when signed in; local demo otherwise.
        let landed; let won; let newBalance = null;
        if (user) {
            try {
                const res = await originalsApi.play('coinflip', bet, { side: pick });
                landed = res.result.landed;
                won = res.result.won;
                newBalance = res.new_balance;
            } catch (e) {
                clearInterval(iv.current);
                setFlipping(false);
                setResult({ won: false, landed: pick, error: e.message });
                return;
            }
        } else {
            updateBalance(-bet);
            landed = Math.random() < 0.5 ? 'heads' : 'tails';
            won = landed === pick;
        }

        setTimeout(() => {
            clearInterval(iv.current);
            setFace(landed);
            if (won) {
                const payout = bet * PAYOUT;
                if (!user) updateBalance(payout);
                addTransaction?.({ type: 'win', method: 'Coin Flip', amount: parseFloat(payout.toFixed(2)) });
                play('win'); setWin(true); setStreak((s) => s + 1); setTimeout(() => setWin(false), 1600);
            } else { play('lose'); setStreak(0); }
            if (newBalance != null) setBalance(newBalance);
            setResult({ won, landed });
            setFlipping(false);
        }, 900);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-gold-l to-gold bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Coin Flip</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span> · Streak: <span className="font-display font-bold text-neon-green-l">{streak}</span></p>

                <div className="my-6 flex justify-center">
                    <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 bg-gradient-to-br ${face === 'heads' ? 'from-yellow-200 to-gold border-amber-600' : 'from-slate-300 to-slate-400 border-slate-500'} ${flipping ? 'animate-tumble' : 'animate-pop'}`}>
                        <span className="font-display text-4xl font-black text-amber-900">{face === 'heads' ? '$' : '★'}</span>
                    </div>
                </div>

                {result && <div className={`mb-4 rounded-lg border p-3 text-center font-bold ${result.won ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'animate-shake border-neon-red/40 bg-neon-red/10 text-neon-red'}`}>{result.landed.toUpperCase()} — {result.won ? `Won $${(bet * PAYOUT).toFixed(2)}!` : 'You lost.'}</div>}

                <div className="grid grid-cols-2 gap-3">
                    {['heads', 'tails'].map((s) => (
                        <button key={s} onClick={() => { setPick(s); play('click'); }} disabled={flipping} type="button"
                            className={`rounded-lg border py-3 font-heading text-sm font-bold uppercase tracking-wider transition active:scale-95 disabled:opacity-60 ${pick === s ? 'border-purple bg-purple/15 text-purple-d dark:text-purple-l' : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300'}`}>
                            {s === 'heads' ? '$ Heads' : '★ Tails'}
                        </button>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {BETS.map((b) => <button key={b} onClick={() => { setBet(b); play('bet'); }} disabled={flipping} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 disabled:opacity-60 ${bet === b ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} type="button">${b}</button>)}
                </div>
                <button onClick={flip} disabled={flipping || balance < bet} className="mt-5 w-full rounded-lg bg-gradient-to-br from-gold-l to-gold px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98] disabled:opacity-50" type="button">{flipping ? 'Flipping...' : `Flip $${bet}`}</button>
            </div>
        </div>
    );
}
