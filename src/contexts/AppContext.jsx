import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { walletApi } from "../services/authApi";
import { getToken } from "../services/api";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const PAGE_KEY = "nb_last_page";
const GAME_KEY = "nb_current_game";
const VALID_PAGES = new Set(["home", "sports", "casino", "game", "promotions", "vip", "legal", "wallet", "referral", "support", "profile", "mybets"]);

export function AppProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txMeta, setTxMeta] = useState(null);
  const [referralCode, setReferralCode] = useState("NEON------");
  const [referralStats, setReferralStats] = useState({ count: 0, earned: 0, pending: 0 });
  const [walletLoading, setWalletLoading] = useState(false);
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem(PAGE_KEY);
    return VALID_PAGES.has(saved) ? saved : "home";
  });
  const [currentGame, setCurrentGame] = useState(() => localStorage.getItem(GAME_KEY));

  const loadWallet = useCallback(async () => {
    if (!getToken()) return;
    setWalletLoading(true);
    try {
      const data = await walletApi.getSummary();
      setBalance(parseFloat(data.balance ?? 0));
      if (data.referral_code) setReferralCode(data.referral_code);
      if (data.referral_stats) setReferralStats(data.referral_stats);
    } catch { /* not logged in */ } finally {
      setWalletLoading(false);
    }
  }, []);

  const loadTransactions = useCallback(async (p = 1) => {
    if (!getToken()) return;
    try {
      const data = await walletApi.getTransactions(p);
      const list = data.data ?? data;
      if (p === 1) {
        setTransactions(list);
      } else {
        setTransactions((prev) => [...prev, ...list]);
      }
      if (data.meta) setTxMeta(data.meta);
      setTxPage(p);
    } catch { /* ignore */ }
  }, []);

  // Reload wallet when token changes (login/logout)
  useEffect(() => {
    loadWallet();
    loadTransactions(1);
  }, [loadWallet, loadTransactions]);

  useEffect(() => {
    localStorage.setItem(PAGE_KEY, page);
  }, [page]);

  useEffect(() => {
    if (currentGame) {
      localStorage.setItem(GAME_KEY, currentGame);
    } else {
      localStorage.removeItem(GAME_KEY);
    }
  }, [currentGame]);

  const updateBalance = useCallback((amount) => {
    setBalance((prev) => Math.max(0, parseFloat((prev + amount).toFixed(2))));
  }, []);

  const addTransaction = useCallback((tx) => {
    setTransactions((list) => [{ id: Date.now(), time: "Just now", ...tx }, ...list].slice(0, 50));
  }, []);

  const deposit = useCallback(async (amount, method = "Card") => {
    const data = await walletApi.deposit({ amount, method });
    await loadWallet();
    await loadTransactions(1);
    return data;
  }, [loadWallet, loadTransactions]);

  const withdraw = useCallback(async (amount, method = "Bank", destination = "") => {
    const data = await walletApi.withdraw({ amount, method, destination });
    await loadWallet();
    await loadTransactions(1);
    return data;
  }, [loadWallet, loadTransactions]);

  return (
    <AppContext.Provider value={{
      balance, setBalance, updateBalance,
      transactions, addTransaction,
      txPage, txMeta, loadTransactions,
      deposit, withdraw,
      walletLoading, loadWallet,
      referral: referralCode,
      referrals: referralStats,
      page, setPage,
      currentGame, setCurrentGame,
    }}>
      {children}
    </AppContext.Provider>
  );
}
