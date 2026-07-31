import { createPortal } from 'react-dom';

// Renders children into document.body so fixed-position modals aren't trapped
// by ancestors that establish a containing block (e.g. the backdrop-blur navbar).
export default function Portal({ children }) {
    if (typeof document === 'undefined') return null;
    return createPortal(children, document.body);
}
