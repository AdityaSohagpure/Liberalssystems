const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { formRateLimiter } = require('../middleware/rateLimiter');
const {
  createQuoteRequest,
  getQuoteRequests,
  getQuoteRequestById,
  updateQuoteRequestStatus
} = require('../controllers/quoteController');

const router = express.Router();

// Validation helper middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array().map(err => err.msg).join(', ')
    });
  }
  next();
};

const quoteRequestValidator = [
  body('fullName').notEmpty().withMessage('Full name is required').trim(),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .trim()
    .matches(/^\+?[0-9\s\-()]{10,15}$/)
    .withMessage('Please enter a valid phone number (10-15 digits)'),
  body('projectType')
    .notEmpty()
    .withMessage('Project type is required')
    .isIn(['events', 'corporate', 'broadcast', 'arena', 'retail', 'outdoor-advertising', 'other'])
    .withMessage('Project type must be one of: events, corporate, broadcast, arena, retail, outdoor-advertising, other'),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('screenAreaSqFt')
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage('Screen area must be a number')
    .custom(val => val >= 0)
    .withMessage('Screen area must be positive'),
  body('productId')
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid product ID format')
];

/**
 * Public routes (Rate limited to prevent B2B form spam)
 */
router.post('/', formRateLimiter, quoteRequestValidator, validateRequest, createQuoteRequest);

/**
 * Admin protected routes
 */
router.get('/', protect, getQuoteRequests);
router.get('/:id', protect, getQuoteRequestById);
router.patch('/:id/status', protect, updateQuoteRequestStatus);

module.exports = router;
