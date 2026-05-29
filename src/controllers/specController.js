const PixelPitchSpec = require('../models/PixelPitchSpec');

/**
 * @desc    Get all specs for interactive slider
 * @route   GET /api/specs
 * @access  Public
 */
const getSpecs = async (req, res, next) => {
  try {
    const specs = await PixelPitchSpec.find({}).sort({ pitch: 1 });
    res.status(200).json({
      success: true,
      count: specs.length,
      data: specs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single spec details by pitch code (e.g., P1.5)
 * @route   GET /api/specs/:pitch
 * @access  Public
 */
const getSpecByPitch = async (req, res, next) => {
  try {
    // Standardize query (e.g. capitalize or trim spacing)
    const pitchCode = req.params.pitch.trim().toUpperCase();

    const spec = await PixelPitchSpec.findOne({ pitch: pitchCode });

    if (!spec) {
      return res.status(404).json({
        success: false,
        error: `Pitch specification not found for ${pitchCode}`
      });
    }

    res.status(200).json({
      success: true,
      data: spec
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSpecs,
  getSpecByPitch
};
