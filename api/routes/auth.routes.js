const router = require('express').Router();
const {signup,login,refresh} = require('../controllers/auth.controller.js');
const User = require('../models/user.model.js');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);

// ─────────────── NEW:  GET /api/auth/users ───────────────
router.get('/users', async (req, res, next) => {
  try {
    const list = await User.find({}, 'name email');    // only name, email, _id
    res.json(list);
  } catch (err) { next(err); }
});

// CREATE  ─────────────────────────────────────────────────────────────
router.post('/users', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ msg: 'Name required' });
  const user = await User.create({ name: name.trim() });
  res.status(201).json(user);
});

// UPDATE (rename) ─────────────────────────────────────────────────────
router.put('/users/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!name?.trim()) return res.status(400).json({ msg: 'Name required' });
  const user = await User.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json(user);
});

// DELETE ──────────────────────────────────────────────────────────────
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.sendStatus(204);
});


module.exports = router;