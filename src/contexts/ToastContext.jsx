import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

const ICONS = {
    success: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    ),
    error: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
        </svg>
    ),
    info: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
    ),
    warning: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" />
        </svg>
    ),
};

const TONE = {
    success: 'text-neon-green-l border-neon-green/40 shadow-[0_0_24px_rgba(16,185,129,.25)]',
    error: 'text-neon-red border-neon-red/40 shadow-[0_0_24px_rgba(239,68,68,.25)]',
    info: 'text-cyan-l border-cyan/40 shadow-[0_0_24px_rgba(6,182,212,.25)]',
    warning: 'text-gold-l border-gold/40 shadow-[0_0_24px_rgba(245,158,11,.25)]',
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts(list => list.map(t => (t.id === id ? { ...t, leaving: true } : t)));
        setTimeout(() => setToasts(list => list.filter(t => t.id !== id)), 300);
    }, []);

    const toast = useCallback((message, type = 'info', opts = {}) => {
        const id = ++idRef.current;
        const duration = opts.duration ?? 4000;
        setToasts(list => [...list, { id, message, type, title: opts.title }]);
        if (duration > 0) setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    const api = {
        toast,
        success: (m, o) => toast(m, 'success', o),
        error: (m, o) => toast(m, 'error', o),
        info: (m, o) => toast(m, 'info', o),
        warning: (m, o) => toast(m, 'warning', o),
        dismiss,
    };

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div className="pointer-events-none fixed right-4 top-[80px] z-[2000] flex w-[min(360px,calc(100vw-32px))] flex-col gap-3">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto relative flex items-start gap-3 rounded-xl border bg-white/95 p-3.5 pr-9 shadow-xl backdrop-blur-xl transition dark:bg-ink-2/95 ${t.leaving ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'} ${TONE[t.type]}`}
                    >
                        <span className="mt-0.5 shrink-0">{ICONS[t.type]}</span>
                        <div className="min-w-0 flex-1">
                            {t.title && <p className="font-heading text-sm font-bold tracking-wide text-slate-900 dark:text-slate-100">{t.title}</p>}
                            <p className="break-words text-sm leading-snug text-slate-600 dark:text-slate-400">{t.message}</p>
                        </div>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="absolute right-2.5 top-2.5 text-slate-400 transition hover:text-slate-900 dark:hover:text-white"
                            aria-label="Dismiss notification"
                            type="button"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
