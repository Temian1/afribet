import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];
const OPTIONS = [
    { id: 'red', label: 'Red', pays: 2 },
    { id: 'black', label: 'Black', pays: 2 },
    { id: 'green', label: 'Green', pays: 14 },
    { id: 'even', label: 'Even', pays: 2 },
    { id: 'odd', label: 'Odd', pays: 2 },
];

export default function Roulette() {
    const { balance, updateBalance, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [choice, setChoice] = useState('red');
    const [result, setResult] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [rot, setRot] = useState(0);
    const [ballRot, setBallRot] = useState(0);
    const [win, setWin] = useState(false);
    const t = useRef(null);

    useEffect(() => () => clearTimeout(t.current), []);

    const spin = async () => {
        if (spinning || balance < bet) return;
        play('spin');
        setSpinning(true); setResult(null); setWin(false);
        setRot(r => r + 1440 + Math.random() * 360);
        setBallRot(r => r - (1800 + Math.random() * 360));

        // Server-authoritative when signed in; local demo otherwise.
        let number; let won; let payout; let newBalance = null;
        if (user) {
            try {
                const res = await originalsApi.play('roulette', bet, { choice });
                number = res.result.number;
                won = res.result.won;
                payout = res.payout;
                newBalance = res.new_balance;
            } catch (e) {
                setSpinning(false);
                setResult({ number: 0, color: 'green', won: false, payout: 0, error: e.message });
                return;
            }
        } else {
            updateBalance(-bet);
            number = Math.floor(Math.random() * 37);
            const c = number === 0 ? 'green' : number % 2 === 0 ? 'black' : 'red';
            won = choice === c || (choice === 'even' && number !== 0 && number % 2 === 0) || (choice === 'odd' && number % 2 === 1);
            payout = won ? bet * OPTIONS.find((item) => item.id === choice).pays : 0;
        }
        const color = number === 0 ? 'green' : number % 2 === 0 ? 'black' : 'red';

        t.current = setTimeout(() => {
            if (payout) {
                if (!user) updateBalance(payout);
                play('bigWin'); setWin(true);
            } else play('lose');
            if (newBalance != null) setBalance(newBalance);
            setResult({ number, color, won, payout });
            setSpinning(false);
        }, 3600);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-gold-l to-gold bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Neon Roulette</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                <div className="relative mx-auto my-6 h-56 w-56 sm:h-64 sm:w-64">
                    {/* pointer */}
                    <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[14px] border-x-transparent border-t-gold" />
                    {/* wheel */}
                    <div
                        className="h-full w-full rounded-full border-8 border-gold/40 bg-[conic-gradient(#dc2626_0_10%,#111_10%_20%,#dc2626_20%_30%,#111_30%_40%,#16a34a_40%_45%,#111_45%_60%,#dc2626_60%_80%,#111_80%_100%)]"
                        style={{ transform: `rotate(${rot}deg)`, transition: 'transform 3.6s cubic-bezier(0.15,0.75,0.25,1)' }}
                    />
                    {/* orbiting ball */}
                    <div className="pointer-events-none absolute inset-0" style={{ transform: `rotate(${ballRot}deg)`, transition: 'transform 3.6s cubic-bezier(0.15,0.75,0.25,1)' }}>
                        <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                    </div>
                    {/* hub */}
                    <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black font-display text-3xl font-black text-gold-l sm:h-24 sm:w-24">
                        {spinning ? <span className="animate-spin text-xl">🎡</span> : (result?.number ?? '?')}
                    </div>
                </div>

                {result && <div className={`mb-4 rounded-lg border p-3 text-center font-bold ${result.won ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'border-neon-red/40 bg-neon-red/10 text-neon-red'}`}>{result.won ? `Won $${result.payout.toFixed(2)} on ${result.number} ${result.color}` : `Landed ${result.number} ${result.color}`}</div>}

                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {OPTIONS.map((item) => <button key={item.id} disabled={spinning} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold uppercase transition active:scale-95 disabled:opacity-60 ${choice === item.id ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} onClick={() => { setChoice(item.id); play('bet'); }} type="button">{item.label}<span className="block text-[10px] opacity-70">{item.pays}:1</span></button>)}
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                    {BETS.map((item) => <button key={item} disabled={spinning} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 disabled:opacity-60 sm:px-4 ${bet === item ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} onClick={() => { setBet(item); play('bet'); }} type="button">${item}</button>)}
                </div>
                <button className="w-full rounded-lg bg-gold px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98] disabled:opacity-50" onClick={spin} disabled={spinning || balance < bet} type="button">{spinning ? 'Spinning...' : 'Spin'}</button>
            </div>
        </div>
    );
}
