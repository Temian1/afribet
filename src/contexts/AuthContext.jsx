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

function displayNameFromEmail(email) {
  const localPart = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return localPart
    ? localPart.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : 'Demo Player';
}

function createDemoUser({ name, email, provider = 'email' }) {
  const normalizedEmail = email.trim().toLowerCase();
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}`,
    name: name?.trim() || displayNameFromEmail(normalizedEmail),
    email: normalizedEmail,
    avatar: avatarUrl(normalizedEmail),
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

  const login = useCallback(async ({ email }) => {
    return saveUser(createDemoUser({ email }));
  }, [saveUser]);

  const register = useCallback(async ({ name, email }) => {
    return saveUser(createDemoUser({ name, email }));
  }, [saveUser]);

  const loginWithGoogle = useCallback(async () => {
    const suffix = Math.floor(Math.random() * 9000 + 1000);
    return saveUser(createDemoUser({
      name: `Demo Player ${suffix}`,
      email: `player${suffix}@demo.afribet`,
      provider: 'google',
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
    loginWithGoogle,
    requestReset,
    resetPassword,
    updateAvatar,
    updateProfile,
    logout,
  }), [login, loginWithGoogle, logout, register, requestReset, resetPassword, updateAvatar, updateProfile, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
