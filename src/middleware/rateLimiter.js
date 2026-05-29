const rateLimit = require('express-rate-limit');

// Rate limiter for public POST endpoints (e.g., quotes and rentals)
// Limits IP to 10 requests per 15 minutes
const formRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many submissions from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { formRateLimiter };
