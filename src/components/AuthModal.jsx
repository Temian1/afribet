import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeft, Check, Eye, EyeOff, Google, Lock, Mail, User, X } from './Icons';
import Portal from './Portal';

function scorePassword(password) {
    if (!password) return { score: 0, label: '', pct: 0, color: 'bg-slate-300' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
        { label: 'Very weak', pct: 20, color: 'bg-neon-red' },
        { label: 'Weak', pct: 40, color: 'bg-orange-500' },
        { label: 'Fair', pct: 60, color: 'bg-gold' },
        { label: 'Good', pct: 80, color: 'bg-cyan' },
        { label: 'Strong', pct: 100, color: 'bg-neon-green' },
    ];
    return { score, ...levels[Math.max(0, Math.min(score, 5) - 1)] };
}

function Field({ icon: Icon, right, ...props }) {
    return (
        <label className="block">
            <span className="relative block">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={18} /></span>
                <input
                    {...props}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-purple-l focus:ring-4 focus:ring-purple/10 dark:border-white/10 dark:bg-white/[.04] dark:text-slate-100"
                />
                {right && <span className="absolute right-2 top-1/2 -translate-y-1/2">{right}</span>}
            </span>
        </label>
    );
}

export default function AuthModal({ open, initialMode = 'login', onClose }) {
    const { login, register, loginWithGoogle, requestReset, resetPassword } = useAuth();
    const toast = useToast();
    const [mode, setMode] = useState(initialMode);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [busy, setBusy] = useState(false);
    const [remember, setRemember] = useState(true);
    const strength = useMemo(() => scorePassword(form.password), [form.password]);

    useEffect(() => { if (open) setMode(initialMode); }, [open, initialMode]);
    useEffect(() => {
        if (!open) return;
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
    const reset = () => { setForm({ name: '', email: '', password: '', confirm: '' }); setShow(false); setShowConfirm(false); };
    const close = () => { reset(); onClose(); };

    const submit = async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
            if (mode === 'login') {
                const user = await login({ email: form.email, password: form.password });
                toast.success(`Welcome back, ${user.name}!`, { title: 'Signed in' });
                close();
            } else if (mode === 'register') {
                if (form.password !== form.confirm) throw new Error('Passwords do not match.');
                const user = await register({ name: form.name, email: form.email, password: form.password });
                toast.success(`Account created. Welcome, ${user.name}!`, { title: 'Registered' });
                close();
            } else if (mode === 'forgot') {
                await requestReset({ email: form.email });
                toast.info('Demo reset confirmed. Choose a new password.', { title: 'Demo mode' });
                setMode('reset');
            } else {
                if (form.password !== form.confirm) throw new Error('Passwords do not match.');
                await resetPassword({ email: form.email, password: form.password });
                toast.success('Password updated. You can sign in now.', { title: 'Done' });
                setMode('login');
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong.');
        } finally {
            setBusy(false);
        }
    };

    const google = async () => {
        setBusy(true);
        try {
            const user = await loginWithGoogle();
            toast.success(`Signed in as ${user.name}`, { title: 'Google' });
            close();
        } catch {
            toast.error('Google sign-in failed.');
        } finally {
            setBusy(false);
        }
    };

    const titles = {
        login: 'Welcome Back',
        register: 'Create Account',
        forgot: 'Reset Password',
        reset: 'Set New Password',
    };

    const eyeBtn = (value, fn) => (
        <button type="button" onClick={() => fn((current) => !current)} className="p-2 text-slate-400 transition hover:text-purple-l" aria-label={value ? 'Hide password' : 'Show password'}>
            {value ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    );

    return (
        <Portal>
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
            <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-ink-2 sm:p-7">
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-purple/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
                <button onClick={close} className="absolute right-4 top-4 z-10 text-slate-500 transition hover:text-slate-950 dark:hover:text-white" type="button" aria-label="Close"><X size={20} /></button>

                <div className="relative">
                    {(mode === 'forgot' || mode === 'reset') && (
                        <button onClick={() => setMode('login')} className="mb-3 inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-purple-d dark:hover:text-purple-l" type="button">
                            <ArrowLeft size={15} /> Back to sign in
                        </button>
                    )}
                    <h2 className="bg-gradient-to-br from-purple-l to-gold-l bg-clip-text font-display text-2xl font-black tracking-wide text-transparent">{titles[mode]}</h2>
                    <p className="mb-3 mt-1 text-sm text-slate-600 dark:text-slate-400">Explore the complete Afribet interface in demo mode.</p>

                    {(mode === 'login' || mode === 'register') && (
                        <div className="mb-5 flex items-start gap-2 rounded-xl border border-[#39f5ad]/25 bg-[#39f5ad]/10 px-3 py-2.5 text-xs leading-relaxed text-[#127c5c] dark:text-[#8fffd6]">
                            <span className="mt-0.5 size-2 shrink-0 rounded-full bg-[#39f5ad] shadow-[0_0_10px_#39f5ad]" />
                            <span><strong>Frontend demo:</strong> use any email and password. No real account or credentials are sent to a server.</span>
                        </div>
                    )}

                    {(mode === 'login' || mode === 'register') && (
                        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-white/[.04]">
                            {['login', 'register'].map((tab) => (
                                <button key={tab} onClick={() => { setMode(tab); reset(); }} className={`rounded-lg py-2 font-heading text-sm font-bold uppercase tracking-wider transition ${mode === tab ? 'bg-purple/20 text-purple-d dark:text-purple-l' : 'text-slate-500'}`} type="button">
                                    {tab === 'login' ? 'Sign In' : 'Register'}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-3">
                        {mode === 'register' && <Field icon={User} type="text" placeholder="Display name" required value={form.name} onChange={set('name')} />}
                        {mode !== 'reset' && <Field icon={Mail} type="email" placeholder="Email address" required value={form.email} onChange={set('email')} />}
                        {mode !== 'forgot' && <Field icon={Lock} type={show ? 'text' : 'password'} placeholder={mode === 'reset' ? 'New password' : 'Password'} required value={form.password} onChange={set('password')} right={eyeBtn(show, setShow)} />}

                        {(mode === 'register' || mode === 'reset') && form.password && (
                            <div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                    <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: `${strength.pct}%` }} />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">{strength.label} password</p>
                            </div>
                        )}

                        {(mode === 'register' || mode === 'reset') && <Field icon={Lock} type={showConfirm ? 'text' : 'password'} placeholder="Confirm password" required value={form.confirm} onChange={set('confirm')} right={eyeBtn(showConfirm, setShowConfirm)} />}

                        {mode === 'login' && (
                            <div className="flex items-center justify-between text-xs">
                                <button type="button" onClick={() => setRemember((value) => !value)} className="inline-flex items-center gap-2 text-slate-500">
                                    <span className={`flex h-4 w-4 items-center justify-center rounded border ${remember ? 'border-purple bg-purple text-white' : 'border-slate-300 dark:border-white/20'}`}>{remember && <Check size={12} />}</span>
                                    Remember me
                                </button>
                                <button type="button" onClick={() => setMode('forgot')} className="text-purple-d hover:underline dark:text-purple-l">Forgot password?</button>
                            </div>
                        )}

                        <button type="submit" disabled={busy} className="mt-4 w-full rounded-lg bg-gradient-to-br from-purple to-purple-d px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider text-white transition hover:from-purple-l hover:to-purple">
                            {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Update Password'}
                        </button>
                    </form>

                    {(mode === 'login' || mode === 'register') && (
                        <>
                            <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
                                <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" /> or continue with <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                            </div>
                            <button onClick={google} disabled={busy} className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-900 transition hover:border-purple-l/50 dark:border-white/10 dark:bg-white/[.04] dark:text-slate-100" type="button">
                                <Google size={18} /> Google
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
        </Portal>
    );
}
