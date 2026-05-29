const RentalInquiry = require('../models/RentalInquiry');
const { sendNotificationEmail } = require('../services/emailService');

/**
 * @desc    Submit rental inquiry
 * @route   POST /api/rentals
 * @access  Public
 */
const createRentalInquiry = async (req, res, next) => {
  try {
    const rentalData = req.body;

    // Create rental inquiry document
    const inquiry = await RentalInquiry.create(rentalData);

    // Formulate event date print format
    const eventDateFormatted = inquiry.eventDate 
      ? new Date(inquiry.eventDate).toLocaleDateString('en-IN')
      : 'N/A';

    // Prepare email notification parameters
    const subject = `New LED Screen Rental Inquiry: ${inquiry.fullName} - ${inquiry.eventType || 'Rental Event'}`;
    
    const plainText = `
New LED Screen Rental Inquiry received for Liberal Systems!

Client Contact Information:
----------------------------
Name: ${inquiry.fullName}
Phone: ${inquiry.phone}
Email: ${inquiry.email || 'N/A'}

Event & Rental Specifics:
--------------------------
Event Type: ${inquiry.eventType || 'N/A'}
Event Date: ${eventDateFormatted}
Venue Name: ${inquiry.venueName || 'N/A'}
Venue City/Location: ${inquiry.venueCity || 'N/A'}
Required Screen Size: ${inquiry.screenSizeRequired || 'N/A'}
Rental Duration: ${inquiry.durationDays ? `${inquiry.durationDays} day(s)` : 'N/A'}

Client Message:
----------------
${inquiry.message || 'No message entered'}

Access the Admin Panel to check details and contact the client.
    `.trim();

    const htmlText = `
      <h3>New LED Screen Rental Inquiry Received</h3>
      <p>A new event rental inquiry has been submitted online.</p>
      
      <h4>Contact Details</h4>
      <ul>
        <li><strong>Client Name:</strong> ${inquiry.fullName}</li>
        <li><strong>Phone Number:</strong> ${inquiry.phone}</li>
        <li><strong>Email:</strong> ${inquiry.email || 'N/A'}</li>
      </ul>

      <h4>Event Details</h4>
      <ul>
        <li><strong>Event Type:</strong> ${inquiry.eventType || 'N/A'}</li>
        <li><strong>Event Date:</strong> ${eventDateFormatted}</li>
        <li><strong>Venue:</strong> ${inquiry.venueName || 'N/A'} (${inquiry.venueCity || 'N/A'})</li>
        <li><strong>Screen Size Required:</strong> ${inquiry.screenSizeRequired || 'N/A'}</li>
        <li><strong>Duration:</strong> ${inquiry.durationDays ? `${inquiry.durationDays} day(s)` : 'N/A'}</li>
      </ul>

      <h4>Client Message</h4>
      <p>${inquiry.message || '<em>No custom message provided</em>'}</p>

      <hr />
      <p><em>This is an automated notification from Liberal Systems Backend.</em></p>
    `;

    // Send email alert
    await sendNotificationEmail({
      subject,
      text: plainText,
      html: htmlText
    });

    res.status(201).json({
      success: true,
      message: 'Rental inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all rental inquiries (admin only)
 * @route   GET /api/rentals
 * @access  Private/Admin
 */
const getRentalInquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const inquiries = await RentalInquiry.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update status of rental inquiry
 * @route   PATCH /api/rentals/:id/status
 * @access  Private/Admin
 */
const updateRentalInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status field is required'
      });
    }

    const validStatuses = ['new', 'contacted', 'confirmed', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const inquiry = await RentalInquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: 'Rental inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRentalInquiry,
  getRentalInquiries,
  updateRentalInquiryStatus
};
