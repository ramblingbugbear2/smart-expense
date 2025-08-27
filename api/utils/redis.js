const { EventEmitter } = require('events');

if (process.env.NODE_ENV === 'test') {
  // Test environment - dummy client
  const dummy = new EventEmitter();
  dummy.on = () => {};
  dummy.off = () => {};
  dummy.emit = () => {};
  dummy.get = async () => null;
  dummy.set = async () => {};
  dummy.del = async () => {};
  module.exports = dummy;
} else {
  const Redis = require('ioredis');
  
  let redis;
  
  if (process.env.REDIS_URL) {
    // Railway-compatible configuration
    if (process.env.REDIS_URL.includes('railway.internal')) {
      // Railway private network - specific configuration
      redis = new Redis(process.env.REDIS_URL, {
        family: 0, // Enable dual-stack (IPv4 and IPv6)
        lazyConnect: true,
        connectTimeout: 10000,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });
    } else {
      // Local development or other environments
      redis = new Redis(process.env.REDIS_URL);
    }
  } else {
    console.log('⚠️  No REDIS_URL provided, Redis unavailable');
    // Fallback dummy client
    const dummy = new EventEmitter();
    dummy.get = async () => null;
    dummy.set = async () => 'OK';
    dummy.del = async () => 1;
    dummy.on = () => {};
    dummy.off = () => {};
    dummy.emit = () => {};
    module.exports = dummy;
    return;
  }
  
  redis.on('connect', () => console.log('✅  Redis connected'));
  redis.on('error', (err) => {
    console.error('❌  Redis error:', err.message);
    // Don't crash the app, just log the error
  });
  
  module.exports = redis;
}

