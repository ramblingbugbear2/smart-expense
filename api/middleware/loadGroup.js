// api/middleware/loadGroup.js
const Group = require('../models/group.model');

module.exports = async (req, res, next, groupId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    // Attach the group and its member IDs array for your guard
    req.group = group;
    next();
  } catch (err) {
    next(err);
  }
};
