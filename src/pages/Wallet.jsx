import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { UiIcon } from '../components/SportIcons';
import ManualDeposit from '../components/ManualDeposit';
import { EmptyState } from '../components/ui';

const QUICK = [100, 250, 500, 1000, 2000, 5000];

const TX_META = {
    deposit: { sign: '+', tone: 'text-[var(--pf-accent)]', chip: 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]' },
    win: { sign: '+', tone: 'text-[var(--pf-accent)]', chip: 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]' },
    bonus: { sign: '+', tone: 'text-[var(--pf-accent)]', chip: 'bg-[var(--pf-warn-soft)] text-[#c98a00]' },
    referral: { sign: '+', tone: 'text-[var(--pf-accent)]', chip: 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]' },
    withdrawal: { sign: '-', tone: 'text-[var(--pf-danger)]', chip: 'bg-[var(--pf-danger-soft)] text-[var(--pf-danger)]' },
    withdraw: { sign: '-', tone: 'text-[var(--pf-danger)]', chip: 'bg-[var(--pf-danger-soft)] text-[var(--pf-danger)]' },
    bet: { sign: '-', tone: 'text-[var(--pf-muted)]', chip: 'bg-[var(--pf-panel)] text-[var(--pf-muted)]' },
};

const inputClass = 'w-full rounded-[11px] border border-[var(--pf-border)] bg-[var(--pf-input)] px-3 py-3 text-[14px] text-[var(--pf-text)] outline-none transition placeholder:text-[var(--pf-faint)] focus:border-[var(--pf-accent)] focus:ring-2 focus:ring-[var(--pf-accent)]/20';

function WithdrawForm({ onCancel }) {
    const { balance, withdraw } = useApp();
    const toast = useToast();
    const [amount, setAmount] = useState('');
    const [destination, setDestination] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (fromEvent) => {
        fromEvent.preventDefault();
        const value = Number(amount);
        if (!value || value <= 0) return toast.error('Enter a valid amount.');
        if (value > balance) return toast.error('Insufficient balance.');
        if (!destination.trim()) return toast.error('Enter your TeleBirr number.');
        setBusy(true);
        try {
            await withdraw(value, 'TeleBirr', destination.trim());
            toast.success(`Withdrawal of ${value.toLocaleString()} ETB submitted for review.`, { title: 'Wallet' });
            setAmount('');
            setDestination('');
        } catch (error) {
            toast.error(error.message ?? 'Transaction failed.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <form className="animate-fade-up space-y-4" onSubmit={submit}>
            <label className="block" htmlFor="withdraw-amount">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-faint)]">Amount · ETB</span>
                <input className={`${inputClass} tabular-nums`} id="withdraw-amount" type="number" min="1" value={amount} onChange={(fromEvent) => setAmount(fromEvent.target.value)} placeholder="0.00" />
            </label>
            <div className="flex flex-wrap gap-2">
                {QUICK.map((value) => (
                    <button
                        className={`h-9 rounded-[10px] border px-3.5 text-[13px] font-bold tabular-nums transition hover:-translate-y-0.5 active:scale-95 ${Number(amount) === value ? 'border-[var(--pf-accent)] bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]' : 'border-[var(--pf-border)] bg-[var(--pf-panel)] text-[var(--pf-text)]'}`}
                        onClick={() => setAmount(String(value))}
                        type="button"
                        key={value}
                    >
                        {value.toLocaleString()}
                    </button>
                ))}
            </div>
            <label className="block" htmlFor="withdraw-destination">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-faint)]">TeleBirr number</span>
                <input className={inputClass} id="withdraw-destination" type="tel" value={destination} onChange={(fromEvent) => setDestination(fromEvent.target.value)} placeholder="09xx xxx xxx" />
            </label>
            <div className="flex gap-3 pt-1">
                <button className="h-[46px] flex-1 rounded-[12px] border border-[var(--pf-border)] bg-transparent text-[14px] font-bold text-[var(--pf-text)] transition hover:bg-[var(--pf-panel)] active:scale-95" onClick={onCancel} type="button">Cancel</button>
                <button className="h-[46px] flex-1 rounded-[12px] border-0 bg-[var(--pf-accent)] text-[14px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-95 disabled:opacity-60" disabled={busy} type="submit">
                    {busy ? 'Submitting…' : 'Request withdrawal'}
                </button>
            </div>
        </form>
    );
}

export default function Wallet() {
    const { balance, transactions, setPage } = useApp();
    const [tab, setTab] = useState('deposit');

    return (
        <div className="min-h-screen bg-[var(--pf-bg)] pb-12 text-[var(--pf-text)]">
            <header className="relative overflow-hidden border-b border-[var(--pf-border)] bg-gradient-to-b from-[var(--pf-header-from)] to-[var(--pf-header-to)] px-4 py-7 sm:px-6">
                <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[var(--pf-accent)]/10 blur-[80px]" aria-hidden="true" />
                <div className="relative mx-auto max-w-4xl">
                    <div className="flex items-center gap-3">
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name="wallet" className="size-6" /></span>
                        <div className="min-w-0">
                            <h1 className="m-0 text-[22px] font-black tracking-tight sm:text-[26px]">Wallet</h1>
                            <p className="m-0 text-[13px] text-[var(--pf-muted)]">Deposit and withdraw with TeleBirr.</p>
                        </div>
                    </div>

                    <div className="animate-fade-up mt-5 rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-5">
                        <span className="block text-[11px] font-bold uppercase tracking-[2px] text-[var(--pf-faint)]">Available balance</span>
                        <b className="mt-1 block text-[32px] font-black tabular-nums tracking-tight text-[var(--pf-text)] sm:text-[40px]">
                            {balance.toFixed(2)} <span className="text-[18px] text-[var(--pf-accent)] sm:text-[22px]">ETB</span>
                        </b>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <div className="mt-4 flex gap-2" role="tablist" aria-label="Wallet action">
                    {[['deposit', 'Deposit', 'upload'], ['withdraw', 'Withdraw', 'wallet']].map(([id, label, icon]) => (
                        <button
                            className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-[19px] border text-[13px] font-bold transition active:scale-95 ${tab === id ? 'border-transparent bg-[var(--pf-accent)] text-[var(--pf-accent-ink)] shadow-[0_0_20px_rgba(57,245,173,.22)]' : 'border-[var(--pf-border)] bg-[var(--pf-card)] text-[var(--pf-text)] hover:bg-[var(--pf-panel)]'}`}
                            onClick={() => setTab(id)}
                            role="tab"
                            aria-selected={tab === id}
                            type="button"
                            key={id}
                        >
                            <UiIcon name={icon} className={`size-4 ${id === 'withdraw' ? '' : 'rotate-180'}`} />{label}
                        </button>
                    ))}
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[1.15fr_1fr]">
                    <section className="rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-4 sm:p-5" key={tab}>
                        {tab === 'deposit'
                            ? <ManualDeposit onCancel={() => setPage('home')} />
                            : <WithdrawForm onCancel={() => setPage('home')} />}
                    </section>

                    <section className="rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-4 sm:p-5">
                        <h2 className="m-0 flex items-center gap-2 text-[15px] font-black">
                            <span className="text-[var(--pf-accent)]"><UiIcon name="results" className="size-5" /></span>Transactions
                        </h2>
                        <div className="mt-3 grid gap-2">
                            {transactions.length === 0 ? (
                                <EmptyState title="No transactions yet" description="Your deposits, withdrawals, bets and wins will appear here." />
                            ) : null}
                            {transactions.map((entry, index) => {
                                const meta = TX_META[entry.type] ?? TX_META.bet;
                                const value = typeof entry.amount === 'number' ? entry.amount : parseFloat(entry.amount ?? 0);
                                const time = entry.time ?? (entry.created_at ? new Date(entry.created_at).toLocaleDateString() : '');
                                return (
                                    <div
                                        className="animate-fade-up flex items-center justify-between gap-3 rounded-[11px] border border-[var(--pf-border)] px-3 py-2.5 transition hover:border-[var(--pf-accent)]/35"
                                        style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                                        key={entry.id}
                                    >
                                        <span className={`grid size-9 shrink-0 place-items-center rounded-[10px] text-[14px] font-black ${meta.chip}`}>{meta.sign}</span>
                                        <div className="min-w-0 flex-1">
                                            <p className="m-0 truncate text-[13px] font-bold capitalize">{entry.type}</p>
                                            <p className="m-0 truncate text-[11px] text-[var(--pf-muted)]">
                                                {entry.method ? `${entry.method} · ` : ''}{entry.reference ? `${entry.reference} · ` : ''}{time}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <b className={`block text-[13px] font-bold tabular-nums ${meta.tone}`}>{meta.sign}{Math.abs(value).toFixed(2)}</b>
                                            {entry.status === 'pending' ? <span className="block text-[10px] font-bold uppercase text-[#c98a00]">Pending</span> : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
