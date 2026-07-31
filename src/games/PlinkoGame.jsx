import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];
const MULTS = [10, 3, 1.5, 0.4, 0.2, 0.4, 1.5, 3, 10];
const ROWS = 7;

export default function PlinkoGame() {
    const { balance, updateBalance, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [bucket, setBucket] = useState(null);
    const [result, setResult] = useState('');
    const [dropping, setDropping] = useState(false);
    const [ball, setResBall] = useState(null); // {x,y} in %
    const [hitRow, setHitRow] = useState(-1);
    const [win, setWin] = useState(false);
    const timers = useRef([]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const drop = async () => {
        if (dropping || balance < bet) return;
        play('drop');
        setDropping(true); setResult(''); setBucket(null); setWin(false);

        // Server-authoritative when signed in; local demo otherwise.
        let index; let newBalance = null;
        if (user) {
            try {
                const res = await originalsApi.play('plinko', bet, {});
                index = res.result.bucket;
                newBalance = res.new_balance;
            } catch (e) {
                setDropping(false);
                setResult(e.message ?? 'Drop failed.');
                return;
            }
        } else {
            updateBalance(-bet);
            index = Math.floor(Math.random() * MULTS.length);
        }
        const targetX = ((index + 0.5) / MULTS.length) * 100;
        setResBall({ x: 50, y: 0 });

        for (let k = 1; k <= ROWS; k++) {
            timers.current.push(setTimeout(() => {
                const y = (k / ROWS) * 82;
                const x = 50 + (targetX - 50) * (k / ROWS) + (Math.random() * 8 - 4);
                setResBall({ x, y });
                setHitRow(k - 1);
                play('pegHit');
            }, k * 150));
        }

        timers.current.push(setTimeout(() => {
            setResBall({ x: targetX, y: 90 });
            setHitRow(-1);
            const payout = bet * MULTS[index];
            if (!user) updateBalance(payout);
            if (newBalance != null) setBalance(newBalance);
            const big = MULTS[index] >= 1.5;
            if (big) { play('bigWin'); setWin(true); } else play(MULTS[index] >= 1 ? 'win' : 'lose');
            setBucket(index);
            setResult(`${MULTS[index]}x — ${payout >= bet ? 'won' : 'returned'} $${payout.toFixed(2)}`);
            setDropping(false);
        }, (ROWS + 1) * 150));
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-cyan-l to-cyan bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Neon Drop</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                <div className="relative my-5 h-64 overflow-hidden rounded-2xl border border-cyan/20 bg-gradient-to-b from-[#0a1420] to-black p-5 sm:my-6">
                    <div className="grid h-full content-around gap-2">
                        {Array.from({ length: ROWS }).map((_, row) => (
                            <div key={row} className="flex justify-center gap-5">
                                {Array.from({ length: row + 2 }).map((__, peg) => (
                                    <span key={peg} className={`h-2.5 w-2.5 rounded-full bg-cyan-l text-cyan-l ${hitRow === row ? 'animate-peg' : ''}`} style={{ boxShadow: '0 0 10px #22d3ee' }} />
                                ))}
                            </div>
                        ))}
                    </div>
                    {ball && (
                        <span
                            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-200 to-gold"
                            style={{ left: `${ball.x}%`, top: `${ball.y}%`, transition: 'left 150ms ease-in-out, top 150ms ease-in-out', boxShadow: '0 0 14px #fbbf24' }}
                        />
                    )}
                </div>

                <div className="grid grid-cols-9 gap-1">
                    {MULTS.map((mult, index) => <div key={index} className={`rounded-md border px-1 py-2 text-center font-display text-[10px] font-bold transition ${bucket === index ? '-translate-y-1 border-gold bg-gold text-black' : 'border-cyan/30 bg-cyan/10 text-cyan-l'}`}>{mult}x</div>)}
                </div>

                {result && <div className={`mt-4 rounded-lg border p-3 text-center font-bold ${win ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'border-purple/30 bg-purple/10 text-purple-l'}`}>{result}</div>}

                <div className="mt-4 flex flex-wrap gap-2">
                    {BETS.map((item) => <button key={item} disabled={dropping} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 disabled:opacity-60 sm:px-4 ${bet === item ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} onClick={() => { setBet(item); play('bet'); }} type="button">${item}</button>)}
                </div>
                <button className="mt-5 w-full rounded-lg bg-cyan px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98] disabled:opacity-50" onClick={drop} disabled={dropping || balance < bet} type="button">{dropping ? 'Dropping...' : 'Drop'}</button>
            </div>
        </div>
    );
}
