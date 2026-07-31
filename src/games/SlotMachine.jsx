import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const SYMBOLS = ['7', '★', '◆', 'BAR', '🍒'];
const BETS = [1, 5, 10, 25, 50];
const STRIP = [...SYMBOLS, ...SYMBOLS, ...SYMBOLS];

function Reel({ spinning, symbol }) {
    return (
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-gold/30 bg-slate-950">
            {spinning ? (
                <div className="animate-reel flex flex-col items-center blur-[1.5px]">
                    {STRIP.map((s, i) => (
                        <span key={i} className="flex h-16 items-center justify-center font-display text-3xl font-black text-gold-l">{s}</span>
                    ))}
                </div>
            ) : (
                <span className="animate-pop font-display text-3xl font-black text-gold-l sm:text-4xl">{symbol}</span>
            )}
        </div>
    );
}

export default function SlotMachine() {
    const { balance, updateBalance, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [reels, setReels] = useState(['7', '★', '◆']);
    const [spin3, setSpin3] = useState([false, false, false]);
    const [result, setResult] = useState('');
    const [win, setWin] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const timers = useRef([]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const spin = async () => {
        if (spinning || balance < bet) return;
        play('spin');
        setSpinning(true);
        setWin(false);
        setResult('');
        setSpin3([true, true, true]);

        // Server-authoritative when signed in; local demo otherwise.
        let next; let payout; let newBalance = null;
        if (user) {
            try {
                const res = await originalsApi.play('slots', bet, {});
                next = res.result.reels;
                payout = res.payout;
                newBalance = res.new_balance;
            } catch (e) {
                setSpinning(false);
                setSpin3([false, false, false]);
                setResult(e.message ?? 'Spin failed.');
                return;
            }
        } else {
            updateBalance(-bet);
            next = Array.from({ length: 3 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
            payout = next.every(item => item === next[0]) ? bet * 12 : 0;
        }

        [700, 1000, 1300].forEach((delay, ri) => {
            timers.current.push(setTimeout(() => {
                play('reelStop');
                setReels(prev => { const n = [...prev]; n[ri] = next[ri]; return n; });
                setSpin3(prev => { const n = [...prev]; n[ri] = false; return n; });
                if (ri === 2) {
                    if (payout) {
                        if (!user) updateBalance(payout);
                        play('bigWin'); setWin(true);
                    } else play('lose');
                    if (newBalance != null) setBalance(newBalance);
                    setResult(payout ? `JACKPOT! +$${payout.toFixed(2)}` : 'No win. Try again.');
                    setSpinning(false);
                }
            }, delay));
        });
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-gold-l to-gold bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Vegas Blitz</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                <div className={`my-5 grid grid-cols-3 gap-2 rounded-2xl border bg-black p-3 transition-colors sm:my-6 sm:gap-3 sm:p-4 ${win ? 'border-gold text-gold animate-glow' : 'border-gold/20'}`}>
                    {reels.map((symbol, index) => <Reel key={index} spinning={spin3[index]} symbol={symbol} />)}
                </div>

                {result && <div className={`mb-4 rounded-lg border p-3 text-center font-display text-sm font-bold ${win ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'animate-shake border-neon-red/40 bg-neon-red/10 text-neon-red'}`}>{result}</div>}

                <div className="mb-4 flex flex-wrap gap-2">
                    {BETS.map((item) => (
                        <button key={item} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 sm:px-4 ${bet === item ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} onClick={() => { setBet(item); play('bet'); }} type="button">
                            ${item}
                        </button>
                    ))}
                </div>
                <button className="w-full rounded-lg bg-gradient-to-br from-gold-l to-gold px-4 py-4 font-heading text-base font-black uppercase tracking-[3px] text-black transition active:scale-[.98] disabled:opacity-50" onClick={spin} disabled={spinning || balance < bet} type="button">
                    {spinning ? 'Spinning...' : `Spin $${bet}`}
                </button>
            </div>
        </div>
    );
}
