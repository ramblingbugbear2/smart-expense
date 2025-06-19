const router = require('express').Router();
const {signup,login,refresh} = require('../controllers/auth.controller.js');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);

module.exports = router;