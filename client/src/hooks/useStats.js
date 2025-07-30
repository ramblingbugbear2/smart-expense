import { useMemo } from 'react';

/**
 * Derive paid / owed / net per user from the raw expenses array.
 * @param {Array} expenses  – fully-populated docs (payer + participants)
 * @returns {Object}        – keyed by userId { paid, owed, net, name }
 */
export default function useStats(expenses = []) {
  return useMemo(() => {
    const map = {};
    const ensure = (u, name) =>
      (map[u] ??= { name, paid: 0, owed: 0, get net() { return this.paid - this.owed; } });

    for (const e of expenses) {
      // credit the payer
      ensure(e.payer._id, e.payer.name).paid += e.amount;

      // debit every participant
      e.participants.forEach(p => {
        ensure(p.user._id, p.user.name).owed += p.share;
      });
    }
    return map;                    // { userId: {name,paid,owed,net}, … }
  }, [expenses]);
}
