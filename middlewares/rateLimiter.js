const limiter = require('express-rate-limit');

const rateLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = rateLimiter;
