import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Wallet as WalletIcon } from '../components/Icons';
import { EmptyState } from '../components/ui';

const QUICK = [10, 25, 50, 100, 250, 500];
const METHODS = [
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'crypto', label: 'Crypto', icon: '₿' },
    { id: 'bank', label: 'Bank', icon: '🏦' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
];

const TX_META = {
    deposit: { sign: '+', cls: 'text-emerald-600 dark:text-neon-green-l', chip: 'bg-neon-green/12 text-emerald-600 dark:text-neon-green-l' },
    win: { sign: '+', cls: 'text-emerald-600 dark:text-neon-green-l', chip: 'bg-neon-green/12 text-emerald-600 dark:text-neon-green-l' },
    bonus: { sign: '+', cls: 'text-emerald-600 dark:text-neon-green-l', chip: 'bg-gold/12 text-amber-600 dark:text-gold-l' },
    referral: { sign: '+', cls: 'text-emerald-600 dark:text-neon-green-l', chip: 'bg-purple/12 text-purple-d dark:text-purple-l' },
    withdraw: { sign: '-', cls: 'text-neon-red', chip: 'bg-neon-red/12 text-neon-red' },
    bet: { sign: '-', cls: 'text-slate-500', chip: 'bg-slate-200/70 text-slate-500 dark:bg-white/[.07]' },
};

export default function Wallet() {
    const { balance, deposit, withdraw, transactions } = useApp();
    const toast = useToast();
    const [tab, setTab] = useState('deposit');
    const [amount, setAmount] = useState(50);
    const [method, setMethod] = useState('card');
    const [destination, setDestination] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async () => {
        const amt = Number(amount);
        if (!amt || amt <= 0) return toast.error('Enter a valid amount.');
        const m = method;
        setBusy(true);
        try {
            if (tab === 'deposit') {
                await deposit(amt, m);
                toast.success(`Deposit of $${amt.toFixed(2)} submitted!`, { title: 'Wallet' });
            } else {
                if (amt > balance) { toast.error('Insufficient balance.'); return; }
                if (!destination.trim()) { toast.error('Enter withdrawal destination.'); return; }
                await withdraw(amt, m, destination.trim());
                toast.success(`Withdrawal of $${amt.toFixed(2)} submitted for review.`, { title: 'Wallet' });
            }
        } catch (e) {
            toast.error(e.message ?? 'Transaction failed.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 dark:bg-ink">
            <div className="mx-auto max-w-[960px] px-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-amber-600 dark:text-gold-l"><WalletIcon size={22} /></span>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Wallet</h1>
                </div>

                {/* Balance card */}
                <div className="relative mt-6 overflow-hidden rounded-3xl border border-purple/20 bg-gradient-to-br from-purple/15 via-transparent to-gold/10 p-7 dark:border-white/10">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple/20 blur-3xl" />
                    <p className="font-heading text-xs font-bold uppercase tracking-[2px] text-slate-500">Available Balance</p>
                    <p className="mt-1 font-display text-4xl font-extrabold tabular-nums tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                        $<span className="text-gradient-gold">{balance.toFixed(2)}</span>
                    </p>
                    <div className="mt-5 flex gap-2" role="tablist" aria-label="Wallet action">
                        <button onClick={() => setTab('deposit')} role="tab" aria-selected={tab === 'deposit'} className={tab === 'deposit' ? 'btn-success px-5 py-2.5 text-sm uppercase tracking-wider' : 'btn-outline px-5 py-2.5 text-sm uppercase tracking-wider'} type="button">Deposit</button>
                        <button onClick={() => setTab('withdraw')} role="tab" aria-selected={tab === 'withdraw'} className={tab === 'withdraw' ? 'btn-danger px-5 py-2.5 text-sm uppercase tracking-wider' : 'btn-outline px-5 py-2.5 text-sm uppercase tracking-wider'} type="button">Withdraw</button>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    {/* Form */}
                    <div className="card p-6">
                        <h2 className="font-heading text-sm font-bold uppercase tracking-[1.5px] text-slate-500">{tab === 'deposit' ? 'Add Funds' : 'Cash Out'}</h2>

                        <p className="field-label mt-5">Payment method</p>
                        <div className="grid grid-cols-4 gap-2">
                            {METHODS.map((m) => (
                                <button key={m.id} onClick={() => setMethod(m.id)} type="button" aria-pressed={method === m.id}
                                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-bold transition ${method === m.id ? 'border-purple bg-purple/12 text-purple-d shadow-md shadow-purple/10 dark:bg-purple/20 dark:text-purple-l' : 'border-slate-200 text-slate-500 hover:border-purple/40 dark:border-white/10 dark:text-slate-400'}`}>
                                    <span className="text-xl">{m.icon}</span>{m.label}
                                </button>
                            ))}
                        </div>

                        <label className="field-label mt-5" htmlFor="wallet-amount">Amount</label>
                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 transition focus-within:border-purple-l focus-within:ring-4 focus-within:ring-purple/10 dark:border-white/10 dark:bg-white/[.04]">
                            <span className="font-display text-lg font-bold text-amber-600 dark:text-gold-l">$</span>
                            <input id="wallet-amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent px-2 py-3 font-display text-lg tabular-nums outline-none" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {QUICK.map((q) => (
                                <button key={q} onClick={() => setAmount(q)} type="button" aria-pressed={Number(amount) === q}
                                    className={`rounded-xl border px-3.5 py-1.5 font-heading text-sm font-bold tabular-nums transition ${Number(amount) === q ? 'border-gold bg-gold/15 text-amber-700 dark:text-gold-l' : 'border-slate-200 text-slate-600 hover:border-gold/50 dark:border-white/10 dark:text-slate-300'}`}>
                                    ${q}
                                </button>
                            ))}
                        </div>

                        {tab === 'withdraw' && (
                            <div className="animate-fade-in">
                                <label className="field-label mt-5" htmlFor="wallet-destination">Destination Address / Account</label>
                                <input
                                    id="wallet-destination"
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Wallet address or account number"
                                    className="input"
                                />
                            </div>
                        )}

                        <button onClick={submit} disabled={busy}
                            className={`${tab === 'deposit' ? 'btn-success' : 'btn-danger'} mt-6 w-full py-4 text-base uppercase tracking-[2px]`} type="button">
                            {busy ? 'Processing…' : tab === 'deposit' ? `Deposit $${Number(amount) || 0}` : `Withdraw $${Number(amount) || 0}`}
                        </button>
                        <p className="mt-3 text-center text-xs text-slate-500">
                            {tab === 'deposit' ? 'Funds are credited instantly. No deposit fees.' : 'Withdrawals are reviewed within minutes. Crypto network fees may apply.'}
                        </p>
                    </div>

                    {/* History */}
                    <div className="card p-6">
                        <h2 className="font-heading text-sm font-bold uppercase tracking-[1.5px] text-slate-500">Transactions</h2>
                        <div className="mt-4 grid gap-2">
                            {transactions.length === 0 && (
                                <EmptyState
                                    title="No transactions yet"
                                    description="Your deposits, withdrawals, bets and wins will appear here."
                                />
                            )}
                            {transactions.map((t) => {
                                const meta = TX_META[t.type] ?? TX_META.bet;
                                const displayAmt = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount ?? 0);
                                const time = t.time ?? (t.created_at ? new Date(t.created_at).toLocaleDateString() : '');
                                return (
                                    <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3.5 py-3 transition hover:border-slate-200 dark:border-white/[.05] dark:hover:border-white/10">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black uppercase ${meta.chip}`}>
                                                {meta.sign}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">{t.type}</p>
                                                <p className="truncate text-xs text-slate-500">{t.method ? `${t.method} · ` : ''}{time}</p>
                                            </div>
                                        </div>
                                        <span className={`font-display text-sm font-bold tabular-nums ${meta.cls}`}>{meta.sign}${displayAmt.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
