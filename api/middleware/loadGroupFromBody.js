const Group = require('../models/group.model');

module.exports = async (req, res, next) => {
  try {
    const grp = await Group.findById(req.body.group);
    if (!grp) return res.status(404).json({ msg: 'Group not found' });
    req.group = grp;          // exactly what the controller expects
    next();
  } catch (err) {
    next(err);
  }
};
