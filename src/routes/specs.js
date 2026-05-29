const express = require('express');
const { getSpecs, getSpecByPitch } = require('../controllers/specController');

const router = express.Router();

/**
 * Public routes (No auth needed, used by frontend sliders/spec sheets)
 */
router.get('/', getSpecs);
router.get('/:pitch', getSpecByPitch);

module.exports = router;
