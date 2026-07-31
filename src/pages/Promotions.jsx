import PromoGrid from '../components/Promotions';
import Carousel from '../components/Carousel';
import { useApp } from '../contexts/AppContext';
import { Aurora } from '../components/ui';

export default function Promotions() {
    const { setPage } = useApp();
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-ink">
            <section className="relative overflow-hidden border-b border-slate-200 py-14 dark:border-white/[.07]">
                <Aurora />
                <div className="shell relative">
                    <span className="badge border border-gold/40 bg-gold/10 px-3 py-1.5 text-amber-600 dark:text-gold-l">Exclusive Offers</span>
                    <h1 className="animate-fade-up mt-5 font-display text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                        <span className="text-gradient-gold">Promotions</span> & Bonuses
                    </h1>
                    <p className="animate-fade-up mt-4 max-w-xl text-base leading-relaxed text-slate-600 [animation-delay:.1s] dark:text-slate-400">
                        Boost your bankroll with welcome bonuses, weekly cashback, free spins and VIP rewards.
                    </p>
                    <button onClick={() => setPage('casino')} className="btn-gold animate-fade-up mt-7 px-7 py-3.5 uppercase tracking-wider [animation-delay:.2s]" type="button">
                        Play Now
                    </button>
                </div>
            </section>
            <Carousel />
            <PromoGrid />
        </div>
    );
}
