/* Renders every page through the real provider stack to catch runtime crashes.
   Run via: node scripts/run-smoke.mjs */
import { renderToString } from 'react-dom/server';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AppProvider } from '../src/contexts/AppContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { ToastProvider } from '../src/contexts/ToastContext';
import { SoundProvider } from '../src/contexts/SoundContext';
import { NotificationsProvider } from '../src/contexts/NotificationsContext';
import { BetSlipProvider } from '../src/contexts/BetSlipContext';
import PlatformShell from '../src/components/PlatformShell';
import AppSidebar from '../src/components/AppSidebar';
import SearchModal from '../src/components/SearchModal';
import Home from '../src/pages/Home';
import Sports from '../src/pages/Sports';
import EventDetail from '../src/pages/EventDetail';
import Casino from '../src/pages/Casino';
import GamePage from '../src/pages/GamePage';
import Promotions from '../src/pages/Promotions';
import VIP from '../src/pages/VIP';
import Legal from '../src/pages/Legal';
import Wallet from '../src/pages/Wallet';
import Referral from '../src/pages/Referral';
import Support from '../src/pages/Support';
import Profile from '../src/pages/Profile';
import MyBets from '../src/pages/MyBets';

const PAGES = {
    home: <Home />,
    sports: <Sports />,
    event: <EventDetail />,
    casino: <Casino />,
    game: <GamePage />,
    promotions: <Promotions />,
    vip: <VIP />,
    legal: <Legal />,
    wallet: <Wallet />,
    referral: <Referral />,
    support: <Support />,
    profile: <Profile />,
    mybets: <MyBets />,
};

const Providers = ({ children }) => (
    <ThemeProvider><ToastProvider><SoundProvider><AuthProvider><NotificationsProvider><AppProvider><BetSlipProvider>
        {children}
    </BetSlipProvider></AppProvider></NotificationsProvider></AuthProvider></SoundProvider></ToastProvider></ThemeProvider>
);

export function run() {
    const failures = [];

    for (const [name, element] of Object.entries(PAGES)) {
        try {
            const html = renderToString(<Providers><PlatformShell>{element}</PlatformShell></Providers>);
            if (!html || html.length < 200) failures.push(`${name}: rendered suspiciously little HTML (${html.length} chars)`);
        } catch (error) {
            failures.push(`${name}: ${error.message}`);
        }
    }

    // Overlays render through a Portal, so exercise them on their own.
    for (const [name, element] of Object.entries({
        sidebar: <AppSidebar open onClose={() => { }} onNavigate={() => { }} onOpenAuth={() => { }} />,
        search: <SearchModal open onClose={() => { }} onNavigate={() => { }} onOpenGame={() => { }} />,
    })) {
        try {
            renderToString(<Providers>{element}</Providers>);
        } catch (error) {
            failures.push(`${name}: ${error.message}`);
        }
    }

    return failures;
}
