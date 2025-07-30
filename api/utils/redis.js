// api/utils/redis.js
const { EventEmitter } = require('events');

if (process.env.NODE_ENV === 'test') {
  // ── dummy no-op client for Jest ──
  const dummy = new EventEmitter();

  // socket methods
  dummy.on  = () => {};
  dummy.off = () => {};
  dummy.emit= () => {};

  // cache helpers expected by services
  dummy.get = async () => null;   // always miss
  dummy.set = async () => {};     // no-op
  dummy.del = async () => {};     // no-op

  module.exports = dummy;         // ← sufficient; no need for `return`
} else {
  /* ---------- real Redis for dev / prod ---------- */
  const Redis = require('ioredis');
  const redis = new Redis(process.env.REDIS_URL);

  redis.on('connect', () => console.log('✅  Redis connected'));
  redis.on('error',   err => console.error('❌  Redis error:', err.message));

  module.exports = redis;
}
