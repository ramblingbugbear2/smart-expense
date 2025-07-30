const router    = require('express').Router();
const protect   = require('../middleware/protect');
const validate  = require('../middleware/validate');
const v         = require('../validators/expense.validator');
const c         = require('../controllers/expense.controller');
const Expense  = require('../models/expense.model');

router.use(protect);

router.post('/',            validate(v.createExpense),  c.create);
router.patch('/:id',        validate(v.updateExpense),  c.update);
router.delete('/:id',                                   c.remove);

router.get('/group/:id', async (req, res, next) => {
  try {
    const docs = await Expense
      .find({ group: req.params.id })
      .sort('-createdAt')
      .populate('payer',              'name email')     //  ← keep
      .populate('participants.user', 'name email');    //  ← these
    res.json(docs);
  } catch (err) { next(err); }
});

router.get('/balances/:id', require('../controllers/group.controller').listBalances);

module.exports = router;
