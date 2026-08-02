import { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UiIcon } from '../components/SportIcons';
import ManualDeposit, { TELEBIRR_ACCOUNT } from '../components/ManualDeposit';

const QUICK = [100, 250, 500, 1000, 2000, 5000];

const TX_META = {
    deposit: { sign: '+', tone: 'text-[var(--pf-accent)]', chip: 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]', icon: 'upload' },
    win: { sign: '+', tone: 'text-[var(--pf-accent)]', chip: 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]', icon: 'crown' },
    bonus: { sign: '+', tone: 'text-[var(--pf-accent)]', chip: 'bg-[var(--pf-warn-soft)] text-[#c98a00]', icon: 'gift' },
    referral: { sign: '+', tone: 'text-[var(--pf-accent)]', chip: 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]', icon: 'users' },
    withdrawal: { sign: '-', tone: 'text-[var(--pf-danger)]', chip: 'bg-[var(--pf-danger-soft)] text-[var(--pf-danger)]', icon: 'wallet' },
    withdraw: { sign: '-', tone: 'text-[var(--pf-danger)]', chip: 'bg-[var(--pf-danger-soft)] text-[var(--pf-danger)]', icon: 'wallet' },
    bet: { sign: '-', tone: 'text-[var(--pf-muted)]', chip: 'bg-[var(--pf-panel)] text-[var(--pf-muted)]', icon: 'slip' },
};

const FILTERS = [['all', 'All'], ['deposit', 'Deposits'], ['withdrawal', 'Withdrawals'], ['bet', 'Bets']];

const inputClass = 'min-w-0 flex-1 border-0 bg-transparent py-3 text-[14px] text-[var(--pf-text)] outline-none placeholder:text-[var(--pf-faint)]';
const fieldClass = 'flex items-center gap-2 rounded-[11px] border border-[var(--pf-border)] bg-[var(--pf-input)] px-3 transition focus-within:border-[var(--pf-accent)] focus-within:ring-2 focus-within:ring-[var(--pf-accent)]/20';

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
            <div className="flex items-start gap-2 rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-panel)] p-3 text-[11px] leading-relaxed text-[var(--pf-muted)]">
                <UiIcon name="info" className="mt-px size-4 shrink-0 text-[var(--pf-accent)]" />
                Payouts go to your TeleBirr number and are reviewed within 15 minutes during business hours.
            </div>

            <label className="block" htmlFor="withdraw-amount">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-faint)]">Amount · ETB</span>
                <div className={fieldClass}>
                    <span className="shrink-0 text-[var(--pf-faint)]"><UiIcon name="wallet" className="size-[18px]" /></span>
                    <input className={`${inputClass} font-bold tabular-nums`} id="withdraw-amount" type="number" min="1" value={amount} onChange={(fromEvent) => setAmount(fromEvent.target.value)} placeholder="0.00" />
                    <span className="shrink-0 text-[12px] font-bold text-[var(--pf-faint)]">ETB</span>
                </div>
            </label>

            <div className="flex flex-wrap gap-2">
                {QUICK.map((value, index) => {
                    const active = Number(amount) === value;
                    return (
                        <button
                            className={`animate-fade-up h-9 rounded-[10px] border px-3.5 text-[13px] font-bold tabular-nums transition hover:-translate-y-0.5 active:scale-95 ${active ? 'border-[var(--pf-accent)] bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]' : 'border-[var(--pf-border)] bg-[var(--pf-panel)] text-[var(--pf-text)] hover:border-[var(--pf-accent)]/50'}`}
                            style={{ animationDelay: `${index * 35}ms` }}
                            onClick={() => setAmount(String(value))}
                            type="button"
                            key={value}
                        >
                            {value.toLocaleString()}
                        </button>
                    );
                })}
                <button className="h-9 rounded-[10px] border border-dashed border-[var(--pf-accent)]/50 px-3.5 text-[13px] font-bold text-[var(--pf-accent)] transition active:scale-95" onClick={() => setAmount(String(Math.floor(balance)))} type="button">
                    Max
                </button>
            </div>

            <label className="block" htmlFor="withdraw-destination">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-faint)]">TeleBirr number</span>
                <div className={fieldClass}>
                    <span className="shrink-0 text-[var(--pf-faint)]"><UiIcon name="phone" className="size-[18px]" /></span>
                    <input className={`${inputClass} tabular-nums`} id="withdraw-destination" type="tel" value={destination} onChange={(fromEvent) => setDestination(fromEvent.target.value)} placeholder="09xx xxx xxx" />
                </div>
            </label>

            <div className="flex gap-3 pt-1">
                <button className="h-[46px] flex-1 rounded-[12px] border border-[var(--pf-border)] bg-transparent text-[14px] font-bold text-[var(--pf-text)] transition hover:bg-[var(--pf-panel)] active:scale-95" onClick={onCancel} type="button">Cancel</button>
                <button className="h-[46px] flex-1 rounded-[12px] border-0 bg-[var(--pf-accent)] text-[14px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 hover:shadow-[0_0_26px_rgba(57,245,173,.3)] active:scale-95 disabled:opacity-60" disabled={busy} type="submit">
                    {busy ? 'Submitting…' : 'Request withdrawal'}
                </button>
            </div>
        </form>
    );
}

export default function Wallet() {
    const { balance, transactions, setPage } = useApp();
    const { user } = useAuth();
    const [tab, setTab] = useState('deposit');
    const [filter, setFilter] = useState('all');

    const summary = useMemo(() => {
        const total = (type) => transactions
            .filter((entry) => entry.type === type)
            .reduce((sum, entry) => sum + Math.abs(Number(entry.amount) || 0), 0);
        return {
            deposited: total('deposit'),
            withdrawn: total('withdrawal') + total('withdraw'),
            pending: transactions.filter((entry) => entry.status === 'pending').length,
        };
    }, [transactions]);

    const visible = filter === 'all'
        ? transactions
        : transactions.filter((entry) => (filter === 'withdrawal'
            ? entry.type === 'withdrawal' || entry.type === 'withdraw'
            : entry.type === filter));

    return (
        <div className="min-h-screen bg-[var(--pf-bg)] pb-12 text-[var(--pf-text)]">
            {/* Balance hero */}
            <header className="relative overflow-hidden px-4 pb-6 pt-6 sm:px-6">
                <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-[var(--pf-accent)]/12 blur-[90px]" aria-hidden="true" />
                <div className="relative mx-auto max-w-5xl">
                    <div className="animate-fade-up relative overflow-hidden rounded-[18px] border border-[var(--pf-border)] bg-gradient-to-br from-[var(--pf-header-from)] to-[var(--pf-card)] p-5 sm:p-6">
                        <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-[var(--pf-accent)]/12 blur-2xl" aria-hidden="true" />
                        <div className="relative flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[2px] text-[var(--pf-faint)]">
                                    <UiIcon name="wallet" className="size-4 text-[var(--pf-accent)]" />Available balance
                                </span>
                                <b className="mt-1.5 block text-[36px] font-black leading-none tabular-nums tracking-tight sm:text-[46px]">
                                    {balance.toFixed(2)}
                                    <span className="ml-2 text-[18px] font-bold text-[var(--pf-accent)] sm:text-[22px]">ETB</span>
                                </b>
                                <span className="mt-2 block truncate text-[12px] text-[var(--pf-muted)]">
                                    {user?.name ? `${user.name} · ` : ''}TeleBirr {TELEBIRR_ACCOUNT}
                                </span>
                            </div>
                            {summary.pending > 0 ? (
                                <span className="animate-scale-in flex shrink-0 items-center gap-1.5 rounded-full border border-[#c98a00]/35 bg-[var(--pf-warn-soft)] px-3 py-1.5 text-[11px] font-bold text-[#c98a00]">
                                    <span className="size-1.5 animate-pulse rounded-full bg-current" />
                                    {summary.pending} pending
                                </span>
                            ) : null}
                        </div>

                        <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {[
                                { icon: 'upload', label: 'Deposited', value: summary.deposited },
                                { icon: 'wallet', label: 'Withdrawn', value: summary.withdrawn },
                                { icon: 'results', label: 'Transactions', value: transactions.length, plain: true },
                            ].map((stat, index) => (
                                <div
                                    className="animate-fade-up flex items-center gap-2.5 rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-panel)] p-3 max-sm:last:col-span-2"
                                    style={{ animationDelay: `${index * 70}ms` }}
                                    key={stat.label}
                                >
                                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[var(--pf-card)] text-[var(--pf-accent)]">
                                        <UiIcon name={stat.icon} className="size-[18px]" />
                                    </span>
                                    <div className="min-w-0">
                                        <b className="block truncate text-[15px] font-black tabular-nums">
                                            {stat.plain ? stat.value : stat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </b>
                                        <span className="block truncate text-[11px] text-[var(--pf-muted)]">{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <div className="grid gap-3 lg:grid-cols-[1.15fr_1fr]">
                    {/* Deposit / withdraw */}
                    <section className="rounded-[16px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-4 sm:p-5">
                        <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-[13px] border border-[var(--pf-border)] bg-[var(--pf-panel)] p-1.5" role="tablist" aria-label="Wallet action">
                            {[['deposit', 'Deposit', 'upload'], ['withdraw', 'Withdraw', 'wallet']].map(([id, label, icon]) => (
                                <button
                                    className={`flex h-10 items-center justify-center gap-2 rounded-[10px] border-0 text-[13px] font-bold transition active:scale-95 ${tab === id ? 'bg-[var(--pf-accent)] text-[var(--pf-accent-ink)] shadow-[0_0_20px_rgba(57,245,173,.2)]' : 'bg-transparent text-[var(--pf-muted)] hover:text-[var(--pf-text)]'}`}
                                    onClick={() => setTab(id)}
                                    role="tab"
                                    aria-selected={tab === id}
                                    type="button"
                                    key={id}
                                >
                                    <UiIcon name={icon} className={`size-4 ${id === 'withdraw' ? 'rotate-180' : ''}`} />{label}
                                </button>
                            ))}
                        </div>

                        <div key={tab}>
                            {tab === 'deposit'
                                ? <ManualDeposit onCancel={() => setPage('home')} />
                                : <WithdrawForm onCancel={() => setPage('home')} />}
                        </div>
                    </section>

                    {/* History */}
                    <section className="rounded-[16px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-4 sm:p-5">
                        <h2 className="m-0 flex items-center gap-2 text-[15px] font-black">
                            <span className="text-[var(--pf-accent)]"><UiIcon name="results" className="size-5" /></span>Transactions
                        </h2>

                        <div className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
                            {FILTERS.map(([id, label]) => (
                                <button
                                    className={`h-8 shrink-0 rounded-full border px-3 text-[12px] font-bold transition active:scale-95 ${filter === id ? 'border-transparent bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]' : 'border-[var(--pf-border)] bg-transparent text-[var(--pf-muted)] hover:bg-[var(--pf-panel)]'}`}
                                    onClick={() => setFilter(id)}
                                    type="button"
                                    aria-pressed={filter === id}
                                    key={id}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-3 grid gap-2">
                            {visible.length === 0 ? (
                                <div className="animate-fade-up rounded-[12px] border border-dashed border-[var(--pf-border)] py-10 text-center">
                                    <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--pf-panel)] text-[var(--pf-faint)]">
                                        <UiIcon name="results" className="size-6" />
                                    </span>
                                    <p className="m-0 mt-3 text-[13px] font-bold">Nothing here yet</p>
                                    <p className="m-0 mt-1 text-[12px] text-[var(--pf-muted)]">Deposits, withdrawals, bets and wins will appear here.</p>
                                </div>
                            ) : null}

                            {visible.map((entry, index) => {
                                const meta = TX_META[entry.type] ?? TX_META.bet;
                                const value = typeof entry.amount === 'number' ? entry.amount : parseFloat(entry.amount ?? 0);
                                const time = entry.time ?? (entry.created_at ? new Date(entry.created_at).toLocaleDateString() : '');
                                return (
                                    <div
                                        className="animate-fade-up flex items-center gap-3 rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-panel)] px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-[var(--pf-accent)]/35"
                                        style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                                        key={entry.id}
                                    >
                                        <span className={`grid size-9 shrink-0 place-items-center rounded-[10px] ${meta.chip}`}>
                                            <UiIcon name={meta.icon} className="size-[18px]" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="m-0 truncate text-[13px] font-bold capitalize">{entry.type}</p>
                                            <p className="m-0 truncate text-[11px] text-[var(--pf-muted)]">
                                                {entry.method ? `${entry.method} · ` : ''}{entry.reference ? `${entry.reference} · ` : ''}{time}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <b className={`block text-[13px] font-bold tabular-nums ${meta.tone}`}>{meta.sign}{Math.abs(value).toFixed(2)}</b>
                                            {entry.status === 'pending'
                                                ? <span className="block text-[10px] font-bold uppercase text-[#c98a00]">Pending</span>
                                                : <span className="block text-[10px] uppercase text-[var(--pf-faint)]">ETB</span>}
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
