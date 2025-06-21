const router = require('express').Router();
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const eVal = require('../validators/expense.validator');
const {create,listByGroup} = require('../controllers/expense.controller');

router.use(protect);
router.post('/', validate(eVal.createExpense), create);
router.get('/group/:id', listByGroup);

module.exports = router;