import { useState } from 'react';
import FAQ from '../components/FAQ';

const SECTIONS = {
    about: {
        title: 'About NeonBet', body: [
            'NeonBet is a next-generation sports betting and casino platform built for speed, fairness and fun.',
            'We combine live sports markets with provably-fair original casino games — all wrapped in a modern, mobile-first experience.',
            'Our mission is to deliver the most electrifying, transparent betting experience online, with fast payouts and 24/7 support.',
        ],
    },
    responsible: {
        title: 'Responsible Gaming', body: [
            'Gambling should always be entertaining, never a way to make money. Only wager what you can afford to lose.',
            'We provide tools to help you stay in control: deposit limits, session reminders, cooling-off periods and self-exclusion.',
            'If gambling stops being fun, take a break. For confidential help visit BeGambleAware.org. Players must be 18+.',
        ],
    },
    terms: {
        title: 'Terms of Service', body: [
            'By accessing NeonBet you agree to these terms. You must be of legal age in your jurisdiction to participate.',
            'Bonuses are subject to wagering requirements. NeonBet reserves the right to void bets placed in error or through malfunction.',
            'Accounts are personal and non-transferable. One account per person, household and IP address.',
        ],
    },
    privacy: {
        title: 'Privacy Policy', body: [
            'We collect only the data needed to operate your account, process payments and comply with regulations.',
            'Your data is encrypted in transit and at rest. We never sell your personal information to third parties.',
            'You may request access to, or deletion of, your personal data at any time via support.',
        ],
    },
};

export default function Legal({ section = 'about' }) {
    const [active, setActive] = useState(section);
    const data = SECTIONS[active] || SECTIONS.about;
    return (
        <div className="min-h-screen bg-slate-50 py-12 dark:bg-ink">
            <div className="mx-auto max-w-[900px] px-4 sm:px-6">
                <div className="mb-8 flex flex-wrap gap-1.5">
                    {Object.entries(SECTIONS).map(([key, s]) => (
                        <button key={key} onClick={() => setActive(key)} type="button" aria-pressed={active === key}
                            className={`chip border-slate-200 dark:border-white/10 ${active === key ? 'chip-active' : ''}`}>
                            {s.title}
                        </button>
                    ))}
                </div>
                <div className="card p-7 sm:p-9">
                    <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                        <span className="text-gradient-brand">{data.title}</span>
                    </h1>
                    <div className="mt-6 grid gap-4">
                        {data.body.map((p, i) => <p key={i} className="text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">{p}</p>)}
                    </div>
                    <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/[.07] p-4 text-sm text-slate-700 dark:text-slate-300">
                        18+ · Gamble responsibly ·{' '}
                        <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-d underline-offset-2 hover:underline dark:text-purple-l">BeGambleAware.org</a>
                    </div>
                </div>
            </div>
            <FAQ />
        </div>
    );
}
