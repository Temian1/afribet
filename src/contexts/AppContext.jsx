import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const PAGE_KEY = 'nb_last_page';
const GAME_KEY = 'nb_current_game';
const EVENT_KEY = 'nb_current_event';
const WALLET_PREFIX = 'afribet_demo_wallet_v1:';
const VALID_PAGES = new Set(['home', 'sports', 'event', 'casino', 'game', 'promotions', 'vip', 'legal', 'wallet', 'referral', 'support', 'profile', 'mybets']);

function walletKey(email) {
  return `${WALLET_PREFIX}${email}`;
}

function readWallet(email) {
  if (!email) return { balance: 0, transactions: [] };
  try {
    return JSON.parse(localStorage.getItem(walletKey(email))) || { balance: 1000, transactions: [] };
  } catch {
    return { balance: 1000, transactions: [] };
  }
}

function makeReferral(email) {
  if (!email) return 'AFRI------';
  return `AFRI${email.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase().padEnd(6, 'X')}`;
}

export function AppProvider({ children }) {
  const { user } = useAuth();
  const initialWallet = useMemo(() => readWallet(user?.email), [user?.email]);
  const [balance, setBalance] = useState(initialWallet.balance);
  const [transactions, setTransactions] = useState(initialWallet.transactions);
  const [walletOwner, setWalletOwner] = useState(user?.email ?? null);
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem(PAGE_KEY);
    return VALID_PAGES.has(saved) ? saved : 'home';
  });
  const [currentGame, setCurrentGame] = useState(() => localStorage.getItem(GAME_KEY));
  const [currentEvent, setCurrentEvent] = useState(() => localStorage.getItem(EVENT_KEY));

  useEffect(() => {
    const wallet = readWallet(user?.email);
    setBalance(wallet.balance);
    setTransactions(wallet.transactions);
    setWalletOwner(user?.email ?? null);
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email || walletOwner !== user.email) return;
    localStorage.setItem(walletKey(user.email), JSON.stringify({ balance, transactions }));
  }, [balance, transactions, user?.email, walletOwner]);

  useEffect(() => localStorage.setItem(PAGE_KEY, page), [page]);
  useEffect(() => {
    if (currentGame) localStorage.setItem(GAME_KEY, currentGame);
    else localStorage.removeItem(GAME_KEY);
  }, [currentGame]);
  useEffect(() => {
    if (currentEvent) localStorage.setItem(EVENT_KEY, currentEvent);
    else localStorage.removeItem(EVENT_KEY);
  }, [currentEvent]);

  const updateBalance = useCallback((amount) => {
    setBalance((current) => Math.max(0, Number((current + amount).toFixed(2))));
  }, []);

  const addTransaction = useCallback((transaction) => {
    setTransactions((current) => [{ id: globalThis.crypto?.randomUUID?.() ?? Date.now(), time: 'Just now', ...transaction }, ...current].slice(0, 50));
  }, []);

  const loadWallet = useCallback(async () => readWallet(user?.email), [user?.email]);
  const loadTransactions = useCallback(async () => transactions, [transactions]);

  const deposit = useCallback(async (amount, method = 'Demo Card') => {
    const value = Number(amount);
    updateBalance(value);
    addTransaction({ type: 'deposit', amount: value, method, status: 'completed' });
    return { success: true, demo: true };
  }, [addTransaction, updateBalance]);

  const withdraw = useCallback(async (amount, method = 'Demo Bank', destination = '') => {
    const value = Number(amount);
    if (value > balance) throw new Error('Insufficient demo balance.');
    updateBalance(-value);
    addTransaction({ type: 'withdrawal', amount: -value, method, destination, status: 'completed' });
    return { success: true, demo: true };
  }, [addTransaction, balance, updateBalance]);

  const value = useMemo(() => ({
    balance,
    setBalance,
    updateBalance,
    transactions,
    addTransaction,
    txPage: 1,
    txMeta: null,
    loadTransactions,
    deposit,
    withdraw,
    walletLoading: false,
    loadWallet,
    referral: makeReferral(user?.email),
    referrals: { count: 0, earned: 0, pending: 0 },
    page,
    setPage,
    currentGame,
    setCurrentGame,
    currentEvent,
    setCurrentEvent,
  }), [addTransaction, balance, currentEvent, currentGame, deposit, loadTransactions, loadWallet, page, transactions, updateBalance, user?.email, withdraw]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
