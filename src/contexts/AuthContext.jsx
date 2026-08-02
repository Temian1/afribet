import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const SESSION_KEY = 'afribet_demo_session_v1';

export const avatarUrl = (seed, style = 'bottts-neutral') =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=8b5cf6,f59e0b,06b6d4,10b981,ef4444`;

export const AVATAR_STYLES = [
  'bottts-neutral', 'adventurer', 'avataaars', 'fun-emoji',
  'thumbs', 'lorelei', 'notionists', 'pixel-art',
];

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

/** Accounts are keyed by phone number or username — never email. */
export function isPhone(identifier = '') {
  return /^\+?[0-9][0-9\s-]{7,}$/.test(identifier.trim());
}

export function normalizeIdentifier(identifier = '') {
  const trimmed = identifier.trim();
  return isPhone(trimmed) ? trimmed.replace(/[\s-]/g, '') : trimmed.toLowerCase();
}

function displayNameFrom(identifier) {
  if (isPhone(identifier)) return `Player ${identifier.slice(-4)}`;
  const readable = identifier.replace(/[._-]+/g, ' ').trim();
  return readable ? readable.replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Demo Player';
}

function createDemoUser({ name, identifier, provider = 'password' }) {
  const accountId = normalizeIdentifier(identifier);
  const phone = isPhone(accountId);
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}`,
    name: name?.trim() || displayNameFrom(accountId),
    accountId,
    username: phone ? null : accountId,
    phone: phone ? accountId : null,
    avatar: avatarUrl(accountId),
    provider,
    is_demo: true,
    created_at: new Date().toISOString(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const saveUser = useCallback((nextUser) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const login = useCallback(async ({ identifier }) => {
    if (!identifier?.trim()) throw new Error('Enter your phone number or username.');
    return saveUser(createDemoUser({ identifier }));
  }, [saveUser]);

  const register = useCallback(async ({ name, identifier }) => {
    if (!identifier?.trim()) throw new Error('Enter a phone number or username.');
    return saveUser(createDemoUser({ name, identifier }));
  }, [saveUser]);

  const loginWithTelegram = useCallback(async () => {
    const suffix = Math.floor(Math.random() * 9000 + 1000);
    return saveUser(createDemoUser({
      name: `Telegram Player ${suffix}`,
      identifier: `tg_player${suffix}`,
      provider: 'telegram',
    }));
  }, [saveUser]);

  const logout = useCallback(async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async ({ name, avatar }) => {
    if (!user) throw new Error('Sign in to update your profile.');
    return saveUser({
      ...user,
      ...(name?.trim() ? { name: name.trim() } : {}),
      ...(avatar ? { avatar } : {}),
    });
  }, [saveUser, user]);

  const updateAvatar = useCallback((avatar) => updateProfile({ avatar }), [updateProfile]);
  const requestReset = useCallback(async () => true, []);
  const resetPassword = useCallback(async () => true, []);

  const value = useMemo(() => ({
    user,
    loading: false,
    isDemo: true,
    login,
    register,
    loginWithTelegram,
    requestReset,
    resetPassword,
    updateAvatar,
    updateProfile,
    logout,
  }), [login, loginWithTelegram, logout, register, requestReset, resetPassword, updateAvatar, updateProfile, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
