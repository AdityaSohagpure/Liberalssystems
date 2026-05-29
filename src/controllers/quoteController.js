const QuoteRequest = require('../models/QuoteRequest');
const Product = require('../models/Product');
const { sendNotificationEmail } = require('../services/emailService');

/**
 * @desc    Submit B2B quote request
 * @route   POST /api/quotes
 * @access  Public
 */
const createQuoteRequest = async (req, res, next) => {
  try {
    const quoteData = req.body;
    
    // Create the quote request record
    const quote = await QuoteRequest.create(quoteData);

    // Fetch linked product details if provided for inclusion in the email notification
    let productDetailsText = 'None';
    if (quote.productId) {
      const product = await Product.findById(quote.productId);
      if (product) {
        productDetailsText = `${product.name} (Price: ₹${product.price} per ${product.priceUnit === 'sq_ft' ? 'sq ft' : 'piece'})`;
      }
    }

    // Prepare email content
    const subject = `New B2B Quote Request: ${quote.fullName} (${quote.companyName || 'No Company'})`;
    
    const plainText = `
New B2B Quote Request received for Liberal Systems!

Lead Details:
--------------
Name: ${quote.fullName}
Company: ${quote.companyName || 'N/A'}
Phone Number: ${quote.phoneNumber}
Email Address: ${quote.email || 'N/A'}

Project Specifications:
------------------------
Project Type: ${quote.projectType}
Requested Pixel Pitch Preference: ${quote.pixelPitchPreference || 'N/A'}
Estimated Screen Area: ${quote.screenAreaSqFt ? `${quote.screenAreaSqFt} sq ft` : 'N/A'}
Interested Product: ${productDetailsText}

Additional Notes:
------------------
${quote.additionalNotes || 'No notes provided'}

This lead is marked as 'new'. Log into the Admin Dashboard to manage and assign this lead.
    `.trim();

    const htmlText = `
      <h3>New B2B Quote Request Received</h3>
      <p>A new lead has submitted a request on the Liberal Systems website.</p>
      
      <h4>Lead Details</h4>
      <ul>
        <li><strong>Name:</strong> ${quote.fullName}</li>
        <li><strong>Company:</strong> ${quote.companyName || 'N/A'}</li>
        <li><strong>Phone:</strong> ${quote.phoneNumber}</li>
        <li><strong>Email:</strong> ${quote.email || 'N/A'}</li>
      </ul>

      <h4>Project Specifications</h4>
      <ul>
        <li><strong>Project Type:</strong> ${quote.projectType}</li>
        <li><strong>Pixel Pitch Preference:</strong> ${quote.pixelPitchPreference || 'N/A'}</li>
        <li><strong>Screen Area:</strong> ${quote.screenAreaSqFt ? `${quote.screenAreaSqFt} sq ft` : 'N/A'}</li>
        <li><strong>Selected Product:</strong> ${productDetailsText}</li>
      </ul>

      <h4>Additional Notes</h4>
      <p>${quote.additionalNotes || '<em>No notes provided</em>'}</p>

      <hr />
      <p><em>This is an automated notification from Liberal Systems Backend.</em></p>
    `;

    // Trigger email notification (fire-and-forget or await, let's await it since it handles errors internally)
    await sendNotificationEmail({
      subject,
      text: plainText,
      html: htmlText
    });

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all quote requests (leads) with pagination & status filters
 * @route   GET /api/quotes
 * @access  Private/Admin
 */
const getQuoteRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const skipIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const total = await QuoteRequest.countDocuments(query);
    const quotes = await QuoteRequest.find(query)
      .populate('productId', 'name price priceUnit')
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      data: quotes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single quote request details
 * @route   GET /api/quotes/:id
 * @access  Private/Admin
 */
const getQuoteRequestById = async (req, res, next) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id).populate('productId');

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Quote request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quote request status or fields
 * @route   PATCH /api/quotes/:id/status
 * @access  Private/Admin
 */
const updateQuoteRequestStatus = async (req, res, next) => {
  try {
    const { status, assignedTo } = req.body;
    const updateFields = {};

    if (status) {
      const validStatuses = ['new', 'contacted', 'quoted', 'closed-won', 'closed-lost'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      updateFields.status = status;
    }

    if (assignedTo !== undefined) {
      updateFields.assignedTo = assignedTo;
    }

    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('productId');

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Quote request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuoteRequest,
  getQuoteRequests,
  getQuoteRequestById,
  updateQuoteRequestStatus
};
