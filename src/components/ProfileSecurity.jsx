import { useEffect, useState } from 'react';
import { accountApi } from '../services/playerApi';
import { userApi } from '../services/authApi';
import { useToast } from '../contexts/ToastContext';

const KYC_META = {
    unverified: { label: 'Not verified', cls: 'border-slate-300 bg-slate-100 text-slate-600 dark:border-white/15 dark:bg-white/[.06] dark:text-slate-300' },
    pending: { label: 'Under review', cls: 'border-gold/40 bg-gold/10 text-amber-600 dark:text-gold-l' },
    verified: { label: 'Verified', cls: 'border-neon-green/40 bg-neon-green/10 text-emerald-600 dark:text-neon-green-l' },
    rejected: { label: 'Rejected', cls: 'border-neon-red/40 bg-neon-red/10 text-neon-red' },
};

/* Change password, active sessions and identity verification. */
export function SecurityCard() {
    const toast = useToast();
    const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [pwBusy, setPwBusy] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [kyc, setKyc] = useState({ kyc_status: 'unverified' });
    const [kycForm, setKycForm] = useState({ document_type: 'passport', full_name: '', country: '' });
    const [kycOpen, setKycOpen] = useState(false);
    const [kycBusy, setKycBusy] = useState(false);

    useEffect(() => {
        accountApi.getSessions().then((d) => setSessions(d.sessions ?? [])).catch(() => {});
        accountApi.getKyc().then(setKyc).catch(() => {});
    }, []);

    const changePassword = async (e) => {
        e.preventDefault();
        setPwBusy(true);
        try {
            await userApi.changePassword(pw);
            toast.success('Password changed.', { title: 'Security' });
            setPw({ current_password: '', password: '', password_confirmation: '' });
        } catch (err) {
            toast.error(err.message ?? 'Could not change password.');
        } finally {
            setPwBusy(false);
        }
    };

    const revoke = async (id) => {
        try {
            await accountApi.revokeSession(id);
            setSessions((prev) => prev.filter((s) => s.id !== id));
            toast.success('Session revoked.', { title: 'Security' });
        } catch (err) {
            toast.error(err.message ?? 'Could not revoke session.');
        }
    };

    const submitKyc = async (e) => {
        e.preventDefault();
        setKycBusy(true);
        try {
            await accountApi.submitKyc(kycForm);
            setKyc((prev) => ({ ...prev, kyc_status: 'pending' }));
            setKycOpen(false);
            toast.success('Verification submitted for review.', { title: 'KYC' });
        } catch (err) {
            toast.error(err.message ?? 'Could not submit verification.');
        } finally {
            setKycBusy(false);
        }
    };

    const kycMeta = KYC_META[kyc.kyc_status] ?? KYC_META.unverified;
    const set = (key) => (e) => setPw((c) => ({ ...c, [key]: e.target.value }));

    return (
        <div className="card p-5">
            <h3 className="font-heading text-lg font-bold text-slate-950 dark:text-white">Security</h3>

            {/* Change password */}
            <form onSubmit={changePassword} className="mt-4 grid gap-3 sm:grid-cols-3">
                <label className="block">
                    <span className="field-label">Current password</span>
                    <input type="password" required value={pw.current_password} onChange={set('current_password')} className="input" autoComplete="current-password" />
                </label>
                <label className="block">
                    <span className="field-label">New password</span>
                    <input type="password" required minLength={8} value={pw.password} onChange={set('password')} className="input" autoComplete="new-password" />
                </label>
                <label className="block">
                    <span className="field-label">Confirm new password</span>
                    <input type="password" required minLength={8} value={pw.password_confirmation} onChange={set('password_confirmation')} className="input" autoComplete="new-password" />
                </label>
                <div className="sm:col-span-3">
                    <button type="submit" disabled={pwBusy} className="btn-primary px-5 py-2.5 text-xs uppercase tracking-wider">
                        {pwBusy ? 'Saving…' : 'Change Password'}
                    </button>
                </div>
            </form>

            {/* Identity verification */}
            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/[.07]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Identity verification (KYC)</p>
                        <p className="mt-0.5 text-xs text-slate-500">Verify your identity to unlock higher withdrawal limits.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`badge border ${kycMeta.cls}`}>{kycMeta.label}</span>
                        {['unverified', 'rejected'].includes(kyc.kyc_status) && (
                            <button type="button" onClick={() => setKycOpen((v) => !v)} className="btn-outline px-4 py-2 text-xs uppercase tracking-wider">
                                {kycOpen ? 'Cancel' : 'Verify Now'}
                            </button>
                        )}
                    </div>
                </div>

                {kycOpen && (
                    <form onSubmit={submitKyc} className="animate-fade-in mt-4 grid gap-3 sm:grid-cols-3">
                        <label className="block">
                            <span className="field-label">Document type</span>
                            <select value={kycForm.document_type} onChange={(e) => setKycForm((c) => ({ ...c, document_type: e.target.value }))} className="input">
                                <option value="passport">Passport</option>
                                <option value="id_card">National ID</option>
                                <option value="drivers_license">Driver's License</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="field-label">Full legal name</span>
                            <input required value={kycForm.full_name} onChange={(e) => setKycForm((c) => ({ ...c, full_name: e.target.value }))} className="input" />
                        </label>
                        <label className="block">
                            <span className="field-label">Country</span>
                            <input required value={kycForm.country} onChange={(e) => setKycForm((c) => ({ ...c, country: e.target.value }))} className="input" />
                        </label>
                        <div className="sm:col-span-3">
                            <button type="submit" disabled={kycBusy} className="btn-primary px-5 py-2.5 text-xs uppercase tracking-wider">
                                {kycBusy ? 'Submitting…' : 'Submit for Review'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Active sessions */}
            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/[.07]">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Active sessions</p>
                <p className="mt-0.5 text-xs text-slate-500">Devices signed in to your account. Revoke anything you don't recognize.</p>
                <div className="mt-3 grid gap-2">
                    {sessions.length === 0 && <p className="text-sm text-slate-500">No session data available.</p>}
                    {sessions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3.5 py-2.5 dark:border-white/[.05]">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {s.name || 'API token'}
                                    {s.current && <span className="badge ml-2 border border-neon-green/40 bg-neon-green/10 text-emerald-600 dark:text-neon-green-l">This device</span>}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {s.last_used_at ? `Last active ${new Date(s.last_used_at).toLocaleString()}` : `Created ${new Date(s.created_at).toLocaleDateString()}`}
                                </p>
                            </div>
                            {!s.current && (
                                <button type="button" onClick={() => revoke(s.id)} className="btn-ghost px-3 py-1.5 text-xs uppercase tracking-wider !text-neon-red">
                                    Revoke
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* Deposit limits and self-exclusion. */
export function ResponsibleGamblingCard() {
    const toast = useToast();
    const [limits, setLimits] = useState({ deposit_limit_daily: '', deposit_limit_weekly: '', deposit_limit_monthly: '' });
    const [excludedUntil, setExcludedUntil] = useState(null);
    const [busy, setBusy] = useState(false);
    const [confirmExclude, setConfirmExclude] = useState(false);

    useEffect(() => {
        accountApi.getLimits().then((d) => {
            setLimits({
                deposit_limit_daily: d.deposit_limit_daily ?? '',
                deposit_limit_weekly: d.deposit_limit_weekly ?? '',
                deposit_limit_monthly: d.deposit_limit_monthly ?? '',
            });
            setExcludedUntil(d.self_excluded_until);
        }).catch(() => {});
    }, []);

    const save = async (extra = {}) => {
        setBusy(true);
        try {
            await accountApi.updateLimits({
                deposit_limit_daily: limits.deposit_limit_daily === '' ? null : Number(limits.deposit_limit_daily),
                deposit_limit_weekly: limits.deposit_limit_weekly === '' ? null : Number(limits.deposit_limit_weekly),
                deposit_limit_monthly: limits.deposit_limit_monthly === '' ? null : Number(limits.deposit_limit_monthly),
                ...extra,
            });
            toast.success('Responsible gambling settings saved.', { title: 'Limits' });
        } catch (err) {
            toast.error(err.message ?? 'Could not save limits.');
        } finally {
            setBusy(false);
            setConfirmExclude(false);
        }
    };

    const fields = [
        ['deposit_limit_daily', 'Daily deposit limit'],
        ['deposit_limit_weekly', 'Weekly deposit limit'],
        ['deposit_limit_monthly', 'Monthly deposit limit'],
    ];

    return (
        <div className="card p-5">
            <h3 className="font-heading text-lg font-bold text-slate-950 dark:text-white">Responsible Gambling</h3>
            <p className="mt-1 text-sm text-slate-500">Set deposit limits or take a break. Limits apply immediately.</p>

            {excludedUntil && new Date(excludedUntil) > new Date() && (
                <p className="mt-3 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm text-slate-700 dark:text-slate-300">
                    Your account is self-excluded until <strong>{new Date(excludedUntil).toLocaleDateString()}</strong>.
                </p>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {fields.map(([key, label]) => (
                    <label key={key} className="block">
                        <span className="field-label">{label}</span>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                                type="number"
                                min="1"
                                placeholder="No limit"
                                value={limits[key]}
                                onChange={(e) => setLimits((c) => ({ ...c, [key]: e.target.value }))}
                                className="input pl-7"
                            />
                        </div>
                    </label>
                ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" disabled={busy} onClick={() => save()} className="btn-primary px-5 py-2.5 text-xs uppercase tracking-wider">
                    {busy ? 'Saving…' : 'Save Limits'}
                </button>
                {!confirmExclude ? (
                    <button type="button" onClick={() => setConfirmExclude(true)} className="btn-outline !border-neon-red/40 !text-neon-red px-5 py-2.5 text-xs uppercase tracking-wider">
                        Self-Exclude 30 Days
                    </button>
                ) : (
                    <span className="flex items-center gap-2">
                        <span className="text-xs font-medium text-neon-red">Sign out everywhere and block deposits for 30 days?</span>
                        <button type="button" disabled={busy} onClick={() => save({ self_exclude_days: 30 })} className="btn-danger px-4 py-2 text-xs uppercase tracking-wider">Confirm</button>
                        <button type="button" onClick={() => setConfirmExclude(false)} className="btn-ghost px-3 py-2 text-xs uppercase tracking-wider">Cancel</button>
                    </span>
                )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Need help? Visit <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-d underline-offset-2 hover:underline dark:text-purple-l">BeGambleAware.org</a> for free, confidential support.
            </p>
        </div>
    );
}
