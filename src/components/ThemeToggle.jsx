import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from './Icons';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const dark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-gold/50 hover:text-gold dark:border-white/10 dark:bg-white/[.04] dark:text-slate-300"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
            type="button"
        >
            {dark ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}
