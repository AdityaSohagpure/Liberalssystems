const express = require('express');
const { body, validationResult } = require('express-validator');
const { loginAdmin, registerAdmin, logoutAdmin } = require('../controllers/authController');

const router = express.Router();

// Helper to handle validation errors
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

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin
 * @access  Public
 */
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  loginAdmin
);

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new admin user
 * @access  Public
 */
router.post(
  '/signup',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long')
      .trim(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  registerAdmin
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout admin / clear cookie
 * @access  Public
 */
router.post('/logout', logoutAdmin);

module.exports = router;

