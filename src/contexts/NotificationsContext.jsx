import { createContext, useContext, useState, useCallback } from 'react';

const NotificationsContext = createContext(null);
export const useNotifications = () => useContext(NotificationsContext);

const SEED = [
    { id: 1, type: 'promo', title: 'Welcome Bonus', body: 'Claim your 200% deposit match up to $1,000.', time: '2m ago', read: false },
    { id: 2, type: 'win', title: 'Big Win!', body: 'You hit 12.4× on Crash — +$248.00 added to your balance.', time: '1h ago', read: false },
    { id: 3, type: 'system', title: 'New Game Live', body: 'Neon Plinko is now available in the Casino.', time: '5h ago', read: true },
    { id: 4, type: 'sports', title: 'Bet Settled', body: 'Man City vs Arsenal — your parlay won $64.20.', time: 'Yesterday', read: true },
];

export function NotificationsProvider({ children }) {
    const [items, setItems] = useState(SEED);
    const [idc, setIdc] = useState(100);

    const unread = items.filter(i => !i.read).length;

    const push = useCallback((n) => {
        setItems(list => [{ id: idc, time: 'Just now', read: false, type: 'system', ...n }, ...list]);
        setIdc(c => c + 1);
    }, [idc]);

    const markAllRead = useCallback(() => setItems(list => list.map(i => ({ ...i, read: true }))), []);
    const markRead = useCallback((id) => setItems(list => list.map(i => (i.id === id ? { ...i, read: true } : i))), []);
    const clearAll = useCallback(() => setItems([]), []);

    return (
        <NotificationsContext.Provider value={{ items, unread, push, markAllRead, markRead, clearAll }}>
            {children}
        </NotificationsContext.Provider>
    );
}
