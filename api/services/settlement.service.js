const BalanceSvc = require('./balance.service');  // already exists
const { round }  = require('../utils/number');    // helper, see bottom

/**
 * Compute the minimal transfer list [{from, to, amount}]
 * Returns promise -> array.
 */
exports.computeOptimal = async (groupId) => {
  const balances = await BalanceSvc.getBalances(groupId); // {uid: net}
  const debtors = [], creditors = [];

  Object.entries(balances).forEach(([uid, net]) => {
    if (net < 0) debtors.push({ uid, amt: -net });        // owes
    else if (net > 0) creditors.push({ uid, amt: net });  // is owed
  });

  debtors.sort((a, b) => b.amt - a.amt);      // largest first
  creditors.sort((a, b) => b.amt - a.amt);

  const transfers = [];
  while (debtors.length && creditors.length) {
    const d = debtors[0];
    const c = creditors[0];
    const pay = round(Math.min(d.amt, c.amt));

    transfers.push({ from: d.uid, to: c.uid, amount: pay });

    d.amt = round(d.amt - pay);
    c.amt = round(c.amt - pay);
    if (!d.amt) debtors.shift();
    if (!c.amt) creditors.shift();
  }
  return transfers;    // sums cancel to 0 (±0.01 rounding drift)
};

/* Re-export so controller can invalidate cache when payments land */
exports.invalidateGroup = BalanceSvc.invalidateGroup;

/* ---------- tiny helper ---------- */
exports.round = exports.__testRound = round;           // expose for Jest
