const nodemailer = require('nodemailer');

// Build the mail transporter if environment configuration exists
const buildTransporter = () => {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

/**
 * Dispatch an email alert to sales@liberalled.com on submission events
 * @param {Object} options email options
 * @param {string} options.subject email subject line
 * @param {string} options.text email plaintext content
 * @param {string} options.html email html content
 */
const sendNotificationEmail = async ({ subject, text, html }) => {
  const transporter = buildTransporter();
  const recipient = 'sales@liberalled.com';
  const sender = process.env.SMTP_FROM || 'no-reply@liberalled.com';

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"Liberal Systems Alerts" <${sender}>`,
        to: recipient,
        subject: subject,
        text: text,
        html: html
      });
      console.log(`[Email Service] Notification sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('[Email Service] Failed to send email via SMTP:', error.message);
      // Fallback to console log on SMTP failure
      logEmailToConsole(recipient, subject, text);
      return false;
    }
  } else {
    // In development or when SMTP is not configured
    logEmailToConsole(recipient, subject, text);
    return true;
  }
};

const logEmailToConsole = (recipient, subject, text) => {
  console.log('========================================================================');
  console.log(`[MOCK EMAIL SERVICE] Email that would be sent to: ${recipient}`);
  console.log(`Subject: ${subject}`);
  console.log('------------------------------------------------------------------------');
  console.log(text);
  console.log('========================================================================');
};

module.exports = { sendNotificationEmail };
