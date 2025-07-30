// api/utils/db.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * In test mode uses MONGODB_URI_TEST, otherwise MONGODB_URI.
 */
const connectDB = async () => {
  const uri = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI;
  const opts = { useNewUrlParser: true, useUnifiedTopology: true };

  try {
    await mongoose.connect(uri, opts);
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅  MongoDB connected');
    }
  } catch (err) {
    console.error('❌  MongoDB connection error:', err.message);
    if (process.env.NODE_ENV === 'test') {
      throw err;            // let Jest catch it
    } else {
      process.exit(1);      // in prod, crash
    }
  }
};

module.exports = connectDB;
