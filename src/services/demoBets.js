const PREFIX = 'afribet_demo_bets_v1:';

function key(email) {
  return `${PREFIX}${email}`;
}

export function getDemoBets(email) {
  if (!email) return [];
  try {
    return JSON.parse(localStorage.getItem(key(email))) || [];
  } catch {
    return [];
  }
}

export function addDemoBets(email, bets) {
  const created = bets.map((bet) => ({
    id: globalThis.crypto?.randomUUID?.() ?? `bet-${Date.now()}-${Math.random()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
    ...bet,
  }));
  localStorage.setItem(key(email), JSON.stringify([...created, ...getDemoBets(email)]));
  return created;
}

export function cashOutDemoBet(email, betId) {
  let amount = 0;
  const next = getDemoBets(email).map((bet) => {
    if (bet.id !== betId || bet.status !== 'pending') return bet;
    amount = Number(bet.cashout_value || 0);
    return { ...bet, status: 'cashout', cashout_amount: amount, cashout_value: null };
  });
  localStorage.setItem(key(email), JSON.stringify(next));
  return amount;
}
