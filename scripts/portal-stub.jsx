// renderToString cannot render through createPortal, so the smoke build swaps
// the real Portal for a passthrough. The children are still fully rendered.
export default function Portal({ children }) {
    return children;
}
