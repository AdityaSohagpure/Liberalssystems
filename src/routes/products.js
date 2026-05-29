const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// Validation errors checker middleware
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

const productValidator = [
  body('name').notEmpty().withMessage('Product name is required').trim(),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['outdoor', 'indoor', 'transparent', 'mobile-advertising'])
    .withMessage('Category must be one of: outdoor, indoor, transparent, mobile-advertising'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(val => val >= 0)
    .withMessage('Price must be a positive number'),
  body('priceUnit')
    .notEmpty()
    .withMessage('Price unit is required')
    .isIn(['sq_ft', 'piece'])
    .withMessage('Price unit must be one of: sq_ft, piece')
];

/**
 * Public routes
 */
router.get('/', getProducts);
router.get('/:id', getProductById);

/**
 * Admin protected routes
 */
router.post('/', protect, productValidator, validateRequest, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
