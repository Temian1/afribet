import { useEffect, useRef, useState } from 'react';
import Portal from './Portal';
import { UiIcon } from './SportIcons';

const SEGMENTS = [
    { label: '10 Free Spins', color: '#39f5ad', text: '#03150e' },
    { label: '5% Cashback', color: '#12233f', text: '#ffffff' },
    { label: '₦500 Bonus', color: '#ffb400', text: '#241700' },
    { label: 'Try Again', color: '#12233f', text: '#ffffff' },
    { label: 'Free Bet', color: '#5aa9ff', text: '#04203f' },
    { label: '2x Odds Boost', color: '#12233f', text: '#ffffff' },
    { label: '₦1,000 Bonus', color: '#f472b6', text: '#33091f' },
    { label: 'Mystery Gift', color: '#12233f', text: '#ffffff' },
];

const SLICE = 360 / SEGMENTS.length;

/** Builds one pie slice path on a 100x100 viewBox centred at 50,50. */
function slicePath(index) {
    const start = (index * SLICE - 90) * (Math.PI / 180);
    const end = ((index + 1) * SLICE - 90) * (Math.PI / 180);
    const r = 48;
    const x1 = 50 + r * Math.cos(start);
    const y1 = 50 + r * Math.sin(start);
    const x2 = 50 + r * Math.cos(end);
    const y2 = 50 + r * Math.sin(end);
    return `M50 50 L${x1.toFixed(2)} ${y1.toFixed(2)} A48 48 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function WheelFace({ rotation, spinning, size = 'size-full' }) {
    return (
        <svg
            className={`${size} transition-transform ${spinning ? 'duration-[4200ms] ease-[cubic-bezier(.12,.72,.14,1)]' : 'duration-500'}`}
            style={{ transform: `rotate(${rotation}deg)` }}
            viewBox="0 0 100 100"
            aria-hidden="true"
        >
            {SEGMENTS.map((segment, index) => (
                <path d={slicePath(index)} fill={segment.color} stroke="#071226" strokeWidth="0.8" key={segment.label} />
            ))}
            <circle cx="50" cy="50" r="48" fill="none" stroke="#ffb400" strokeWidth="3" />
            <circle cx="50" cy="50" r="9" fill="#071226" stroke="#ffb400" strokeWidth="2.5" />
        </svg>
    );
}

export default function RewardWheel({ compact = false }) {
    const [open, setOpen] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (event) => event.key === 'Escape' && !spinning && setOpen(false);
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, spinning]);

    const spin = () => {
        if (spinning) return;
        const index = Math.floor(Math.random() * SEGMENTS.length);
        // Land the pointer (top, 0deg) in the middle of the winning slice.
        const target = 360 * 6 + (360 - (index * SLICE + SLICE / 2));
        setPrize(null);
        setSpinning(true);
        setRotation((current) => current - (current % 360) + target);
        timerRef.current = setTimeout(() => {
            setSpinning(false);
            setPrize(SEGMENTS[index]);
        }, 4300);
    };

    return (
        <>
            <button
                className={`group relative grid shrink-0 place-items-center rounded-full transition-transform active:scale-90 ${compact ? 'size-9' : 'size-[42px]'}`}
                onClick={() => setOpen(true)}
                type="button"
                aria-label="Open the rewards wheel"
            >
                <span className="absolute inset-0 overflow-hidden rounded-full shadow-[0_0_18px_rgba(255,180,0,.28)]">
                    <span className="block size-full animate-[reward-idle_9s_linear_infinite] group-hover:[animation-duration:2.5s]">
                        <WheelFace rotation={0} spinning={false} />
                    </span>
                </span>
                <span className="absolute -inset-1 -z-10 animate-ping rounded-full border border-amber-400/30 [animation-duration:2.6s]" aria-hidden="true" />
                <span className={`absolute -top-0.5 left-1/2 -translate-x-1/2 border-x-[4px] border-t-[6px] border-x-transparent border-t-amber-300 drop-shadow ${compact ? '' : 'border-x-[5px] border-t-[7px]'}`} aria-hidden="true" />
            </button>

            {open ? (
                <Portal>
                    <div className="fixed inset-0 z-[97] grid place-items-center px-4" role="dialog" aria-modal="true" aria-label="Rewards wheel">
                        <button className="app-drawer-backdrop absolute inset-0 border-0 bg-black/75 backdrop-blur-sm" onClick={() => !spinning && setOpen(false)} type="button" aria-label="Close rewards wheel" />

                        <div className="app-search-panel relative w-full max-w-sm overflow-hidden rounded-[18px] border border-slate-200 bg-white p-5 text-center text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#0a1424] dark:text-white">
                            <button className="absolute right-3 top-3 grid size-8 place-items-center rounded-full border-0 bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-90 dark:bg-[#122038] dark:text-white dark:hover:bg-[#1a2b48]" onClick={() => !spinning && setOpen(false)} type="button" aria-label="Close">
                                <UiIcon name="close" className="size-4" />
                            </button>

                            <h2 className="m-0 text-[18px] font-black">Daily reward wheel</h2>
                            <p className="m-0 mt-1 text-[12px] text-slate-500 dark:text-[#7ea9ec]">One free spin every 24 hours.</p>

                            <div className="relative mx-auto mt-5 size-[236px]">
                                <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 border-x-[9px] border-t-[14px] border-x-transparent border-t-amber-300 drop-shadow" aria-hidden="true" />
                                <WheelFace rotation={rotation} spinning={spinning} />
                            </div>

                            <div className="mt-4 min-h-[46px]">
                                {prize ? (
                                    <div className="animate-scale-in rounded-[12px] border border-[#39f5ad]/35 bg-[#39f5ad]/10 px-4 py-2.5">
                                        <span className="block text-[11px] uppercase tracking-wide text-slate-500 dark:text-[#7ea9ec]">You won</span>
                                        <b className="block text-[16px] text-[#0cb978] dark:text-[#39f5ad]">{prize.label}</b>
                                    </div>
                                ) : (
                                    <p className="m-0 pt-3 text-[12px] text-slate-500 dark:text-[#7ea9ec]">{spinning ? 'Spinning…' : 'Tap spin to try your luck.'}</p>
                                )}
                            </div>

                            <button
                                className="mt-3 h-[46px] w-full rounded-[12px] border-0 bg-[#0cb978] text-[14px] font-bold text-white transition hover:shadow-[0_0_28px_rgba(57,245,173,.35)] active:scale-95 disabled:opacity-60 dark:bg-[#39f5ad] dark:text-[#03150e]"
                                onClick={spin}
                                disabled={spinning}
                                type="button"
                            >
                                {spinning ? 'Good luck…' : prize ? 'Spin again' : 'Spin now'}
                            </button>
                        </div>
                    </div>
                </Portal>
            ) : null}
        </>
    );
}
