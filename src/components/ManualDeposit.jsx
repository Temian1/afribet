import { useEffect, useRef, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UiIcon } from './SportIcons';

/* The house TeleBirr account players transfer to before submitting the form. */
export const TELEBIRR_ACCOUNT = '0912 345 678';
export const TELEBIRR_NAME = 'Afribet Ethiopia PLC';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;

function Field({ id, label, icon, hint, error, children }) {
    return (
        <label className="block" htmlFor={id}>
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--pf-faint)]">
                {label}
                {hint ? <span className="font-medium normal-case tracking-normal text-[var(--pf-faint)]/80">· {hint}</span> : null}
            </span>
            <div className={`flex items-center gap-2 rounded-[11px] border bg-[var(--pf-input)] px-3 transition focus-within:border-[var(--pf-accent)] focus-within:ring-2 focus-within:ring-[var(--pf-accent)]/20 ${error ? 'border-[var(--pf-danger)]' : 'border-[var(--pf-border)]'}`}>
                <span className={`shrink-0 transition-colors ${error ? 'text-[var(--pf-danger)]' : 'text-[var(--pf-faint)]'}`}>
                    <UiIcon name={icon} className="size-[18px]" />
                </span>
                {children}
            </div>
            {error ? <span className="animate-fade-up mt-1 block text-[11px] font-semibold text-[var(--pf-danger)]">{error}</span> : null}
        </label>
    );
}

const inputClass = 'min-w-0 flex-1 border-0 bg-transparent py-3 text-[14px] text-[var(--pf-text)] outline-none placeholder:text-[var(--pf-faint)]';

export default function ManualDeposit({ onCancel }) {
    const { addTransaction } = useApp();
    const { user } = useAuth();
    const toast = useToast();

    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [fullName, setFullName] = useState(user?.name ?? '');
    const [account, setAccount] = useState('');
    const [receipt, setReceipt] = useState(null);
    const [preview, setPreview] = useState('');
    const [errors, setErrors] = useState({});
    const [copied, setCopied] = useState(false);
    const [busy, setBusy] = useState(false);
    const fileRef = useRef(null);

    // Object URLs must be released or the blob stays in memory.
    useEffect(() => {
        if (!receipt) return undefined;
        const url = URL.createObjectURL(receipt);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [receipt]);

    const copyAccount = async () => {
        try {
            await navigator.clipboard.writeText(TELEBIRR_ACCOUNT.replace(/\s/g, ''));
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            toast.error('Could not copy. Please note the number manually.');
        }
    };

    const pickReceipt = (fromEvent) => {
        const file = fromEvent.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setErrors((current) => ({ ...current, receipt: 'Upload an image of the transfer receipt.' }));
            return;
        }
        if (file.size > MAX_RECEIPT_BYTES) {
            setErrors((current) => ({ ...current, receipt: 'Screenshot must be under 5MB.' }));
            return;
        }
        setErrors((current) => ({ ...current, receipt: undefined }));
        setReceipt(file);
    };

    const validate = () => {
        const next = {};
        const value = Number(amount);
        if (!amount || Number.isNaN(value) || value <= 0) next.amount = 'Enter the amount you transferred.';
        else if (value < 50) next.amount = 'Minimum deposit is 50 ETB.';
        if (!transactionId.trim()) next.transactionId = 'Enter the TeleBirr transaction ID.';
        else if (transactionId.trim().length < 6) next.transactionId = 'Transaction ID looks too short.';
        if (!fullName.trim()) next.fullName = 'Enter the name on the sending account.';
        if (!account.trim()) next.account = 'Enter the TeleBirr number you sent from.';
        else if (!/^[0-9+\s-]{9,}$/.test(account.trim())) next.account = 'Enter a valid TeleBirr number.';
        if (!receipt) next.receipt = 'Attach a screenshot of the transfer receipt.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const submit = (fromEvent) => {
        fromEvent.preventDefault();
        if (!validate()) {
            toast.error('Please complete the highlighted fields.');
            return;
        }
        setBusy(true);
        // Manual deposits are credited by an operator, so nothing is added to the
        // balance here — the request is logged as pending review.
        addTransaction({
            type: 'deposit',
            amount: Number(amount),
            method: 'TeleBirr',
            status: 'pending',
            reference: transactionId.trim(),
            sender: fullName.trim(),
            senderAccount: account.trim(),
            receiptName: receipt.name,
        });
        toast.success(`Deposit of ${Number(amount).toLocaleString()} ETB submitted for review.`, { title: 'Wallet' });
        setAmount('');
        setTransactionId('');
        setAccount('');
        setReceipt(null);
        setPreview('');
        setErrors({});
        if (fileRef.current) fileRef.current.value = '';
        setBusy(false);
    };

    return (
        <form className="animate-fade-up" onSubmit={submit} noValidate>
            {/* Pay-to account */}
            <div className="relative overflow-hidden rounded-[14px] border border-[var(--pf-accent)]/35 bg-[var(--pf-accent-soft)] p-4">
                <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[var(--pf-accent)]/20 blur-2xl" aria-hidden="true" />
                <div className="relative flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-[var(--pf-accent)] text-[var(--pf-accent-ink)] shadow-[0_0_22px_rgba(57,245,173,.28)]">
                        <UiIcon name="phone" className="size-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <span className="block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-muted)]">Send TeleBirr to</span>
                        <b className="block truncate font-mono text-[20px] font-black tracking-wide text-[var(--pf-text)] sm:text-[24px]">{TELEBIRR_ACCOUNT}</b>
                        <span className="block truncate text-[11px] text-[var(--pf-muted)]">{TELEBIRR_NAME}</span>
                    </div>
                    <button
                        className="flex h-[38px] shrink-0 items-center gap-1.5 rounded-[10px] border-0 bg-[var(--pf-accent)] px-3 text-[12px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 active:scale-90"
                        onClick={copyAccount}
                        type="button"
                        aria-label="Copy TeleBirr account number"
                    >
                        <UiIcon name={copied ? 'check' : 'copy'} className={`size-4 ${copied ? 'animate-scale-in' : ''}`} />
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <p className="relative m-0 mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-[var(--pf-muted)]">
                    <UiIcon name="info" className="mt-px size-3.5 shrink-0" />
                    Transfer first, then fill in the details below. Deposits are credited after our team verifies the receipt.
                </p>
            </div>

            <div className="mt-4 space-y-4">
                <div>
                    <Field id="deposit-amount" label="Amount" hint="ETB" icon="wallet" error={errors.amount}>
                        <input
                            className={`${inputClass} font-bold tabular-nums`}
                            id="deposit-amount"
                            type="number"
                            inputMode="numeric"
                            min="50"
                            value={amount}
                            onChange={(fromEvent) => setAmount(fromEvent.target.value)}
                            placeholder="0.00"
                        />
                        <span className="shrink-0 text-[12px] font-bold text-[var(--pf-faint)]">ETB</span>
                    </Field>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                        {QUICK_AMOUNTS.map((value, index) => {
                            const active = Number(amount) === value;
                            return (
                                <button
                                    className={`animate-fade-up h-9 rounded-[10px] border px-3.5 text-[13px] font-bold tabular-nums transition hover:-translate-y-0.5 active:scale-95 ${active ? 'border-[var(--pf-accent)] bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]' : 'border-[var(--pf-border)] bg-[var(--pf-panel)] text-[var(--pf-text)] hover:border-[var(--pf-accent)]/50'}`}
                                    style={{ animationDelay: `${index * 35}ms` }}
                                    onClick={() => setAmount(String(value))}
                                    type="button"
                                    aria-pressed={active}
                                    key={value}
                                >
                                    {value.toLocaleString()}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <Field id="deposit-txid" label="Transaction ID" icon="hash" error={errors.transactionId}>
                    <input
                        className={`${inputClass} font-mono uppercase`}
                        id="deposit-txid"
                        value={transactionId}
                        onChange={(fromEvent) => setTransactionId(fromEvent.target.value)}
                        placeholder="e.g. CH24XKD9P1"
                        autoComplete="off"
                    />
                </Field>

                <Field id="deposit-name" label="Full name" icon="user" error={errors.fullName}>
                    <input
                        className={inputClass}
                        id="deposit-name"
                        value={fullName}
                        onChange={(fromEvent) => setFullName(fromEvent.target.value)}
                        placeholder="Name on the TeleBirr account"
                        autoComplete="name"
                    />
                </Field>

                <Field id="deposit-account" label="TeleBirr number" hint="you sent from" icon="phone" error={errors.account}>
                    <input
                        className={`${inputClass} tabular-nums`}
                        id="deposit-account"
                        type="tel"
                        inputMode="tel"
                        value={account}
                        onChange={(fromEvent) => setAccount(fromEvent.target.value)}
                        placeholder="09xx xxx xxx"
                        autoComplete="tel"
                    />
                </Field>

                {/* Receipt upload */}
                <div>
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-faint)]">Transfer receipt</span>
                    <input className="sr-only" ref={fileRef} id="deposit-receipt" type="file" accept="image/*" onChange={pickReceipt} />
                    <label
                        className={`group flex cursor-pointer items-center gap-3 rounded-[11px] border border-dashed p-3 transition hover:bg-[var(--pf-panel)] ${errors.receipt ? 'border-[var(--pf-danger)]' : 'border-[var(--pf-border)] hover:border-[var(--pf-accent)]/60'}`}
                        htmlFor="deposit-receipt"
                    >
                        {preview ? (
                            <img className="animate-scale-in size-14 shrink-0 rounded-[9px] object-cover" src={preview} alt="Transfer receipt preview" />
                        ) : (
                            <span className="grid size-14 shrink-0 place-items-center rounded-[9px] bg-[var(--pf-panel)] text-[var(--pf-faint)] transition group-hover:text-[var(--pf-accent)]">
                                <UiIcon name="image" className="size-6" />
                            </span>
                        )}
                        <span className="min-w-0 flex-1">
                            <b className="block truncate text-[13px] text-[var(--pf-text)]">{receipt ? receipt.name : 'Upload receipt screenshot'}</b>
                            <span className="block text-[11px] text-[var(--pf-muted)]">{receipt ? 'Tap to replace' : 'PNG or JPG, up to 5MB'}</span>
                        </span>
                        <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-[var(--pf-panel)] text-[var(--pf-accent)] transition group-hover:-translate-y-0.5">
                            <UiIcon name="upload" className="size-[18px]" />
                        </span>
                    </label>
                    {errors.receipt ? <span className="animate-fade-up mt-1 block text-[11px] font-semibold text-[var(--pf-danger)]">{errors.receipt}</span> : null}
                </div>
            </div>

            <div className="mt-5 flex gap-3">
                <button
                    className="h-[46px] flex-1 rounded-[12px] border border-[var(--pf-border)] bg-transparent text-[14px] font-bold text-[var(--pf-text)] transition hover:bg-[var(--pf-panel)] active:scale-95"
                    onClick={onCancel}
                    type="button"
                >
                    Cancel
                </button>
                <button
                    className="h-[46px] flex-1 rounded-[12px] border-0 bg-[var(--pf-accent)] text-[14px] font-bold text-[var(--pf-accent-ink)] transition hover:brightness-110 hover:shadow-[0_0_26px_rgba(57,245,173,.3)] active:scale-95 disabled:opacity-60"
                    disabled={busy}
                    type="submit"
                >
                    {busy ? 'Submitting…' : 'Submit deposit'}
                </button>
            </div>
        </form>
    );
}
