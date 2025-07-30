const redis = require('../utils/redis');
const Expense = require('../models/expense.model');
const Settlement  = require('../models/settlement.model');

const GROUP_KEY = id => `grp:${id}:balances`;

exports.getBalances = async (groupId) => {
    let cached = await redis.get(GROUP_KEY(groupId));
    if(cached) {
        console.log('HIT')
        return JSON.parse(cached); //found
    }
    //not found
    const expenses = await Expense.find({ group: groupId});
    const map ={};
    expenses.forEach(e => {
        e.participants.forEach(p => {
            map[p.user] = (map[p.user] || 0) - p.share;
        });
        map[e.payer] = (map[e.payer] || 0) + e.amount;
    });
    /* ---------- 2. fold in all settlements ---------- */
    const settlements = await Settlement.find({ group: groupId });
    settlements.forEach(s => {
      // ‘from’ paid money → their debt decreases
      map[s.from] = (map[s.from] || 0) + s.amount;
      // ‘to’ received money → their credit decreases
      map[s.to]   = (map[s.to]   || 0) - s.amount;
    });

    await redis.set(GROUP_KEY(groupId), JSON.stringify(map), 'EX' ,120);
    return map;
};

exports.invalidateGroup = (groupId) => {
    redis.del(GROUP_KEY(groupId));
}