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


module.exports = router;