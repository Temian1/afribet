/**
 * The Afribet wordmark — "afri" in the foreground colour, "bet" in the accent.
 * Used by the header, drawer, auth modal and footer so the mark stays identical
 * everywhere. Renders a button when `onClick` is given, otherwise plain text.
 */
const SIZES = {
    sm: 'text-[20px]',
    md: 'text-[22px]',
    lg: 'text-[28px]',
    xl: 'text-[34px]',
};

export default function Brand({ size = 'md', onClick, className = '' }) {
    const type = SIZES[size] ?? SIZES.md;
    const content = (
        <>
            <span className={`font-display font-black italic leading-none tracking-[-1px] text-[var(--pf-text)] ${type}`}>afri</span>
            <span className={`font-display font-black italic leading-none tracking-[-1px] text-[var(--pf-accent)] ${type}`}>bet</span>
        </>
    );

    if (!onClick) {
        return <span className={`inline-flex shrink-0 items-baseline ${className}`}>{content}</span>;
    }

    return (
        <button
            className={`inline-flex shrink-0 items-baseline border-0 bg-transparent p-0 transition hover:opacity-80 active:scale-95 ${className}`}
            onClick={onClick}
            type="button"
            aria-label="Go to Afribet home"
        >
            {content}
        </button>
    );
}
