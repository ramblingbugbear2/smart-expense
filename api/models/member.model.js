const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Member',
  new mongoose.Schema({
    name: { type: String, required: true, trim: true },
  })
);
