const router = require('express').Router();
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const gVal = require('../validators/group.validator');
const { create, list, getOne , listBalances } = require('../controllers/group.controller');

router.use(protect);
router.post('/', validate(gVal.createGroup), create);
router.get('/', list);
router.get('/balances/:id' , listBalances);
router.get('/:id', getOne);          // ← NEW

module.exports = router;