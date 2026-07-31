import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi, userApi } from "../services/authApi";
import { setToken, clearToken, getToken } from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// DiceBear avatars (fallback / display only)
export const avatarUrl = (seed, style = "bottts-neutral") =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=8b5cf6,f59e0b,06b6d4,10b981,ef4444`;

export const AVATAR_STYLES = [
  "bottts-neutral", "adventurer", "avataaars", "fun-emoji",
  "thumbs", "lorelei", "notionists", "pixel-art",
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: rehydrate from token
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then((data) => setUser(data.user ?? data))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ name, email, password, referral_code }) => {
    const data = await authApi.register({ name, email, password, password_confirmation: password, referral_code });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // Google OAuth: redirect or popup - backend handles via token
  const loginWithGoogle = useCallback(async () => {
    // For now fall back to simulated until Google OAuth endpoint is added
    const rand = Math.floor(Math.random() * 9000 + 1000);
    const email = `player${rand}@gmail.com`;
    const name = `Player ${rand}`;
    try {
      const data = await authApi.register({ name, email, password: `google_${rand}`, password_confirmation: `google_${rand}` });
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch {
      const data = await authApi.login({ email, password: `google_${rand}` });
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearToken();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async ({ name, avatar }) => {
    const data = await userApi.updateProfile({ name, avatar });
    setUser((u) => ({ ...u, ...data.user }));
    return data.user;
  }, []);

  const updateAvatar = useCallback(async (avatar) => {
    return updateProfile({ avatar });
  }, [updateProfile]);

  // Unused but kept for compatibility
  const requestReset = useCallback(async ({ email }) => {
    // TODO: wire to password reset endpoint
    return true;
  }, []);
  const resetPassword = useCallback(async () => true, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, loginWithGoogle,
      requestReset, resetPassword, updateAvatar, updateProfile, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
