/* Stubs the browser globals the app touches during render, then bundles and
   runs the smoke render. Usage: node scripts/run-smoke.mjs */
import { build } from 'vite';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

function memoryStorage() {
    const map = new Map();
    return {
        getItem: (key) => (map.has(key) ? map.get(key) : null),
        setItem: (key, value) => map.set(key, String(value)),
        removeItem: (key) => map.delete(key),
        clear: () => map.clear(),
    };
}

const root = path.resolve(import.meta.dirname, '..');
const noop = () => { };

globalThis.localStorage = memoryStorage();
globalThis.sessionStorage = memoryStorage();
globalThis.matchMedia = () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop });
globalThis.document = {
    documentElement: { setAttribute: noop, getAttribute: () => 'dark', classList: { add: noop, remove: noop } },
    body: { style: {} },
    addEventListener: noop,
    removeEventListener: noop,
    createElement: () => ({ style: {}, setAttribute: noop, appendChild: noop }),
};
globalThis.window = {
    localStorage: globalThis.localStorage,
    sessionStorage: globalThis.sessionStorage,
    matchMedia: globalThis.matchMedia,
    addEventListener: noop,
    removeEventListener: noop,
    scrollTo: noop,
    document: globalThis.document,
    location: { href: 'http://localhost/', origin: 'http://localhost' },
    navigator: { userAgent: 'node' },
};
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = clearTimeout;

const outDir = path.join(root, 'node_modules', '.smoke');

await build({
    root,
    logLevel: 'error',
    mode: 'development',
    plugins: [{
        name: 'smoke-portal-stub',
        enforce: 'pre',
        resolveId(source) {
            if (/(^|[/\\])Portal(\.jsx)?$/.test(source)) return path.join(root, 'scripts', 'portal-stub.jsx');
            return null;
        },
    }],
    build: {
        minify: false,
        ssr: path.join(root, 'scripts', 'smoke.jsx'),
        outDir,
        emptyOutDir: true,
        rollupOptions: { output: { format: 'es' } },
    },
});

const { run } = await import(pathToFileURL(path.join(outDir, 'smoke.js')).href);
const failures = run();

if (failures.length) {
    console.error(`\n✗ ${failures.length} page(s) failed to render:\n`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}

console.log('\n✓ All pages and overlays rendered without errors.');
