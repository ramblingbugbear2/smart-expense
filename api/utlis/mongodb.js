// api/utils/db.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * The URI comes from process.env.MONGODB_URI
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // these options avoid deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);            // crash fast if DB is unreachable
  }
};

module.exports = connectDB;