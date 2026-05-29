const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  getCaseStudies,
  getCaseStudyById,
  createCaseStudy
} = require('../controllers/caseStudyController');

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

const caseStudyValidator = [
  body('title').notEmpty().withMessage('Case study title is required').trim(),
  body('productUsed')
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid product ID format')
];

/**
 * Public routes
 */
router.get('/', getCaseStudies);
router.get('/:id', getCaseStudyById);

/**
 * Admin protected routes
 */
router.post('/', protect, caseStudyValidator, validateRequest, createCaseStudy);

module.exports = router;
