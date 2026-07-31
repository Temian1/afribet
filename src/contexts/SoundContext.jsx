import { createContext, useContext, useCallback, useState } from 'react';
import { playSound, setMuted as setMutedSvc, isMuted } from '../services/sound';

const SoundContext = createContext(null);
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }) {
    const [muted, setMuted] = useState(isMuted());

    const play = useCallback((name) => { playSound(name); }, []);

    const toggleMuted = useCallback(() => {
        setMuted(m => {
            const next = !m;
            setMutedSvc(next);
            if (!next) playSound('click');
            return next;
        });
    }, []);

    return (
        <SoundContext.Provider value={{ muted, toggleMuted, play }}>
            {children}
        </SoundContext.Provider>
    );
}
