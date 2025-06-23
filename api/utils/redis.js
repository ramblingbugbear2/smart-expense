// api/utils/redis.js
const Redis = require('ioredis');

/**
 * Single Redis client instance, shared across the app.
 * Host/port/password are read from .env
 */
const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => console.log('✅  Redis connected'));
redis.on('error',   err  => console.error('❌  Redis error:', err.message));

module.exports = redis;