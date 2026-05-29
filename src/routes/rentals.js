const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { formRateLimiter } = require('../middleware/rateLimiter');
const {
  createRentalInquiry,
  getRentalInquiries,
  updateRentalInquiryStatus
} = require('../controllers/rentalController');

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

const rentalInquiryValidator = [
  body('fullName').notEmpty().withMessage('Full name is required').trim(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .trim()
    .matches(/^\+?[0-9\s\-()]{10,15}$/)
    .withMessage('Please enter a valid phone number (10-15 digits)'),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('durationDays')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Rental duration must be an integer of at least 1 day')
];

/**
 * Public routes (Rate limited to prevent rental form spam)
 */
router.post('/', formRateLimiter, rentalInquiryValidator, validateRequest, createRentalInquiry);

/**
 * Admin protected routes
 */
router.get('/', protect, getRentalInquiries);
router.patch('/:id/status', protect, updateRentalInquiryStatus);

module.exports = router;
