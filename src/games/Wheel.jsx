import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];
// 12 segments — multipliers with matching colors
const SEGMENTS = [
    { m: 0, c: '#334155' }, { m: 1.5, c: '#8b5cf6' }, { m: 2, c: '#22d3ee' }, { m: 0, c: '#334155' },
    { m: 3, c: '#f59e0b' }, { m: 1.5, c: '#8b5cf6' }, { m: 0, c: '#334155' }, { m: 5, c: '#34d399' },
    { m: 2, c: '#22d3ee' }, { m: 0, c: '#334155' }, { m: 1.5, c: '#8b5cf6' }, { m: 10, c: '#ef4444' },
];
const N = SEGMENTS.length;
const SEG = 360 / N;
const R = 130, C = 140;

function sectorPath(i) {
    const a0 = (i * SEG - 90 - SEG / 2) * Math.PI / 180;
    const a1 = ((i + 1) * SEG - 90 - SEG / 2) * Math.PI / 180;
    return `M${C} ${C} L${C + R * Math.cos(a0)} ${C + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${C + R * Math.cos(a1)} ${C + R * Math.sin(a1)} Z`;
}

export default function Wheel() {
    const { balance, updateBalance, addTransaction, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [rot, setRot] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [win, setWin] = useState(false);
    const t = useRef(null);

    useEffect(() => () => clearTimeout(t.current), []);

    const spin = async () => {
        if (spinning || balance < bet) return;
        play('spin');
        setSpinning(true); setResult(null); setWin(false);

        // Server-authoritative when signed in; local demo otherwise.
        let idx; let newBalance = null;
        if (user) {
            try {
                const res = await originalsApi.play('wheel', bet, {});
                idx = res.result.segment;
                newBalance = res.new_balance;
            } catch (e) {
                setSpinning(false);
                setResult({ m: 0, payout: 0, error: e.message });
                return;
            }
        } else {
            updateBalance(-bet);
            idx = Math.floor(Math.random() * N);
        }

        const desiredMod = (360 - (idx * SEG + SEG / 2) + 360) % 360;
        let final = rot - (rot % 360) + 360 * 5 + desiredMod;
        if (final <= rot) final += 360;
        setRot(final);

        t.current = setTimeout(() => {
            const seg = SEGMENTS[idx];
            const payout = bet * seg.m;
            if (seg.m > 0) {
                if (!user) updateBalance(payout);
                addTransaction?.({ type: 'win', method: 'Fortune Wheel', amount: parseFloat(payout.toFixed(2)) });
                play(seg.m >= 5 ? 'bigWin' : 'win'); setWin(true); setTimeout(() => setWin(false), 1800);
            } else play('lose');
            if (newBalance != null) setBalance(newBalance);
            setResult({ m: seg.m, payout });
            setSpinning(false);
        }, 4200);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-purple-l to-gold-l bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Fortune Wheel</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                <div className="relative mx-auto my-6 w-[280px] max-w-full">
                    <div className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-gold" />
                    <svg viewBox="0 0 280 280" className="w-full" style={{ transform: `rotate(${rot}deg)`, transition: 'transform 4.2s cubic-bezier(0.12,0.75,0.2,1)' }}>
                        {SEGMENTS.map((s, i) => {
                            const mid = (i * SEG - 90) * Math.PI / 180;
                            return (
                                <g key={i}>
                                    <path d={sectorPath(i)} fill={s.c} stroke="rgba(0,0,0,.35)" strokeWidth="1" />
                                    <text x={C + R * 0.72 * Math.cos(mid)} y={C + R * 0.72 * Math.sin(mid)} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontFamily="Orbitron,monospace" fontWeight="900" fontSize="14" transform={`rotate(${i * SEG} ${C + R * 0.72 * Math.cos(mid)} ${C + R * 0.72 * Math.sin(mid)})`}>{s.m}x</text>
                                </g>
                            );
                        })}
                        <circle cx={C} cy={C} r="22" fill="#0b0b14" stroke="#f59e0b" strokeWidth="2" />
                    </svg>
                </div>

                {result && <div className={`mb-4 rounded-lg border p-3 text-center font-bold ${result.m > 0 ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'border-neon-red/40 bg-neon-red/10 text-neon-red'}`}>{result.m > 0 ? `${result.m}x — Won $${result.payout.toFixed(2)}!` : 'No win this spin.'}</div>}

                <div className="mb-4 flex flex-wrap gap-2">
                    {BETS.map((b) => <button key={b} onClick={() => { setBet(b); play('bet'); }} disabled={spinning} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 disabled:opacity-60 ${bet === b ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} type="button">${b}</button>)}
                </div>
                <button onClick={spin} disabled={spinning || balance < bet} className="w-full rounded-lg bg-gradient-to-br from-purple to-purple-d px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-white transition active:scale-[.98] disabled:opacity-50" type="button">{spinning ? 'Spinning...' : `Spin $${bet}`}</button>
            </div>
        </div>
    );
}
