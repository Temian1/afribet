import { useState } from 'react';
import { ChevronDown, Sparkle } from './Icons';

const FAQS = [
    { q: 'How do I create an account?', a: 'Click Register in the top navigation, enter your name, email and a strong password, or sign up instantly with Google. Your welcome bonus is credited automatically.' },
    { q: 'How fast are withdrawals?', a: 'Crypto withdrawals are processed within minutes. Card and bank transfers typically settle within 1-3 business days depending on your provider.' },
    { q: 'Is my account secure?', a: 'Yes. We use industry-standard encryption, optional two-factor authentication, and never store your card details on our servers.' },
    { q: 'What is the welcome bonus?', a: 'New players receive a 200% deposit match up to $1,000 plus 100 free spins on selected slots. Terms and wagering requirements apply.' },
    { q: 'Which games can I play?', a: 'NeonBet offers live sports betting plus casino games including Crash, Dice, Plinko, Blackjack, Roulette and Slots.' },
    { q: 'How do I get support?', a: '24/7 live chat is available from any page, or reach us by email. Most queries are answered within a few minutes.' },
];

function Item({ item, open, onToggle }) {
    return (
        <div className={`rounded-xl border transition ${
            open
                ? 'border-purple-l/50 bg-purple/10 shadow-lg shadow-purple/10'
                : 'border-[var(--pf-border)] bg-white dark:bg-white/[.03]'
        }`}>
            <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-4 text-left" type="button">
                <span className="font-heading text-[15px] font-bold text-slate-900 dark:text-slate-100">{item.q}</span>
                <ChevronDown size={20} className={`shrink-0 text-purple-l transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.a}</p>
                </div>
            </div>
        </div>
    );
}

export default function FAQ() {
    const [openIdx, setOpenIdx] = useState(0);

    return (
        <section id="faq" className="px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-[1400px]">
                <div className="mx-auto max-w-[760px] text-center">
                    <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-purple/40 bg-purple/10 px-3 py-1 font-heading text-xs font-bold uppercase tracking-[2px] text-purple-d dark:text-purple-l">
                        <Sparkle size={13} /> Help Center
                    </span>
                    <h2 className="mt-3 bg-gradient-to-br from-purple-l to-gold-l bg-clip-text font-display text-3xl font-black tracking-[2px] text-transparent sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mx-auto mt-3 max-w-[620px] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Everything you need to know about playing, paying and winning on NeonBet.
                    </p>
                </div>
                <div className="mx-auto mt-8 grid max-w-[760px] gap-3">
                    {FAQS.map((faq, index) => (
                        <Item key={faq.q} item={faq} open={openIdx === index} onToggle={() => setOpenIdx(openIdx === index ? -1 : index)} />
                    ))}
                </div>
            </div>
        </section>
    );
}
