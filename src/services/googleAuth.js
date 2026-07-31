// Real Google Sign-In via Google Identity Services (GIS).
// Set VITE_GOOGLE_CLIENT_ID in your .env to enable it; otherwise the app
// falls back to a simulated session (see AuthContext.loginWithGoogle).

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GSI_SRC = 'https://accounts.google.com/gsi/client';

export const googleEnabled = () => Boolean(CLIENT_ID);

let scriptPromise = null;
function loadScript() {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = GSI_SRC;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load Google Identity Services.'));
        document.head.appendChild(s);
    });
    return scriptPromise;
}

function decodeJwt(token) {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(json);
}

// Resolves with a profile { name, email, avatar } from a real Google account.
export function signInWithGoogle() {
    if (!CLIENT_ID) return Promise.reject(new Error('Google client ID not configured.'));
    return loadScript().then(() => new Promise((resolve, reject) => {
        const { google } = window;
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: (response) => {
                try {
                    const p = decodeJwt(response.credential);
                    resolve({ name: p.name, email: p.email, avatar: p.picture });
                } catch (e) {
                    reject(e);
                }
            },
        });
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
                reject(new Error('Google sign-in was dismissed.'));
            }
        });
    }));
}
