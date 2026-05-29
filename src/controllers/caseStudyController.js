const CaseStudy = require('../models/CaseStudy');

/**
 * @desc    Get all case studies
 * @route   GET /api/case-studies
 * @access  Public
 */
const getCaseStudies = async (req, res, next) => {
  try {
    const caseStudies = await CaseStudy.find({})
      .populate('productUsed', 'name category type')
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: caseStudies.length,
      data: caseStudies
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single case study details
 * @route   GET /api/case-studies/:id
 * @access  Public
 */
const getCaseStudyById = async (req, res, next) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id)
      .populate('productUsed', 'name category type price priceUnit');

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    res.status(200).json({
      success: true,
      data: caseStudy
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new case study
 * @route   POST /api/case-studies
 * @access  Private/Admin
 */
const createCaseStudy = async (req, res, next) => {
  try {
    const caseStudy = await CaseStudy.create(req.body);

    res.status(201).json({
      success: true,
      data: caseStudy
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCaseStudies,
  getCaseStudyById,
  createCaseStudy
};
