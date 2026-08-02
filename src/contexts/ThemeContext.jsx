import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

const THEME_KEY = 'nb_theme';
const isTheme = (value) => value === 'light' || value === 'dark';

function readTheme() {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        return isTheme(saved) ? saved : 'dark';
    } catch {
        return 'dark';
    }
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(readTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.style.colorScheme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#02110b' : '#f2f6fb');
        try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
    }, [theme]);

    useEffect(() => {
        const syncTheme = (event) => {
            if (event.key === THEME_KEY && isTheme(event.newValue)) setTheme(event.newValue);
        };
        window.addEventListener('storage', syncTheme);
        return () => window.removeEventListener('storage', syncTheme);
    }, []);

    const toggleTheme = useCallback(() => setTheme((current) => (current === 'dark' ? 'light' : 'dark')), []);
    const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
