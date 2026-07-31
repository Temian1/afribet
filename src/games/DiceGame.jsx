import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];

export default function DiceGame() {
    const { balance, updateBalance, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [target, setTarget] = useState(50);
    const [mode, setMode] = useState('over');
    const [roll, setRoll] = useState(null);
    const [display, setDisplay] = useState(50);
    const [rolling, setRolling] = useState(false);
    const [win, setWin] = useState(false);
    const iv = useRef(null);

    useEffect(() => () => clearInterval(iv.current), []);

    const chance = mode === 'over' ? 100 - target : target;
    const multiplier = Math.max(1.01, (98 / chance)).toFixed(2);

    const start = async () => {
        if (rolling || balance < bet) return;
        play('roll');
        setRolling(true); setRoll(null); setWin(false);
        iv.current = setInterval(() => setDisplay(Math.floor(Math.random() * 100) + 1), 55);

        // Server-authoritative when signed in; local demo otherwise.
        let value; let won; let newBalance = null;
        if (user) {
            try {
                const res = await originalsApi.play('dice', bet, { target, mode });
                value = res.result.roll;
                won = res.result.won;
                newBalance = res.new_balance;
            } catch (e) {
                clearInterval(iv.current);
                setRolling(false);
                setRoll({ value: 0, won: false, error: e.message });
                return;
            }
        } else {
            updateBalance(-bet);
            value = Math.floor(Math.random() * 100) + 1;
            won = mode === 'over' ? value > target : value < target;
        }

        setTimeout(() => {
            clearInterval(iv.current);
            if (won) {
                if (!user) updateBalance(bet * Number(multiplier));
                play('win'); setWin(true);
            } else play('lose');
            if (newBalance != null) setBalance(newBalance);
            setDisplay(value);
            setRoll({ value, won });
            setRolling(false);
        }, 750);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-gold-l via-orange-500 to-neon-red bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Hot Dice</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                <div className="my-5 flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[.04] sm:my-6">
                    <div className={`text-4xl ${rolling ? 'animate-tumble' : ''}`}>🎲</div>
                    <div className={`mt-1 font-display text-6xl font-black ${roll ? (roll.won ? 'text-neon-green-l' : 'text-neon-red') : 'text-purple-l'}`}>{display}</div>
                    {roll && <p className={`mt-3 w-full rounded-lg border p-3 text-center font-bold ${roll.won ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'animate-shake border-neon-red/40 bg-neon-red/10 text-neon-red'}`}>{roll.won ? `Won $${(bet * multiplier).toFixed(2)}` : 'Lost'}</p>}
                </div>

                {/* target track */}
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Roll {mode} <span className="text-purple-l">{target}</span></label>
                <div className="relative mt-2 h-3 rounded-full bg-slate-200 dark:bg-white/10">
                    <div className="absolute inset-y-0 rounded-full bg-gradient-to-r from-neon-green/60 to-neon-green-l" style={{ left: mode === 'over' ? `${target}%` : 0, right: mode === 'over' ? 0 : `${100 - target}%` }} />
                    <span className="absolute -top-1 h-5 w-1 -translate-x-1/2 rounded bg-gold" style={{ left: `${target}%` }} />
                </div>
                <input className="mt-2 w-full accent-purple" type="range" min="5" max="95" value={target} onChange={(e) => setTarget(Number(e.target.value))} disabled={rolling} />

                <div className="mt-3 grid grid-cols-2 gap-2">
                    {['over', 'under'].map((item) => <button key={item} disabled={rolling} className={`rounded-lg border px-4 py-2 font-heading font-bold uppercase transition active:scale-95 disabled:opacity-60 ${mode === item ? 'border-purple bg-purple/15 text-purple-d dark:text-purple-l' : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300'}`} onClick={() => { setMode(item); play('click'); }} type="button">{item}</button>)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {BETS.map((item) => <button key={item} disabled={rolling} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 disabled:opacity-60 sm:px-4 ${bet === item ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} onClick={() => { setBet(item); play('bet'); }} type="button">${item}</button>)}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/[.04]"><b className="block text-cyan-l">{chance.toFixed(1)}%</b>Chance</div>
                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/[.04]"><b className="block text-gold-l">{multiplier}x</b>Multiplier</div>
                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/[.04]"><b className="block text-purple-l">${(bet * multiplier).toFixed(2)}</b>Payout</div>
                </div>
                <button className="mt-5 w-full rounded-lg bg-gold px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98] disabled:opacity-50" onClick={start} disabled={rolling || balance < bet} type="button">{rolling ? 'Rolling...' : 'Roll'}</button>
            </div>
        </div>
    );
}
