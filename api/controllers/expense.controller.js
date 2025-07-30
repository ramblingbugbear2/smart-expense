const Expense     = require('../models/expense.model');
const balanceSvc  = require('../services/balance.service');
const socket      = require('../utils/socket');

/* --------------------------------------------------- *
 *  POST /api/expenses                                 *
 * --------------------------------------------------- */
exports.create = async (req, res, next) => {
  try {
    /* 1) create ONE document (object, not array) */
    const exp = await Expense.create(req.body);

    /* 2) enrich it for the client / socket  */
    await exp.populate([
          { path: 'payer',              select: 'name email' },
          { path: 'participants.user',  select: 'name email' }
        ]);

    /* 3) bust balances-cache & broadcast */
    balanceSvc.invalidateGroup(exp.group);
    socket.get().to(exp.group.toString()).emit('expense:new', exp);

    res.status(201).json(exp);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------- *
 *  PATCH /api/expenses/:id                            *
 * --------------------------------------------------- */
exports.update = async (req, res, next) => {
  try {
    const exp = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!exp) return res.status(404).json({ msg: 'Expense not found' });
    await exp
      .populate('payer',              'name email')
      .populate('participants.user', 'name email');

    // 🧹 bust the cached balances and notify clients
    await balanceSvc.invalidateGroup(exp.group);
    socket.get().to(exp.group.toString()).emit('expense:update', exp);

    res.json(exp);
  } catch (err) { next(err); }
};

/* --------------------------------------------------- *
 *  DELETE /api/expenses/:id                           *
 * --------------------------------------------------- */
exports.remove = async (req, res, next) => {
  try {
    const exp = await Expense.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ msg: 'Expense not found' });
    await balanceSvc.invalidateGroup(exp.group);
    socket.get().to(exp.group.toString()).emit('expense:delete', { id: exp._id });

    res.sendStatus(204);                        // No-Content
  } catch (err) { next(err); }
};

/* --------------------------------------------------- *
 *  GET /api/expenses/group/:id                        *
 * --------------------------------------------------- */
exports.listByGroup = async (req, res, next) => {
  try {
    const docs = await Expense
      .find({ group: req.params.id })
      .sort('-createdAt')
      .populate('payer',               'name email')
      .populate('participants.user',  'name email');

    res.json(docs);
  } catch (err) { next(err); }
};