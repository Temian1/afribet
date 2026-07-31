import { useEffect, useRef, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [1, 5, 10, 25, 50];
const STARS = Array.from({ length: 28 }, (_, i) => ({ x: (i * 53) % 100, y: (i * 71) % 100, s: 1 + (i % 3) }));

export default function CrashGame() {
    const { balance, updateBalance, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(5);
    const [running, setRunning] = useState(false);
    const [cashed, setCashed] = useState(false);
    const [crashed, setCrashed] = useState(false);
    const [mult, setMult] = useState(1);
    const [message, setMessage] = useState('');
    const tickRef = useRef(0);
    const roundRef = useRef(null);   // server round id
    const localCrashAt = useRef(0);  // demo crash point (guests only)

    // Multiplier climbs at the same linear rate the server uses (0.07 per 100ms).
    useEffect(() => {
        if (!running) return undefined;
        const timer = setInterval(() => {
            setMult((current) => {
                const next = Number((current + 0.07).toFixed(2));
                if (++tickRef.current % 4 === 0) play('tick');
                if (!user && next >= localCrashAt.current) {
                    clearInterval(timer);
                    setRunning(false);
                    setCrashed(true); setMessage(`Crashed at ${next.toFixed(2)}x`); play('crash');
                }
                return next;
            });
        }, 100);

        // Signed-in rounds: poll the server for the authoritative crash point.
        let poll;
        if (user && roundRef.current) {
            poll = setInterval(async () => {
                try {
                    const res = await originalsApi.crashResolve(roundRef.current);
                    if (res && res.won === false) {
                        clearInterval(timer);
                        clearInterval(poll);
                        setRunning(false);
                        setMult(res.crashed_at);
                        setCrashed(true);
                        setMessage(`Crashed at ${Number(res.crashed_at).toFixed(2)}x`);
                        play('crash');
                        if (res.new_balance != null) setBalance(res.new_balance);
                        roundRef.current = null;
                    }
                } catch { /* 425 = still running */ }
            }, 700);
        }

        return () => { clearInterval(timer); if (poll) clearInterval(poll); };
    }, [running, user, play, setBalance]);

    const start = async () => {
        if (running || balance < bet) return;
        play('launch');

        if (user) {
            try {
                const res = await originalsApi.crashStart(bet);
                roundRef.current = res.round_id;
                setBalance(res.new_balance);
            } catch (e) {
                setMessage(e.message ?? 'Launch failed.');
                return;
            }
        } else {
            updateBalance(-bet);
            localCrashAt.current = 1.2 + Math.random() * 5;
        }

        setMult(1); setCashed(false); setCrashed(false); setMessage(''); tickRef.current = 0;
        setRunning(true);
    };

    const cashOut = async () => {
        if (!running || cashed) return;

        if (user && roundRef.current) {
            try {
                const res = await originalsApi.crashCashout(roundRef.current);
                roundRef.current = null;
                setRunning(false);
                if (res.won) {
                    setBalance(res.new_balance);
                    setMult(res.multiplier);
                    setCashed(true); play('cashout');
                    setMessage(`Cashed out $${Number(res.payout).toFixed(2)} at ${Number(res.multiplier).toFixed(2)}x`);
                } else {
                    setMult(res.crashed_at);
                    setCrashed(true); play('crash');
                    setMessage(`Crashed at ${Number(res.crashed_at).toFixed(2)}x`);
                    if (res.new_balance != null) setBalance(res.new_balance);
                }
            } catch { /* round may already be settled */ }
            return;
        }

        const payout = bet * mult;
        updateBalance(payout);
        setCashed(true); setRunning(false); play('cashout');
        setMessage(`Cashed out $${payout.toFixed(2)} at ${mult.toFixed(2)}x`);
    };

    const rise = Math.min(86, ((mult - 1) / 5) * 86); // % from bottom
    const color = crashed ? 'text-neon-red' : cashed ? 'text-neon-green-l' : running ? 'text-neon-green-l' : 'text-slate-400';

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={cashed} />
                <h2 className="bg-gradient-to-br from-gold-l via-orange-500 to-neon-red bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">Rocket Crash</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                <div className={`relative my-5 h-56 overflow-hidden rounded-2xl border border-purple/20 bg-gradient-to-b from-[#0b1026] to-black sm:my-6 ${crashed ? 'animate-shake' : ''}`}>
                    {STARS.map((s, i) => <span key={i} className="absolute rounded-full bg-white/50" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }} />)}
                    {/* trail */}
                    {running && <div className="absolute left-1/2 w-1 -translate-x-1/2 rounded-full bg-gradient-to-t from-transparent via-orange-500/60 to-gold" style={{ bottom: '8%', height: `${rise}%` }} />}
                    {/* rocket */}
                    {(running || cashed) && !crashed && (
                        <div className="animate-rocket absolute left-1/2 text-3xl" style={{ bottom: `${rise + 6}%`, filter: 'drop-shadow(0 0 8px #fbbf24)' }}>🚀</div>
                    )}
                    {crashed && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">💥</div>}
                    <div className={`absolute inset-0 flex items-center justify-center font-display text-5xl font-black sm:text-6xl ${color}`} style={{ textShadow: '0 0 30px currentColor' }}>
                        {mult.toFixed(2)}x
                    </div>
                    {!running && !crashed && !cashed && <div className="absolute inset-x-0 bottom-3 text-center text-xs text-white/30">Place a bet to launch</div>}
                </div>

                {message && <div className={`mb-4 rounded-lg border p-3 text-center font-bold ${cashed ? 'border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'border-neon-red/40 bg-neon-red/10 text-neon-red animate-shake'}`}>{message}</div>}

                <div className="mb-4 flex flex-wrap gap-2">
                    {BETS.map((item) => <button key={item} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 sm:px-4 ${bet === item ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} onClick={() => { setBet(item); play('bet'); }} type="button">${item}</button>)}
                </div>
                {running ? (
                    <button className="w-full rounded-lg bg-neon-green px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98]" onClick={cashOut} type="button">Cash Out ${(bet * mult).toFixed(2)}</button>
                ) : (
                    <button className="w-full rounded-lg bg-neon-red px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-white transition active:scale-[.98] disabled:opacity-50" onClick={start} disabled={balance < bet} type="button">Launch ${bet}</button>
                )}
            </div>
        </div>
    );
}
