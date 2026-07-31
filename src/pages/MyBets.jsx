import MyBetsList from '../components/MyBets';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Aurora, EmptyState } from '../components/ui';

export default function MyBets() {
    const { user } = useAuth();
    const { setPage } = useApp();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-ink">
            <section className="relative overflow-hidden border-b border-slate-200 py-14 dark:border-white/[.07]">
                <Aurora />
                <div className="shell relative">
                    <span className="section-badge">Sportsbook</span>
                    <h1 className="animate-fade-up mt-5 font-display text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                        <span className="text-gradient-brand">My</span> Bets
                    </h1>
                    <p className="animate-fade-up mt-4 max-w-xl text-base leading-relaxed text-slate-600 [animation-delay:.1s] dark:text-slate-400">
                        Track open positions, review settled wagers and cash out early before the final whistle.
                    </p>
                </div>
            </section>

            {user ? (
                <MyBetsList />
            ) : (
                <div className="shell py-16">
                    <EmptyState
                        icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                        title="Sign in to see your bets"
                        description="Your open and settled wagers will appear here once you're logged in."
                        action={<button type="button" onClick={() => setPage('sports')} className="btn-primary px-6 py-3 text-xs uppercase tracking-wider">Browse Events</button>}
                    />
                </div>
            )}
        </div>
    );
}
