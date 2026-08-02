import { useEffect, useMemo, useState } from 'react';
import { isPhone, useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeft, BrandTelegram, Check, Eye, EyeOff, Lock, X } from './Icons';
import { UiIcon } from './SportIcons';
import Portal from './Portal';

const TELEGRAM_BLUE = '#229ED9';

function scorePassword(password) {
    if (!password) return { score: 0, label: '', pct: 0, color: 'bg-[var(--pf-border)]' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
        { label: 'Very weak', pct: 20, color: 'bg-[var(--pf-danger)]' },
        { label: 'Weak', pct: 40, color: 'bg-orange-500' },
        { label: 'Fair', pct: 60, color: 'bg-amber-400' },
        { label: 'Good', pct: 80, color: 'bg-sky-400' },
        { label: 'Strong', pct: 100, color: 'bg-[var(--pf-accent)]' },
    ];
    return { score, ...levels[Math.max(0, Math.min(score, 5) - 1)] };
}

function Field({ icon, iconNode, right, ...props }) {
    return (
        <label className="block">
            <span className="relative block">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pf-faint)]">
                    {iconNode ?? <UiIcon name={icon} className="size-[18px]" />}
                </span>
                <input
                    {...props}
                    className="w-full rounded-xl border border-[var(--pf-border)] bg-[var(--pf-input)] py-3 pl-11 pr-11 text-sm text-[var(--pf-text)] outline-none transition placeholder:text-[var(--pf-faint)] focus:border-[var(--pf-accent)] focus:ring-4 focus:ring-[var(--pf-accent)]/15"
                />
                {right ? <span className="absolute right-2 top-1/2 -translate-y-1/2">{right}</span> : null}
            </span>
        </label>
    );
}

export default function AuthModal({ open, initialMode = 'login', onClose }) {
    const { login, register, loginWithTelegram, requestReset, resetPassword } = useAuth();
    const toast = useToast();
    const [mode, setMode] = useState(initialMode);
    const [form, setForm] = useState({ name: '', identifier: '', password: '', confirm: '' });
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [busy, setBusy] = useState(false);
    const [remember, setRemember] = useState(true);
    const strength = useMemo(() => scorePassword(form.password), [form.password]);
    const looksLikePhone = isPhone(form.identifier);

    useEffect(() => { if (open) setMode(initialMode); }, [open, initialMode]);
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (event) => event.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
    const reset = () => { setForm({ name: '', identifier: '', password: '', confirm: '' }); setShow(false); setShowConfirm(false); };
    const close = () => { reset(); onClose(); };

    const submit = async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
            if (mode === 'login') {
                const user = await login({ identifier: form.identifier, password: form.password });
                toast.success(`Welcome back, ${user.name}!`, { title: 'Signed in' });
                close();
            } else if (mode === 'register') {
                if (form.password !== form.confirm) throw new Error('Passwords do not match.');
                const user = await register({ name: form.name, identifier: form.identifier, password: form.password });
                toast.success(`Account created. Welcome, ${user.name}!`, { title: 'Registered' });
                close();
            } else if (mode === 'forgot') {
                await requestReset({ identifier: form.identifier });
                toast.info('Demo reset confirmed. Choose a new password.', { title: 'Demo mode' });
                setMode('reset');
            } else {
                if (form.password !== form.confirm) throw new Error('Passwords do not match.');
                await resetPassword({ identifier: form.identifier, password: form.password });
                toast.success('Password updated. You can sign in now.', { title: 'Done' });
                setMode('login');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong.');
        } finally {
            setBusy(false);
        }
    };

    const telegram = async () => {
        setBusy(true);
        try {
            const user = await loginWithTelegram();
            toast.success(`Signed in as ${user.name}`, { title: 'Telegram' });
            close();
        } catch {
            toast.error('Telegram sign-in failed.');
        } finally {
            setBusy(false);
        }
    };

    const titles = {
        login: 'Welcome back',
        register: 'Create account',
        forgot: 'Reset password',
        reset: 'Set new password',
    };

    const eyeBtn = (value, fn) => (
        <button className="p-2 text-[var(--pf-faint)] transition hover:text-[var(--pf-accent)]" onClick={() => fn((current) => !current)} type="button" aria-label={value ? 'Hide password' : 'Show password'}>
            {value ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    );

    return (
        <Portal>
            <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
                <div className="app-drawer-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
                <div className="app-search-panel relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-card)] p-6 shadow-2xl sm:p-7">
                    <div className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-[var(--pf-accent)]/20 blur-3xl" />
                    <button className="absolute right-4 top-4 z-10 text-[var(--pf-faint)] transition hover:text-[var(--pf-text)]" onClick={close} type="button" aria-label="Close"><X size={20} /></button>

                    <div className="relative">
                        {mode === 'forgot' || mode === 'reset' ? (
                            <button className="mb-3 inline-flex items-center gap-1.5 text-xs text-[var(--pf-muted)] transition hover:text-[var(--pf-accent)]" onClick={() => setMode('login')} type="button">
                                <ArrowLeft size={15} /> Back to sign in
                            </button>
                        ) : null}

                        <h2 className="text-[24px] font-black tracking-tight text-[var(--pf-text)]">{titles[mode]}</h2>
                        <p className="mb-4 mt-1 text-sm text-[var(--pf-muted)]">Sign in with your phone number or username.</p>

                        {mode === 'login' || mode === 'register' ? (
                            <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-panel)] p-1">
                                {['login', 'register'].map((tab) => (
                                    <button
                                        className={`rounded-lg py-2 text-sm font-bold uppercase tracking-wider transition ${mode === tab ? 'bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]' : 'text-[var(--pf-muted)] hover:text-[var(--pf-text)]'}`}
                                        onClick={() => { setMode(tab); reset(); }}
                                        type="button"
                                        key={tab}
                                    >
                                        {tab === 'login' ? 'Sign in' : 'Register'}
                                    </button>
                                ))}
                            </div>
                        ) : null}

                        <form className="space-y-3" onSubmit={submit}>
                            {mode === 'register' ? (
                                <Field icon="user" type="text" placeholder="Display name" required value={form.name} onChange={set('name')} autoComplete="name" />
                            ) : null}

                            {mode !== 'reset' ? (
                                <div>
                                    <Field
                                        icon={looksLikePhone ? 'phone' : 'user'}
                                        type="text"
                                        inputMode={looksLikePhone ? 'tel' : 'text'}
                                        placeholder="Phone number or username"
                                        required
                                        value={form.identifier}
                                        onChange={set('identifier')}
                                        autoComplete="username"
                                    />
                                    {form.identifier ? (
                                        <p className="animate-fade-up mt-1 flex items-center gap-1 text-[11px] text-[var(--pf-muted)]">
                                            <UiIcon name={looksLikePhone ? 'phone' : 'user'} className="size-3" />
                                            Signing in with {looksLikePhone ? 'phone number' : 'username'}
                                        </p>
                                    ) : null}
                                </div>
                            ) : null}

                            {mode !== 'forgot' ? (
                                <Field iconNode={<Lock size={18} />} type={show ? 'text' : 'password'} placeholder={mode === 'reset' ? 'New password' : 'Password'} required value={form.password} onChange={set('password')} right={eyeBtn(show, setShow)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                            ) : null}

                            {(mode === 'register' || mode === 'reset') && form.password ? (
                                <div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--pf-panel)]">
                                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.pct}%` }} />
                                    </div>
                                    <p className="mt-1 text-xs text-[var(--pf-muted)]">{strength.label} password</p>
                                </div>
                            ) : null}

                            {mode === 'register' || mode === 'reset' ? (
                                <Field iconNode={<Lock size={18} />} type={showConfirm ? 'text' : 'password'} placeholder="Confirm password" required value={form.confirm} onChange={set('confirm')} right={eyeBtn(showConfirm, setShowConfirm)} autoComplete="new-password" />
                            ) : null}

                            {mode === 'login' ? (
                                <div className="flex items-center justify-between text-xs">
                                    <button className="inline-flex items-center gap-2 text-[var(--pf-muted)]" onClick={() => setRemember((value) => !value)} type="button">
                                        <span className={`flex size-4 items-center justify-center rounded border ${remember ? 'border-[var(--pf-accent)] bg-[var(--pf-accent)] text-[var(--pf-accent-ink)]' : 'border-[var(--pf-border)]'}`}>{remember ? <Check size={12} /> : null}</span>
                                        Remember me
                                    </button>
                                    <button className="font-semibold text-[var(--pf-accent)] hover:underline" onClick={() => setMode('forgot')} type="button">Forgot password?</button>
                                </div>
                            ) : null}

                            <button className="mt-4 w-full rounded-xl border-0 bg-[var(--pf-accent)] px-4 py-3 text-sm font-bold uppercase tracking-wider text-[var(--pf-accent-ink)] transition hover:brightness-110 hover:shadow-[0_0_26px_rgba(57,245,173,.3)] active:scale-95 disabled:opacity-60" disabled={busy} type="submit">
                                {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Continue' : 'Update password'}
                            </button>
                        </form>

                        {mode === 'login' || mode === 'register' ? (
                            <>
                                <div className="my-4 flex items-center gap-3 text-xs text-[var(--pf-faint)]">
                                    <span className="h-px flex-1 bg-[var(--pf-border)]" /> or continue with <span className="h-px flex-1 bg-[var(--pf-border)]" />
                                </div>
                                <button
                                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border-0 py-3 text-sm font-bold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-60"
                                    style={{ background: TELEGRAM_BLUE, boxShadow: `0 8px 24px ${TELEGRAM_BLUE}40` }}
                                    onClick={telegram}
                                    disabled={busy}
                                    type="button"
                                >
                                    <BrandTelegram size={19} /> Continue with Telegram
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </Portal>
    );
}
