import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API = `${import.meta.env.VITE_API_BASE || ''}/api`;

// ── SVG Icons ────────────────────────────────────────────────────────────────
const TicketIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const PlusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const BackIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SearchIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SendIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const RefreshIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;

const STATUS_COLORS = {
    open: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    in_progress: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    closed: 'bg-slate-100 text-slate-600 dark:bg-white/[.06] dark:text-slate-400',
};
const PRIORITY_COLORS = {
    low: 'bg-slate-100 text-slate-600 dark:bg-white/[.06] dark:text-slate-400',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export default function SupportPage() {
    const { user } = useAuth();
    const [view, setView] = useState('list'); // list | new | detail
    // If user is authenticated, use their email directly
    const [email, setEmail] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('support_email') || '';
        }
        return '';
    });
    const [emailInput, setEmailInput] = useState('');
    const [tickets, setTickets] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [replyText, setReplyText] = useState('');
    const [form, setForm] = useState({ name: '', email: '', subject: '', description: '', category: 'general', priority: 'medium' });

    // Auto-set email from authenticated user
    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
            localStorage.setItem('support_email', user.email);
            setForm(f => ({ ...f, name: f.name || user.name || '', email: user.email }));
        }
    }, [user]);

    useEffect(() => { if (email) fetchTickets(); }, [email]);

    async function fetchTickets() {
        if (!email) return;
        setLoading(true);
        try {
            const r = await fetch(`${API}/tickets?email=${encodeURIComponent(email)}`, { headers: { 'Accept': 'application/json' } });
            const d = await r.json();
            setTickets(d.tickets || []);
        } catch { setError('Failed to load tickets'); }
        setLoading(false);
    }

    async function loadTicket(number) {
        setLoading(true);
        try {
            const r = await fetch(`${API}/tickets/${number}?email=${encodeURIComponent(email)}`, { headers: { 'Accept': 'application/json' } });
            const d = await r.json();
            setSelected(d.ticket);
            setView('detail');
        } catch { setError('Failed to load ticket'); }
        setLoading(false);
    }

    async function submitTicket(e) {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const r = await fetch(`${API}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(form),
            });
            const d = await r.json();
            if (!r.ok) { setError(Object.values(d.errors || {})[0]?.[0] || 'Error'); setLoading(false); return; }
            setSuccess(d.message);
            localStorage.setItem('support_email', form.email);
            setEmail(form.email);
            setForm({ name: '', email: '', subject: '', description: '', category: 'general', priority: 'medium' });
            setTimeout(() => { setSuccess(''); setView('list'); }, 3000);
        } catch { setError('Submission failed'); }
        setLoading(false);
    }

    async function submitReply(e) {
        e.preventDefault();
        if (!replyText.trim()) return;
        setLoading(true);
        try {
            await fetch(`${API}/tickets/${selected.ticket_number}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, message: replyText }),
            });
            setReplyText('');
            await loadTicket(selected.ticket_number);
        } catch { setError('Failed to send reply'); }
        setLoading(false);
    }

    const enterEmail = (e) => {
        e.preventDefault();
        if (!emailInput.includes('@')) return;
        localStorage.setItem('support_email', emailInput);
        setEmail(emailInput);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-ink pt-4 pb-16">
            <div className="max-w-3xl mx-auto px-4">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                            <TicketIcon />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Support Center</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">We're here to help</p>
                        </div>
                    </div>
                    {view !== 'new' && (
                        <button onClick={() => setView('new')}
                            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors">
                            <PlusIcon /> New Ticket
                        </button>
                    )}
                </div>

                {/* Alerts */}
                {success && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm">{success}</div>}
                {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">{error}<button className="ml-2 underline" onClick={() => setError('')}>Dismiss</button></div>}

                {/* New Ticket Form */}
                {view === 'new' && (
                    <div className="bg-white dark:bg-ink-2 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <button onClick={() => setView('list')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500"><BackIcon /></button>
                            <h2 className="font-semibold text-slate-900 dark:text-white">Submit a Support Request</h2>
                        </div>
                        <form onSubmit={submitTicket} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
                                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/[.06] dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                        placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email *</label>
                                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/[.06] dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                        placeholder="john@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Subject *</label>
                                <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/[.06] dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                    placeholder="Brief description of your issue" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/[.06] dark:text-white focus:ring-2 focus:ring-violet-500 outline-none">
                                        <option value="general">General</option>
                                        <option value="technical">Technical</option>
                                        <option value="billing">Billing</option>
                                        <option value="account">Account</option>
                                        <option value="bonus">Bonus</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                                    <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/[.06] dark:text-white focus:ring-2 focus:ring-violet-500 outline-none">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description *</label>
                                <textarea required rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/[.06] dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                                    placeholder="Please describe your issue in detail..." />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setView('list')}
                                    className="flex-1 py-2.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-white/10">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <SendIcon />}
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Ticket List */}
                {view === 'list' && (
                    <div>
                        {!email ? (
                            <div className="bg-white dark:bg-ink-2 rounded-2xl border border-slate-200 dark:border-white/10 p-8 text-center">
                                <svg className="w-12 h-12 text-violet-300 dark:text-violet-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">View your tickets</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Enter your email to view existing tickets</p>
                                <form onSubmit={enterEmail} className="flex gap-2 max-w-sm mx-auto">
                                    <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                                        className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-white/[.06] dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                        placeholder="your@email.com" />
                                    <button type="submit" className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg">
                                        <SearchIcon />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-ink-2 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                                <div className="px-5 py-3 border-b border-slate-100 dark:border-white/[.07] flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Tickets for <span className="text-slate-900 dark:text-white">{email}</span>
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={fetchTickets} disabled={loading} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                            <RefreshIcon />
                                        </button>
                                        <button onClick={() => { setEmail(''); localStorage.removeItem('support_email'); }} className="text-xs text-slate-400 hover:text-red-500">Change email</button>
                                    </div>
                                </div>
                                {loading && <div className="flex justify-center py-8"><span className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>}
                                {!loading && tickets.length === 0 && (
                                    <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                                        No tickets found. <button className="text-violet-600 hover:underline" onClick={() => setView('new')}>Submit one now</button>
                                    </div>
                                )}
                                {tickets.map(t => (
                                    <button key={t.id} onClick={() => loadTicket(t.ticket_number)}
                                        className="w-full text-left px-5 py-4 border-b last:border-b-0 border-slate-100 dark:border-white/[.07] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono text-slate-400">{t.ticket_number}</span>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status] || 'bg-slate-100 text-slate-600'}`}>{t.status.replace('_', ' ')}</span>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[t.priority] || ''}`}>{t.priority}</span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{t.subject}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.replies_count} replies • {t.updated_at}</p>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Ticket Detail */}
                {view === 'detail' && selected && (
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-ink-2 rounded-2xl border border-slate-200 dark:border-white/10 p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <button onClick={() => setView('list')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500"><BackIcon /></button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-mono text-slate-400">{selected.ticket_number}</span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[selected.status]}`}>{selected.status.replace('_', ' ')}</span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[selected.priority]}`}>{selected.priority}</span>
                                        <span className="text-xs text-slate-400 capitalize">{selected.category}</span>
                                    </div>
                                    <h2 className="font-semibold text-slate-900 dark:text-white mt-0.5">{selected.subject}</h2>
                                </div>
                            </div>

                            {/* Original description */}
                            <div className="bg-slate-50 dark:bg-white/[.06]/50 rounded-xl p-4 mb-4">
                                <p className="text-xs text-slate-400 mb-1">Original request • {selected.created_at}</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selected.description}</p>
                            </div>

                            {/* Replies */}
                            <div className="space-y-3">
                                {selected.replies?.map((r, i) => (
                                    <div key={i} className={`rounded-xl p-4 ${r.is_staff ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800' : 'bg-slate-50 dark:bg-white/[.06]/50'}`}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            {r.is_staff ? (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-violet-700 dark:text-violet-300">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    {r.author}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{r.author}</span>
                                            )}
                                            <span className="text-xs text-slate-400">{r.created_at}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{r.message}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Reply form */}
                            {!['closed'].includes(selected.status) && (
                                <form onSubmit={submitReply} className="mt-4 space-y-3">
                                    <textarea required rows={3} value={replyText} onChange={e => setReplyText(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/[.06] dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                                        placeholder="Add a reply..." />
                                    <button type="submit" disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl">
                                        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <SendIcon />}
                                        Send Reply
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
