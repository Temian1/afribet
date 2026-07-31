import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const BetSlipContext = createContext(null);
export const useBetSlip = () => useContext(BetSlipContext);

const STORAGE_KEY = 'nb_betslip';

/**
 * Holds the user's pending selections. A selection:
 * { marketId, eventId, eventName, league, marketType, label, selection, odds }
 */
export function BetSlipProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
    }, [items]);

    /* Toggle a selection: clicking the same odds removes it; picking another
       selection from the same event replaces it (one leg per event). */
    const toggle = useCallback((selection) => {
        setOpen(true);
        setItems((prev) => {
            if (prev.some((i) => i.marketId === selection.marketId)) {
                return prev.filter((i) => i.marketId !== selection.marketId);
            }
            const next = prev.filter((i) => i.eventId !== selection.eventId);
            if (next.length !== prev.length) {
                // replaced a selection from the same event
                return [...next, selection];
            }
            return [...prev, selection];
        });
    }, []);

    const remove = useCallback((marketId) => {
        setItems((prev) => prev.filter((i) => i.marketId !== marketId));
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const has = useCallback((marketId) => items.some((i) => i.marketId === marketId), [items]);

    const value = useMemo(() => ({ items, toggle, remove, clear, has, open, setOpen }),
        [items, toggle, remove, clear, has, open]);

    return <BetSlipContext.Provider value={value}>{children}</BetSlipContext.Provider>;
}
