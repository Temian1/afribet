import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useApp } from '../contexts/AppContext';
import { UiIcon } from '../components/SportIcons';
import {
    CATEGORIES, FAQS, PRIORITIES, closeTicket, createTicket, formatWhen,
    listTickets, reopenTicket, replyToTicket,
} from '../services/supportTickets';

const EMAIL_KEY = 'afribet_support_email';

const STATUS_TONE = {
    open: 'bg-[var(--pf-accent-soft)] text-[var(--pf-accent)] border-[var(--pf-accent)]/35',
    closed: 'bg-[var(--pf-danger-soft)] text-[var(--pf-danger)] border-[#ff8fa3]/30',
    resolved: 'bg-[var(--pf-panel)] text-[var(--pf-muted)] border-[var(--pf-border)]',
};

const PRIORITY_TONE = {
    low: 'bg-[var(--pf-panel)] text-[var(--pf-muted)]',
    medium: 'bg-[var(--pf-panel)] text-[var(--pf-muted)]',
    high: 'bg-[var(--pf-warn-soft)] text-[#ffb400]',
    urgent: 'bg-[var(--pf-danger-soft)] text-[var(--pf-danger)]',
};

const CHANNELS = [
    { icon: 'live', title: 'Live chat', detail: 'Average wait under 2 minutes', meta: '24/7' },
    { icon: 'results', title: 'Email us', detail: 'support@afribet.com', meta: 'Replies in ~2h' },
    { icon: 'signal', title: 'Call centre', detail: '+234 700 AFRIBET', meta: '08:00 – 23:00' },
];

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--pf-muted)]">{label}</span>
            {children}
        </label>
    );
}

const inputClass = 'w-full rounded-[10px] border border-[var(--pf-border)] bg-[var(--pf-input)] px-3 py-2.5 text-[14px] text-white outline-none transition placeholder:text-[var(--pf-faint)] focus:border-[var(--pf-accent)] focus:ring-2 focus:ring-[var(--pf-accent)]/25';

function StatusPill({ status }) {
    return <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_TONE[status] ?? STATUS_TONE.open}`}>{status}</span>;
}

function FaqList() {
    const [open, setOpen] = useState(null);
    return (
        <div className="space-y-2">
            {FAQS.map((faq, index) => {
                const expanded = open === index;
                return (
                    <div className="animate-fade-up overflow-hidden rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-surface)] transition hover:border-[var(--pf-accent)]/25" style={{ animationDelay: `${index * 40}ms` }} key={faq.q}>
                        <button
                            className="flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3.5 text-left text-[13px] font-bold text-[var(--pf-text)]"
                            onClick={() => setOpen(expanded ? null : index)}
                            type="button"
                            aria-expanded={expanded}
                        >
                            <span className="min-w-0 flex-1">{faq.q}</span>
                            <UiIcon name="chevronDown" className={`size-4 shrink-0 text-[var(--pf-muted)] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`grid transition-all duration-300 ease-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden"><p className="m-0 px-4 pb-4 text-[13px] leading-relaxed text-[var(--pf-muted)]">{faq.a}</p></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function Support() {
    const { user } = useAuth();
    const { setPage } = useApp();
    const toast = useToast();

    const [email, setEmail] = useState(() => {
        try { return user?.accountId || localStorage.getItem(EMAIL_KEY) || ''; } catch { return user?.accountId || ''; }
    });
    const [emailInput, setEmailInput] = useState('');
    const [view, setView] = useState('list');
    const [tickets, setTickets] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [reply, setReply] = useState('');
    const [form, setForm] = useState({ name: '', email: '', subject: '', description: '', category: 'general', priority: 'medium' });

    useEffect(() => {
        if (!user?.accountId) return;
        setEmail(user.accountId);
        try { localStorage.setItem(EMAIL_KEY, user.accountId); } catch { /* ignore */ }
        setForm((current) => ({ ...current, name: current.name || user.name || '', email: user.accountId }));
    }, [user]);

    useEffect(() => { setTickets(listTickets(email)); }, [email]);

    const selected = useMemo(() => tickets.find((ticket) => ticket.id === selectedId) ?? null, [tickets, selectedId]);
    const openCount = tickets.filter((ticket) => ticket.status === 'open').length;

    const refresh = (nextEmail = email) => setTickets(listTickets(nextEmail));

    const submitTicket = (fromEvent) => {
        fromEvent.preventDefault();
        const created = createTicket(form);
        try { localStorage.setItem(EMAIL_KEY, form.email); } catch { /* ignore */ }
        setEmail(form.email);
        refresh(form.email);
        setForm((current) => ({ ...current, subject: '', description: '', category: 'general', priority: 'medium' }));
        setSelectedId(created.id);
        setView('detail');
        toast?.success?.(`Ticket ${created.number} created`, { title: 'Support' });
    };

    const submitReply = (fromEvent) => {
        fromEvent.preventDefault();
        if (!reply.trim()) return;
        replyToTicket(selected.id, reply.trim(), user?.name || selected.name);
        setReply('');
        refresh();
        toast?.success?.('Reply sent', { title: 'Support' });
    };

    const identify = (fromEvent) => {
        fromEvent.preventDefault();
        if (!emailInput.trim()) return;
        try { localStorage.setItem(EMAIL_KEY, emailInput); } catch { /* ignore */ }
        setEmail(emailInput);
    };

    return (
        <div className="min-h-screen bg-[var(--pf-bg)] pb-12 text-[var(--pf-text)]">
            <header className="relative overflow-hidden border-b border-[var(--pf-border)] bg-gradient-to-b from-[var(--pf-header-from)] to-[var(--pf-header-to)] px-4 py-7 sm:px-6">
                <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[var(--pf-accent)]/10 blur-[80px]" aria-hidden="true" />
                <div className="relative mx-auto max-w-4xl">
                    <div className="flex items-center gap-3">
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--pf-panel)] text-[var(--pf-accent)] shadow-[0_0_28px_rgba(57,245,173,.15)]"><UiIcon name="headset" className="size-6" /></span>
                        <div className="min-w-0">
                            <h1 className="m-0 text-[22px] font-black tracking-tight sm:text-[26px]">Support centre</h1>
                            <p className="m-0 text-[13px] text-[var(--pf-muted)]">Real answers, fast — 24 hours a day.</p>
                        </div>
                        {openCount > 0 ? <span className="ml-auto hidden animate-scale-in rounded-full border border-[var(--pf-accent)]/35 bg-[var(--pf-accent-soft)] px-3 py-1.5 text-[11px] font-bold text-[var(--pf-accent)] sm:block">{openCount} open</span> : null}
                    </div>

                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                        {CHANNELS.map((channel, index) => (
                            <div className="animate-fade-up flex items-center gap-3 rounded-[12px] border border-[var(--pf-border)] bg-[#071226]/80 p-3 transition hover:-translate-y-0.5 hover:border-[var(--pf-accent)]/30" style={{ animationDelay: `${index * 70}ms` }} key={channel.title}>
                                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name={channel.icon} className="size-5" /></span>
                                <div className="min-w-0">
                                    <b className="block truncate text-[13px]">{channel.title}</b>
                                    <span className="block truncate text-[11px] text-[var(--pf-muted)]">{channel.detail}</span>
                                </div>
                                <span className="ml-auto shrink-0 text-[10px] font-bold text-[var(--pf-accent)]">{channel.meta}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <nav className="no-scrollbar sticky top-[112px] z-20 -mx-4 flex gap-1.5 overflow-x-auto bg-[var(--pf-bg)]/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 xl:top-[115px]" aria-label="Support views">
                    {[['list', 'My tickets'], ['new', 'New ticket'], ['faq', 'FAQ']].map(([id, label]) => (
                        <button
                            className={`h-9 shrink-0 rounded-[18px] border-0 px-4 text-[12px] font-bold transition active:scale-95 ${view === id ? 'bg-[var(--pf-accent)] text-[var(--pf-accent-ink)] shadow-[0_0_20px_rgba(57,245,173,.25)]' : 'bg-[var(--pf-panel)] text-[var(--pf-text)] hover:bg-[var(--pf-hover)]'}`}
                            onClick={() => { setView(id); setSelectedId(null); }}
                            type="button"
                            aria-pressed={view === id}
                            key={id}
                        >
                            {label}
                        </button>
                    ))}
                    <button className="ml-auto hidden h-9 shrink-0 rounded-[18px] border-0 bg-[var(--pf-panel)] px-4 text-[12px] font-bold text-[var(--pf-text)] transition hover:bg-[var(--pf-hover)] sm:block" onClick={() => setPage('legal')} type="button">
                        Terms &amp; rules
                    </button>
                </nav>

                {view === 'faq' ? (
                    <section className="pb-6">
                        <h2 className="mb-3 mt-1 text-[16px] font-black">Frequently asked</h2>
                        <FaqList />
                        <div className="animate-fade-up mt-5 rounded-[12px] border border-[var(--pf-accent)]/25 bg-[var(--pf-card)] p-4 text-center">
                            <p className="m-0 text-[13px] text-[var(--pf-muted)]">Still stuck? Open a ticket and a specialist will pick it up.</p>
                            <button className="mt-3 h-[40px] rounded-[19px] border-0 bg-[var(--pf-accent)] px-5 text-[13px] font-bold text-[var(--pf-accent-ink)] transition hover:shadow-[0_0_24px_rgba(57,245,173,.3)] active:scale-95" onClick={() => setView('new')} type="button">
                                Contact support
                            </button>
                        </div>
                    </section>
                ) : null}

                {view === 'new' ? (
                    <form className="animate-fade-up mb-6 space-y-4 rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 sm:p-5" onSubmit={submitTicket}>
                        <h2 className="m-0 text-[16px] font-black">Open a ticket</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Full name">
                                <input className={inputClass} required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Ada Obi" />
                            </Field>
                            <Field label="Email or phone">
                                <input className={inputClass} required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com or 09xx xxx xxx" />
                            </Field>
                        </div>
                        <Field label="Subject">
                            <input className={inputClass} required value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} placeholder="Short summary of the issue" />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Category">
                                <select className={inputClass} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                                    {CATEGORIES.map(([id, label]) => <option value={id} key={id}>{label}</option>)}
                                </select>
                            </Field>
                            <Field label="Priority">
                                <select className={inputClass} value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}>
                                    {PRIORITIES.map(([id, label]) => <option value={id} key={id}>{label}</option>)}
                                </select>
                            </Field>
                        </div>
                        <Field label="Describe the issue">
                            <textarea className={`${inputClass} resize-none`} required rows={5} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Include any reference numbers, amounts and times…" />
                        </Field>
                        <div className="flex gap-3">
                            <button className="h-[44px] flex-1 rounded-[12px] border border-[var(--pf-border)] bg-transparent text-[14px] font-bold text-[var(--pf-text)] transition hover:bg-[var(--pf-panel)]" onClick={() => setView('list')} type="button">Cancel</button>
                            <button className="h-[44px] flex-1 rounded-[12px] border-0 bg-[var(--pf-accent)] text-[14px] font-bold text-[var(--pf-accent-ink)] transition hover:shadow-[0_0_24px_rgba(57,245,173,.3)] active:scale-95" type="submit">Submit ticket</button>
                        </div>
                    </form>
                ) : null}

                {view === 'list' ? (
                    <section className="pb-6">
                        {!email ? (
                            <form className="animate-fade-up rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-6 text-center" onSubmit={identify}>
                                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--pf-panel)] text-[var(--pf-accent)]"><UiIcon name="results" className="size-6" /></span>
                                <h2 className="mt-3 text-[16px] font-black">Find your tickets</h2>
                                <p className="mt-1 text-[13px] text-[var(--pf-muted)]">Enter the email or phone you used when contacting us.</p>
                                <div className="mx-auto mt-4 flex max-w-sm gap-2">
                                    <input className={inputClass} value={emailInput} onChange={(event) => setEmailInput(event.target.value)} placeholder="you@example.com or 09xx xxx xxx" />
                                    <button className="grid size-[46px] shrink-0 place-items-center rounded-[10px] border-0 bg-[var(--pf-accent)] text-[var(--pf-accent-ink)] transition active:scale-90" type="submit" aria-label="Find tickets"><UiIcon name="search" /></button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 py-1 text-[12px] text-[var(--pf-muted)]">
                                    <span className="min-w-0 truncate">Tickets for <b className="text-[var(--pf-text)]">{email}</b></span>
                                    <button className="ml-auto shrink-0 rounded-full bg-[var(--pf-panel)] px-3 py-1.5 text-[11px] font-bold text-[var(--pf-text)] transition hover:bg-[var(--pf-hover)]" onClick={() => { setEmail(''); setSelectedId(null); try { localStorage.removeItem(EMAIL_KEY); } catch { /* ignore */ } }} type="button">
                                        Change email
                                    </button>
                                </div>

                                {tickets.length === 0 ? (
                                    <div className="animate-fade-up mt-2 rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-surface)] py-12 text-center">
                                        <p className="m-0 text-[13px] text-[var(--pf-muted)]">No tickets yet.</p>
                                        <button className="mt-3 h-[40px] rounded-[19px] border-0 bg-[var(--pf-accent)] px-5 text-[13px] font-bold text-[var(--pf-accent-ink)] transition active:scale-95" onClick={() => setView('new')} type="button">Open your first ticket</button>
                                    </div>
                                ) : (
                                    <div className="mt-2 space-y-2">
                                        {tickets.map((ticket, index) => (
                                            <button
                                                className="animate-fade-up flex w-full items-start gap-3 rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--pf-accent)]/30 active:scale-[.99]"
                                                style={{ animationDelay: `${index * 45}ms` }}
                                                onClick={() => { setSelectedId(ticket.id); setView('detail'); }}
                                                type="button"
                                                key={ticket.id}
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="font-mono text-[11px] text-[var(--pf-faint)]">{ticket.number}</span>
                                                        <StatusPill status={ticket.status} />
                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_TONE[ticket.priority]}`}>{ticket.priority}</span>
                                                    </div>
                                                    <p className="m-0 mt-1.5 truncate text-[14px] font-bold">{ticket.subject}</p>
                                                    <p className="m-0 mt-0.5 text-[11px] text-[var(--pf-muted)]">{ticket.replies.length} replies • {formatWhen(ticket.updatedAt)}</p>
                                                </div>
                                                <UiIcon name="chevronRight" className="mt-1 size-4 shrink-0 text-[var(--pf-faint)]" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                ) : null}

                {view === 'detail' && selected ? (
                    <section className="animate-fade-up mb-6 rounded-[14px] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <button className="grid size-9 shrink-0 place-items-center rounded-[10px] border-0 bg-[var(--pf-panel)] text-[var(--pf-text)] transition hover:text-[var(--pf-accent)] active:scale-90" onClick={() => { setView('list'); setSelectedId(null); }} type="button" aria-label="Back to tickets">
                                <UiIcon name="chevronRight" className="size-5 rotate-180" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-mono text-[11px] text-[var(--pf-faint)]">{selected.number}</span>
                                    <StatusPill status={selected.status} />
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_TONE[selected.priority]}`}>{selected.priority}</span>
                                </div>
                                <h2 className="m-0 mt-1 text-[16px] font-black">{selected.subject}</h2>
                            </div>
                        </div>

                        <div className="mt-4 rounded-[12px] bg-[var(--pf-card)] p-4">
                            <p className="m-0 text-[11px] text-[var(--pf-faint)]">Original request • {formatWhen(selected.createdAt)}</p>
                            <p className="m-0 mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--pf-text)]">{selected.description}</p>
                        </div>

                        <div className="mt-3 space-y-2.5">
                            {selected.replies.map((entry, index) => (
                                <div
                                    className={`animate-fade-up rounded-[12px] p-4 ${entry.staff ? 'border border-[var(--pf-accent)]/25 bg-[var(--pf-accent-soft)]' : 'bg-[var(--pf-card)]'}`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    key={entry.id}
                                >
                                    <div className="flex items-center gap-2">
                                        {entry.staff ? <span className="text-[var(--pf-accent)]"><UiIcon name="starFilled" className="size-3.5" /></span> : null}
                                        <b className={`text-[12px] ${entry.staff ? 'text-[var(--pf-accent)]' : 'text-[var(--pf-text)]'}`}>{entry.author}</b>
                                        <span className="ml-auto text-[11px] text-[var(--pf-faint)]">{formatWhen(entry.createdAt)}</span>
                                    </div>
                                    <p className="m-0 mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--pf-text)]">{entry.message}</p>
                                </div>
                            ))}
                        </div>

                        {selected.status === 'closed' ? (
                            <div className="mt-4 flex items-center gap-3 rounded-[12px] border border-[var(--pf-border)] bg-[var(--pf-card)] p-4">
                                <p className="m-0 flex-1 text-[13px] text-[var(--pf-muted)]">This ticket is closed.</p>
                                <button className="h-[38px] shrink-0 rounded-[10px] border-0 bg-[var(--pf-accent)] px-4 text-[13px] font-bold text-[var(--pf-accent-ink)] transition active:scale-95" onClick={() => { reopenTicket(selected.id); refresh(); }} type="button">Reopen</button>
                            </div>
                        ) : (
                            <form className="mt-4 space-y-3" onSubmit={submitReply}>
                                <textarea className={`${inputClass} resize-none`} rows={3} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Add a reply…" />
                                <div className="flex gap-3">
                                    <button className="h-[42px] flex-1 rounded-[12px] border border-[var(--pf-border)] bg-transparent text-[13px] font-bold text-[var(--pf-text)] transition hover:bg-[var(--pf-panel)]" onClick={() => { closeTicket(selected.id); refresh(); }} type="button">Close ticket</button>
                                    <button className="h-[42px] flex-1 rounded-[12px] border-0 bg-[var(--pf-accent)] text-[13px] font-bold text-[var(--pf-accent-ink)] transition hover:shadow-[0_0_24px_rgba(57,245,173,.3)] active:scale-95" type="submit">Send reply</button>
                                </div>
                            </form>
                        )}
                    </section>
                ) : null}
            </div>
        </div>
    );
}
