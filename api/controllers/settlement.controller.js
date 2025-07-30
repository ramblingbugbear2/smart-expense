const Expense    = require('../models/expense.model');
const Settlement = require('../models/settlement.model');
const Svc        = require('../services/settlement.service');
const io         = require('../utils/socket').get();

/* POST /settlements — save one payment */
exports.create = async (req, res, next) => {
  try {
    const { group, from, to, amount, note } = req.body;

    // ✅ ensure both users belong to the group pre-loaded by middleware
    const members = req.group.members.map((m) => m.toString());
    if (!members.includes(from) || !members.includes(to)) {
      return res.status(403).json({ msg: 'Users not in this group' });
    }

    const doc = await Settlement.create({ group, from, to, amount, note });
    Svc.invalidateGroup(group);      // wipe cached balances
    io.to(group).emit('settlement:new', doc);

    /* ----------  OPTIONAL “clear” flag  ---------- */
    if (req.query.clear === '1') {
      await Expense.deleteMany({ group });          // 🔥 remove old expenses
      io.to(group).emit('expense:clear');           //  → make clients refetch
    }

    res.status(201).json(doc);
  } catch (err) { next(err); }
};

/* GET /settlements/group/:id — full history */
exports.listGroup = async (req, res, next) => {
  try {
    const list = await Settlement.find({ group: req.params.id })
      .sort({ date: -1 })
      .populate('from to', 'name email');
    res.json(list);
  } catch (err) { next(err); }
};

/* GET /settlements/pending/:id — optimal table */
exports.pending = async (req, res, next) => {
  try {
    const xfers = await Svc.computeOptimal(req.params.id);
    res.json(xfers);
  } catch (err) { next(err); }
};
