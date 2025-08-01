const router = require('express').Router();
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const gVal = require('../validators/group.validator');
const { create, list, getOne , listBalances } = require('../controllers/group.controller');
const Group  = require('../models/group.model');

router.use(protect);
router.post('/', validate(gVal.createGroup), create);
router.get('/', list);
router.get('/balances/:id' , listBalances);
router.get('/:id', getOne);          // ← NEW

// UPDATE name  ───────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { name = '' } = req.body;
  const grp = await Group.findByIdAndUpdate(
    req.params.id,
    { name: name.trim() },
    { new: true }
  );
  if (!grp) return res.status(404).json({ msg: 'Group not found' });

  // (optional) emit socket event so others update in realtime
  req.app.get('io')?.emit('group:rename', grp);

  res.json(grp);
});

module.exports = router;