import { useApp } from './contexts/AppContext';
import PlatformShell from './components/PlatformShell';
import Home from './pages/Home';
import Sports from './pages/Sports';
import Casino from './pages/Casino';
import GamePage from './pages/GamePage';
import Promotions from './pages/Promotions';
import VIP from './pages/VIP';
import Legal from './pages/Legal';
import Wallet from './pages/Wallet';
import Referral from './pages/Referral';
import Support from './pages/Support';
import Profile from './pages/Profile';
import MyBets from './pages/MyBets';

export default function App() {
    const { page } = useApp();

    return (
        <PlatformShell>
            <main className="min-h-screen">
                {page === 'home' && <Home embedded />}
                {page === 'sports' && <Sports />}
                {page === 'casino' && <Casino />}
                {page === 'game' && <GamePage />}
                {page === 'promotions' && <Promotions />}
                {page === 'vip' && <VIP />}
                {page === 'legal' && <Legal />}
                {page === 'wallet' && <Wallet />}
                {page === 'referral' && <Referral />}
                {page === 'support' && <Support />}
                {page === 'profile' && <Profile />}
                {page === 'mybets' && <MyBets />}
            </main>
        </PlatformShell>
    );
}
