import { useApp } from '../contexts/AppContext';
import SlotMachine from '../games/SlotMachine';
import Roulette from '../games/Roulette';
import Blackjack from '../games/Blackjack';
import CrashGame from '../games/CrashGame';
import DiceGame from '../games/DiceGame';
import PlinkoGame from '../games/PlinkoGame';
import Mines from '../games/Mines';
import Limbo from '../games/Limbo';
import CoinFlip from '../games/CoinFlip';
import Wheel from '../games/Wheel';
import Casino from './Casino';
import { ArrowLeft } from '../components/Icons';

const MAP = {
    slots: { component: SlotMachine, name: 'Vegas Blitz' },
    roulette: { component: Roulette, name: 'Neon Roulette' },
    blackjack: { component: Blackjack, name: '21 Inferno' },
    crash: { component: CrashGame, name: 'Rocket Crash' },
    dice: { component: DiceGame, name: 'Hot Dice' },
    plinko: { component: PlinkoGame, name: 'Neon Drop' },
    mines: { component: Mines, name: 'Diamond Mines' },
    limbo: { component: Limbo, name: 'Limbo' },
    coinflip: { component: CoinFlip, name: 'Coin Flip' },
    wheel: { component: Wheel, name: 'Fortune Wheel' },
};

export default function GamePage() {
    const { currentGame, setCurrentGame, setPage } = useApp();
    const entry = MAP[currentGame];
    if (!entry) return <Casino />;
    const Game = entry.component;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-ink">
            <div className="shell flex items-center gap-3 pt-4">
                <button
                    className="btn-ghost gap-2 px-4 py-2 text-sm uppercase tracking-wider"
                    onClick={() => { setCurrentGame(null); setPage('casino'); }}
                    type="button"
                >
                    <ArrowLeft size={16} /> Casino
                </button>
                <span className="text-slate-300 dark:text-white/15">/</span>
                <span className="badge border border-purple/30 bg-purple/10 text-purple-d dark:text-purple-l">{entry.name}</span>
                <span className="badge ml-auto hidden border border-neon-green/30 bg-neon-green/10 text-emerald-700 dark:text-neon-green-l sm:inline-flex">Provably Fair</span>
            </div>
            <Game />
        </div>
    );
}
