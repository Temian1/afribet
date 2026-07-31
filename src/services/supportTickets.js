// Frontend-only support desk. Tickets live in localStorage so the standalone
// build has a working help centre with no API behind it.

const KEY = 'afribet_support_tickets_v1';

export const CATEGORIES = [
    ['general', 'General question'],
    ['account', 'Account & verification'],
    ['deposits', 'Deposits'],
    ['withdrawals', 'Withdrawals'],
    ['bonus', 'Bonus & promotions'],
    ['betting', 'Bets & settlement'],
    ['technical', 'Technical issue'],
];

export const PRIORITIES = [
    ['low', 'Low'],
    ['medium', 'Medium'],
    ['high', 'High'],
    ['urgent', 'Urgent'],
];

export const FAQS = [
    { q: 'How long do withdrawals take?', a: 'Mobile money and bank transfers are reviewed within 15 minutes and usually land the same day. First withdrawals need a verified account.', category: 'withdrawals' },
    { q: 'Why was my bet voided?', a: 'Bets are voided when a fixture is abandoned, postponed by more than 24 hours, or when a market was priced in error. Voided stakes return to your balance in full.', category: 'betting' },
    { q: 'How do I verify my account?', a: 'Open Profile → Security and upload a government ID plus a proof of address. Verification usually completes within a couple of hours.', category: 'account' },
    { q: 'My deposit has not arrived', a: 'Deposits are normally instant. If it has been more than 10 minutes, open a ticket with the transaction reference and we will trace it.', category: 'deposits' },
    { q: 'How does the welcome bonus work?', a: 'Your first deposit is matched up to the advertised cap. The bonus must be rolled over at odds of 1.50 or higher before it can be withdrawn.', category: 'bonus' },
    { q: 'Can I set deposit limits?', a: 'Yes. Profile → Responsible gaming lets you set daily, weekly and monthly deposit caps, plus a cool-off period.', category: 'account' },
];

const AGENT_REPLIES = {
    withdrawals: 'Thanks for reaching out. I can see the payout queue on our side — withdrawals to mobile money settle within 15 minutes once the account is verified. I have flagged this ticket for the payments team.',
    deposits: 'Thanks for the details. Deposits are usually instant; I have asked our payments team to trace the transaction. Please keep the reference handy.',
    account: 'Thanks for getting in touch. I have escalated your verification to our KYC team — they review documents in the order received and will update this ticket.',
    bonus: 'Thanks for writing in. I have pulled up your bonus balance and rollover progress and will follow up here shortly with the exact remaining turnover.',
    betting: 'Thanks for flagging this. I am requesting the settlement log for the market in question and will post the result here.',
    technical: 'Sorry about the trouble. Could you tell me which device and browser you are on? Meanwhile I have logged this with our engineering team.',
    general: 'Thanks for contacting Afribet support. I have received your ticket and a specialist will follow up here shortly.',
};

function read() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
        return [];
    }
}

function write(tickets) {
    try {
        localStorage.setItem(KEY, JSON.stringify(tickets));
    } catch { /* storage unavailable — keep the in-memory result */ }
    return tickets;
}

function newId() {
    return globalThis.crypto?.randomUUID?.() ?? `t-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ticketNumber() {
    return `AFB-${String(Math.floor(Math.random() * 900000) + 100000)}`;
}

export function listTickets(email) {
    if (!email) return [];
    return read()
        .filter((ticket) => ticket.email.toLowerCase() === email.toLowerCase())
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function getTicket(id) {
    return read().find((ticket) => ticket.id === id) ?? null;
}

export function createTicket({ name, email, subject, description, category, priority }) {
    const now = new Date().toISOString();
    const ticket = {
        id: newId(),
        number: ticketNumber(),
        name,
        email,
        subject,
        description,
        category,
        priority,
        status: 'open',
        createdAt: now,
        updatedAt: now,
        replies: [
            {
                id: newId(),
                author: 'Amara — Afribet Support',
                staff: true,
                message: AGENT_REPLIES[category] ?? AGENT_REPLIES.general,
                createdAt: now,
            },
        ],
    };
    write([ticket, ...read()]);
    return ticket;
}

export function replyToTicket(id, message, authorName) {
    const now = new Date().toISOString();
    let updated = null;
    write(read().map((ticket) => {
        if (ticket.id !== id) return ticket;
        updated = {
            ...ticket,
            status: ticket.status === 'resolved' ? 'open' : ticket.status,
            updatedAt: now,
            replies: [...ticket.replies, { id: newId(), author: authorName || ticket.name, staff: false, message, createdAt: now }],
        };
        return updated;
    }));
    return updated;
}

export function closeTicket(id) {
    const now = new Date().toISOString();
    let updated = null;
    write(read().map((ticket) => {
        if (ticket.id !== id) return ticket;
        updated = { ...ticket, status: 'closed', updatedAt: now };
        return updated;
    }));
    return updated;
}

export function reopenTicket(id) {
    const now = new Date().toISOString();
    let updated = null;
    write(read().map((ticket) => {
        if (ticket.id !== id) return ticket;
        updated = { ...ticket, status: 'open', updatedAt: now };
        return updated;
    }));
    return updated;
}

export function formatWhen(iso) {
    const date = new Date(iso);
    const minutes = Math.round((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
