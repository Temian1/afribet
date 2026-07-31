import { useSound } from '../contexts/SoundContext';
import { Volume, VolumeOff } from './Icons';

export default function SoundToggle() {
    const { muted, toggleMuted } = useSound();
    return (
        <button
            onClick={toggleMuted}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--pf-border)] bg-white text-slate-600 transition hover:border-cyan/50 hover:text-cyan dark:bg-white/[.04] dark:text-slate-300 dark:hover:text-cyan-l"
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            title={muted ? 'Sound off' : 'Sound on'}
            type="button"
        >
            {muted ? <VolumeOff size={18} /> : <Volume size={18} />}
        </button>
    );
}
