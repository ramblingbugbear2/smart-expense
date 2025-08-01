const router = require('express').Router();
const Member = require('../models/member.model');

// GET all
router.get('/', async (_, res) => {
  res.json(await Member.find().sort('name'));
});

// POST add
router.post('/', async (req, res) => {
  const { name = '' } = req.body;
  if (!name.trim()) return res.status(400).json({ msg: 'Name required' });
  const m = await Member.create({ name: name.trim() });
  res.status(201).json(m);
});

// PUT rename
router.put('/:id', async (req, res) => {
  const { name = '' } = req.body;
  const m = await Member.findByIdAndUpdate(
    req.params.id,
    { name: name.trim() },
    { new: true }
  );
  if (!m) return res.status(404).json({ msg: 'Member not found' });
  res.json(m);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const m = await Member.findByIdAndDelete(req.params.id);
  if (!m) return res.status(404).json({ msg: 'Member not found' });
  res.sendStatus(204);
});

module.exports = router;
