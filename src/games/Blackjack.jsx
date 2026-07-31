import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../contexts/SoundContext';
import originalsApi from '../services/originalsApi';
import Celebrate from './Celebrate';

const BETS = [5, 10, 25, 50, 100];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['♠', '♥', '♦', '♣'];

function draw() {
    return { rank: ranks[Math.floor(Math.random() * ranks.length)], suit: suits[Math.floor(Math.random() * suits.length)] };
}

function value(hand) {
    let total = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.rank === 'A') { total += 11; aces++; }
        else if (['J', 'Q', 'K'].includes(card.rank)) total += 10;
        else total += Number(card.rank);
    }
    while (total > 21 && aces) { total -= 10; aces--; }
    return total;
}

function Card({ card, hidden, i = 0 }) {
    if (hidden) return (
        <div className="animate-flip-in flex h-24 w-16 items-center justify-center rounded-lg border-2 border-blue-400 bg-[repeating-linear-gradient(45deg,#1e3a8a,#1e3a8a_5px,#2563eb_5px,#2563eb_10px)] text-2xl text-white/40" style={{ animationDelay: `${i * 0.12}s` }}>♦</div>
    );
    const red = card.suit === '♥' || card.suit === '♦';
    return (
        <div className={`animate-deal relative flex h-24 w-16 flex-col items-center justify-center rounded-lg bg-white font-bold ${red ? 'text-red-600' : 'text-slate-950'}`} style={{ animationDelay: `${i * 0.12}s` }}>
            <span className="absolute left-1.5 top-1 text-xs">{card.rank}{card.suit}</span>
            <span className="text-3xl">{card.suit}</span>
            <span className="absolute bottom-1 right-1.5 rotate-180 text-xs">{card.rank}{card.suit}</span>
        </div>
    );
}

export default function Blackjack() {
    const { balance, updateBalance, setBalance } = useApp();
    const { user } = useAuth();
    const { play } = useSound();
    const [bet, setBet] = useState(10);
    const [player, setPlayer] = useState([]);
    const [dealer, setDealer] = useState([]);
    const [playing, setPlaying] = useState(false);
    const [message, setMessage] = useState('');
    const [win, setWin] = useState(false);
    const [roundId, setRoundId] = useState(null);
    const [busy, setBusy] = useState(false);

    const settle = (outcome, payout, newBalance) => {
        if (newBalance != null) setBalance(newBalance);
        setPlaying(false);
        if (outcome === 'won') { play('bigWin'); setWin(true); setMessage(`You won $${Number(payout).toFixed(2)}`); }
        else if (outcome === 'push') { play('push'); setMessage('Push. Bet returned.'); }
        else { play('lose'); setMessage(outcome === 'bust' ? 'Bust! Dealer wins.' : 'Dealer wins.'); }
    };

    const deal = async () => {
        if (balance < bet || busy) return;
        play('chip');
        setMessage(''); setWin(false);

        // Server deals from provably-fair seeds when signed in.
        if (user) {
            setBusy(true);
            try {
                const res = await originalsApi.blackjackStart(bet);
                setRoundId(res.round_id);
                setBalance(res.new_balance);
                setPlayer(res.player);
                setDealer([res.dealer_up, { rank: '?', suit: '?' }]);
                setPlaying(true);
            } catch (e) {
                setMessage(e.message ?? 'Deal failed.');
            }
            setBusy(false);
        } else {
            updateBalance(-bet);
            setPlayer([draw(), draw()]);
            setDealer([draw(), draw()]);
            setPlaying(true);
        }
        setTimeout(() => play('card'), 180);
        setTimeout(() => play('card'), 360);
    };

    const finish = async (finalPlayer = player, finalDealer = dealer) => {
        if (user && roundId) {
            setBusy(true);
            try {
                const res = await originalsApi.blackjackAction(roundId, 'stand');
                setPlayer(res.player);
                setDealer(res.dealer);
                settle(res.outcome, res.payout, res.new_balance);
            } catch { /* keep state */ }
            setBusy(false);
            return;
        }

        let nextDealer = [...finalDealer];
        while (value(nextDealer) < 17) nextDealer = [...nextDealer, draw()];
        const p = value(finalPlayer);
        const d = value(nextDealer);
        const won = p <= 21 && (d > 21 || p > d);
        const push = p === d && p <= 21;
        if (won) { updateBalance(bet * 2); play('bigWin'); setWin(true); }
        else if (push) { updateBalance(bet); play('push'); }
        else play('lose');
        setDealer(nextDealer);
        setPlaying(false);
        setMessage(won ? `You won $${(bet * 2).toFixed(2)}` : push ? 'Push. Bet returned.' : 'Dealer wins.');
    };

    const hit = async () => {
        if (busy) return;
        play('card');

        if (user && roundId) {
            setBusy(true);
            try {
                const res = await originalsApi.blackjackAction(roundId, 'hit');
                setPlayer(res.player);
                if (res.outcome === 'bust') {
                    setDealer(res.dealer);
                    settle('bust', 0, res.new_balance);
                }
            } catch { /* keep state */ }
            setBusy(false);
            return;
        }

        const next = [...player, draw()];
        setPlayer(next);
        if (value(next) > 21) finish(next, dealer);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-3 dark:bg-ink sm:p-4">
            <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-2 sm:p-6">
                <Celebrate show={win} />
                <h2 className="bg-gradient-to-br from-neon-green to-neon-green-l bg-clip-text font-display text-xl font-black tracking-[2px] text-transparent sm:text-2xl">21 Inferno</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Balance: <span className="font-display font-bold text-gold-l">${balance.toFixed(2)}</span></p>

                <div className="mt-5 rounded-2xl border border-neon-green/20 bg-neon-green/10 p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Dealer {playing ? '' : (dealer.length ? value(dealer) : '')}</p>
                    <div className="flex min-h-24 flex-wrap gap-2">{dealer.length ? dealer.map((card, index) => <Card key={index} card={card} hidden={playing && index === 1} i={index} />) : <span className="text-sm text-slate-500">Waiting for deal...</span>}</div>
                </div>
                <div className="mt-4 rounded-2xl border border-neon-green/20 bg-neon-green/10 p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Player {value(player) || ''}</p>
                    <div className="flex min-h-24 flex-wrap gap-2">{player.length ? player.map((card, index) => <Card key={index} card={card} i={index} />) : <span className="text-sm text-slate-500">Press deal to start</span>}</div>
                </div>

                {message && <div className={`mt-4 rounded-lg border p-3 text-center font-bold ${win ? 'animate-pop border-neon-green/40 bg-neon-green/10 text-neon-green-l' : 'border-purple/30 bg-purple/10 text-purple-l'}`}>{message}</div>}

                {!playing && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {BETS.map((item) => <button key={item} className={`rounded-lg border px-3 py-2 font-heading text-sm font-bold transition active:scale-95 sm:px-4 ${bet === item ? 'border-gold bg-gold/15 text-gold' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`} onClick={() => { setBet(item); play('chip'); }} type="button">${item}</button>)}
                    </div>
                )}
                <div className="mt-5 flex gap-2">
                    {!playing ? (
                        <button className="w-full rounded-lg bg-neon-green px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98] disabled:opacity-50" onClick={deal} disabled={balance < bet} type="button">Deal ${bet}</button>
                    ) : (
                        <>
                            <button className="flex-1 rounded-lg bg-purple px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-white transition active:scale-[.98]" onClick={hit} type="button">Hit</button>
                            <button className="flex-1 rounded-lg bg-cyan px-4 py-4 font-heading text-base font-black uppercase tracking-[2px] text-black transition active:scale-[.98]" onClick={() => { play('click'); finish(); }} type="button">Stand</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
