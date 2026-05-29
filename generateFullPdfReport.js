const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Colors
const COLOR_PRIMARY = '#1A202C'; // Deep Slate
const COLOR_ACCENT = '#C0A060';  // Gold
const COLOR_TEXT = '#2D3748';    // Dark Slate
const COLOR_MUTED = '#718096';   // Muted Gray
const COLOR_BG_CODE = '#F8FAFC'; // Light Gray BG for Code Blocks
const COLOR_BORDER = '#E2E8F0';  // Border

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true
});

const reportPath = path.join(__dirname, 'Liberal_Systems_Full_API_Documentation.pdf');
const stream = fs.createWriteStream(reportPath);
doc.pipe(stream);

// Fonts
const fontRegular = 'Helvetica';
const fontBold = 'Helvetica-Bold';
const fontMono = 'Courier';

// Helper to draw horizontal divider
function drawDivider(y) {
  doc.strokeColor(COLOR_BORDER)
     .lineWidth(1)
     .moveTo(50, y)
     .lineTo(545, y)
     .stroke();
}

// Helper to draw code block background & text
function drawCodeBlock(codeString, startY) {
  const lines = codeString.split('\n');
  const height = lines.length * 11 + 14;
  
  // Page overflow handler
  if (startY + height > 760) {
    doc.addPage();
    startY = 50;
  }
  
  // Background
  doc.fillColor(COLOR_BG_CODE)
     .rect(50, startY, 495, height)
     .fill();
     
  // Border
  doc.strokeColor(COLOR_BORDER)
     .lineWidth(0.5)
     .rect(50, startY, 495, height)
     .stroke();
     
  // Text
  doc.fillColor('#1A202C')
     .font(fontMono)
     .fontSize(8.5);
     
  let currentY = startY + 7;
  lines.forEach(line => {
    doc.text(line, 58, currentY);
    currentY += 11;
  });
  
  return startY + height + 12;
}

// Helper for route section headings
function addRouteHeading(title, method, url, authRequired = false) {
  doc.font(fontBold).fontSize(14).fillColor(COLOR_PRIMARY).text(title);
  const currentY = doc.y;
  
  // Draw Method badge
  const m = method.toUpperCase();
  const badgeColor = m === 'GET' ? '#3182CE' : m === 'POST' ? '#38A169' : m === 'PUT' ? '#DD6B20' : m === 'PATCH' ? '#805AD5' : '#E53E3E';
  
  doc.fillColor(badgeColor)
     .rect(50, currentY + 4, 52, 15)
     .fill();
     
  doc.fillColor('#FFFFFF')
     .font(fontBold)
     .fontSize(8)
     .text(m, 50, currentY + 8, { width: 52, align: 'center' });
     
  // URL Text
  doc.fillColor(COLOR_TEXT)
     .font(fontMono)
     .fontSize(10)
     .text(url, 112, doc.y - 12);
     
  // Auth badge
  if (authRequired) {
    doc.fillColor('#FED7D7')
       .rect(465, currentY + 4, 80, 15)
       .fill();
    doc.fillColor('#C53030')
       .font(fontBold)
       .fontSize(7.5)
       .text('ADMIN ONLY', 465, currentY + 8, { width: 80, align: 'center' });
  } else {
    doc.fillColor('#E2E8F0')
       .rect(465, currentY + 4, 80, 15)
       .fill();
    doc.fillColor('#4A5568')
       .font(fontBold)
       .fontSize(7.5)
       .text('PUBLIC ROUTE', 465, currentY + 8, { width: 80, align: 'center' });
  }
     
  doc.y = currentY + 25;
}

// =========================================================================
// PAGE 1: COVER PAGE
// =========================================================================
doc.fillColor(COLOR_PRIMARY).rect(0, 0, 15, 842).fill();
doc.fillColor(COLOR_ACCENT).rect(15, 0, 5, 842).fill();

doc.y = 150;
doc.fillColor(COLOR_PRIMARY).font(fontBold).fontSize(32).text('LIBERAL SYSTEMS', 50, doc.y)
   .fillColor(COLOR_ACCENT).text('PRIVATE LIMITED', 50, doc.y - 5);

doc.y += 20;
doc.fillColor(COLOR_TEXT).font(fontRegular).fontSize(16).text('Complete API Documentation & Technical Manual');
doc.y += 40;
drawDivider(doc.y);

doc.y += 30;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('CORPORATE REGISTER:');
doc.font(fontRegular).fillColor(COLOR_TEXT).fontSize(10);
doc.text('Company Name: Liberal Systems Private Limited', 50, doc.y + 5);
doc.text('GST Identification Number: 27AADCL2182N1Z6', 50, doc.y + 18);
doc.text('Hotline Service: 07942817759 | Contact Email: sales@liberalled.com', 50, doc.y + 31);
doc.text('Factory Address: M.I.D.C Industrial Area, Nagpur, Maharashtra - 440016', 50, doc.y + 44);

doc.y += 85;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('DOCUMENT SPECIFICATION:');
doc.font(fontRegular).fillColor(COLOR_TEXT).fontSize(10);
doc.text('Document Name: Full API Operations & Integration Manual', 50, doc.y + 5);
doc.text('Tested Environment: Localhost v1.0.0 Server', 50, doc.y + 18);
doc.text(`Compilation Date: ${new Date().toLocaleDateString('en-IN')}`, 50, doc.y + 31);
doc.text('Status: Verified & Operational', 50, doc.y + 44);

doc.fontSize(9).fillColor(COLOR_MUTED).text('© 2026 Liberal Systems Private Limited. Confidential Document.', 50, 750);

// =========================================================================
// PAGE 2: TABLE OF CONTENTS & OVERVIEW
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(20).fillColor(COLOR_PRIMARY).text('Table of Contents');
doc.y += 10;
drawDivider(doc.y);

doc.y += 20;
const tocItems = [
  { page: 2, section: '1. Technical Architecture Overview' },
  { page: 3, section: '2. Admin Authentication API Reference' },
  { page: 4, section: '3. Products API Reference' },
  { page: 6, section: '4. B2B Quote Requests (Leads) API Reference' },
  { page: 8, section: '5. Rental Inquiries API Reference' },
  { page: 9, section: '6. Pixel Pitch Specifications API Reference' },
  { page: 10, section: '7. Case Studies Portfolio API Reference' },
  { page: 11, section: '8. Root Directory Information' },
  { page: 12, section: '9. Error Matrices & Troubleshooting Code Reference' }
];

doc.font(fontRegular).fontSize(10.5).fillColor(COLOR_TEXT);
tocItems.forEach(item => {
  doc.text(item.section, 50, doc.y);
  doc.text(item.page.toString(), 520, doc.y - 12, { align: 'right' });
  doc.y += 10;
});

doc.y += 30;
doc.font(fontBold).fontSize(14).fillColor(COLOR_PRIMARY).text('1. Technical Architecture Overview');
doc.y += 8;
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT)
   .text('This documentation covers the full REST API schema for the Liberal Systems LED display backend. The API handles catalog services, interactive spec estimation utilities, and lead logs. Standard HTTP responses (200, 201, 400, 401, 404, 429, 500) are utilized.', { lineGap: 3 });

doc.y += 15;
doc.font(fontBold).fontSize(10).text('Base Service URL:');
doc.font(fontMono).fontSize(10).text('http://localhost:5000', 50, doc.y + 4);

doc.y += 25;
doc.font(fontBold).fontSize(10).text('Security Policies Enforced:');
doc.font(fontRegular).fontSize(9.5).text('• JWT Authentication: Enforced on all edit/creation routes via Authorization header (Bearer tokens).', 50, doc.y + 5);
doc.text('• Spam Prevention: Rate limiter (max 10 requests per 15 mins) configured on public quote/rental submissions.', 50, doc.y + 18);
doc.text('• Mongoose Data Validation: Enforced on schema levels to reject invalid property values.', 50, doc.y + 31);

// =========================================================================
// PAGE 3: AUTHENTICATION API
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(18).fillColor(COLOR_PRIMARY).text('2. Admin Authentication API Reference');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Admin Signup (Create Admin)', 'POST', '/api/auth/signup', false);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Registers a new admin login. Password is encrypted using Bcryptjs.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Request Body (JSON):');
const signupBody = `{\n  "username": "newadmin",\n  "password": "LiberalAdmin2026!"\n}`;
doc.y = drawCodeBlock(signupBody, doc.y + 5);

doc.y += 5;
addRouteHeading('Admin Login', 'POST', '/api/auth/login', false);
doc.font(fontRegular).fontSize(9.5).text('Authenticates admin and returns JWT Bearer token.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Expected Response (200 OK):');
const loginResponse = `{\n  "success": true,\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...",\n  "admin": { "id": "6a1963...", "username": "admin" }\n}`;
doc.y = drawCodeBlock(loginResponse, doc.y + 5);

doc.y += 5;
addRouteHeading('Admin Logout', 'POST', '/api/auth/logout', false);
doc.font(fontRegular).fontSize(9.5).text('Logs out administrator and clears local authentication cookies.', 50, doc.y + 5);

// =========================================================================
// PAGE 4: PRODUCTS API PART 1
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(18).fillColor(COLOR_PRIMARY).text('3. Products API Reference');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Get All Products', 'GET', '/api/products', false);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Retrieves list of active (non-deleted) products. Supports query parameters for filtering.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Supported Query Parameters:');
doc.font(fontRegular).fontSize(9).text('• category: Filter by \'indoor\', \'outdoor\', \'transparent\', or \'mobile-advertising\'', 60, doc.y + 5);
doc.text('• minPrice & maxPrice: Price ranges in INR', 60, doc.y + 16);
doc.text('• inStock: Filter by stock status (true/false)', 60, doc.y + 27);
doc.text('• search: Keyword search on name or type', 60, doc.y + 38);

doc.y += 50;
doc.font(fontBold).fontSize(9.5).text('Sample Response Data (200 OK):');
const prodListRes = `{\n  "success": true,\n  "count": 1,\n  "data": [\n    {\n      "_id": "6a19568cbae69c7...",\n      "name": "Outdoor Building LED Screen",\n      "category": "outdoor",\n      "price": 5500,\n      "priceUnit": "sq_ft",\n      "inStock": true\n    }\n  ]\n}`;
doc.y = drawCodeBlock(prodListRes, doc.y + 5);

doc.y += 5;
addRouteHeading('Get Single Product Details', 'GET', '/api/products/:id', false);
doc.font(fontRegular).fontSize(9.5).text('Retrieves specific details of a single product.', 50, doc.y + 5);

// =========================================================================
// PAGE 5: PRODUCTS API PART 2
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(16).fillColor(COLOR_PRIMARY).text('3. Products API Reference (Continued)');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Create Product', 'POST', '/api/products', true);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Registers a new display panel in the catalog database.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Request Body (JSON):');
const prodCreateBody = `{\n  "name": "P3 Indoor Fixed LED Screen",\n  "category": "indoor",\n  "type": "FINE PITCH SYSTEM",\n  "price": 31300,\n  "priceUnit": "piece",\n  "pixelPitchOptions": ["P2", "P3"],\n  "refreshRate": "3,840 Hz"\n}`;
doc.y = drawCodeBlock(prodCreateBody, doc.y + 5);

doc.y += 5;
addRouteHeading('Update Product', 'PUT', '/api/products/:id', true);
doc.font(fontRegular).fontSize(9.5).text('Updates specific attributes of an existing product.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Body (Updating stock status):');
const prodUpdateBody = `{\n  "inStock": false\n}`;
doc.y = drawCodeBlock(prodUpdateBody, doc.y + 5);

doc.y += 5;
addRouteHeading('Delete Product', 'DELETE', '/api/products/:id', true);
doc.font(fontRegular).fontSize(9.5).text('Soft deletes a product from list view, leaving linked leads intact.', 50, doc.y + 5);

// =========================================================================
// PAGE 6: QUOTES API PART 1
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(18).fillColor(COLOR_PRIMARY).text('4. B2B Quote Requests (Leads) API');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Submit Quote Request', 'POST', '/api/quotes', false);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Submitted by visitors on the B2B form. Sends automated alert to sales@liberalled.com.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Request Body (JSON):');
const quoteBody = `{\n  "fullName": "Vijay Mishra",\n  "companyName": "Nagpur Metro Rail Corp",\n  "projectType": "corporate",\n  "screenAreaSqFt": 350,\n  "phoneNumber": "+919876543222",\n  "email": "mishra.v@nagpurmetro.gov.in",\n  "pixelPitchPreference": "P2.0"\n}`;
doc.y = drawCodeBlock(quoteBody, doc.y + 5);

doc.y += 5;
addRouteHeading('Get All Quotes', 'GET', '/api/quotes', true);
doc.font(fontRegular).fontSize(9.5).text('Retrieve all quote inquiries. Supports paging and status filters.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Query Filters:');
doc.font(fontRegular).fontSize(9).text('• status: Filter leads (new, contacted, quoted, closed-won, closed-lost)', 60, doc.y + 5);
doc.text('• page: Page index (defaults to 1)', 60, doc.y + 16);
doc.text('• limit: Items per page (defaults to 10)', 60, doc.y + 27);

// =========================================================================
// PAGE 7: QUOTES API PART 2
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(16).fillColor(COLOR_PRIMARY).text('4. B2B Quote Requests (Leads) API (Continued)');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Get Single Quote Request Details', 'GET', '/api/quotes/:id', true);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Retrieves detailed info for a single lead, populating its interested product schema.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Populate Response (200 OK):');
const quoteGetRes = `{\n  "success": true,\n  "data": {\n    "_id": "6a19568ebae69c7...",\n    "fullName": "Vijay Mishra",\n    "productId": {\n      "_id": "6a19568cbae69c7...",\n      "name": "P3 Indoor Fixed LED Screen",\n      "price": 31300\n    },\n    "status": "new"\n  }\n}`;
doc.y = drawCodeBlock(quoteGetRes, doc.y + 5);

doc.y += 5;
addRouteHeading('Update Quote Lead Status', 'PATCH', '/api/quotes/:id/status', true);
doc.font(fontRegular).fontSize(9.5).text('Updates status and routes assignee variables of a lead.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Update Request Body (JSON):');
const quotePatchBody = `{\n  "status": "contacted",\n  "assignedTo": "Nagpur Corporate Sales Office"\n}`;
doc.y = drawCodeBlock(quotePatchBody, doc.y + 5);

// =========================================================================
// PAGE 8: RENTAL INQUIRIES API
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(18).fillColor(COLOR_PRIMARY).text('5. Rental Inquiries API Reference');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Submit Rental Inquiry', 'POST', '/api/rentals', false);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Submitted by customers looking to hire stage or outdoor screens for temporary events.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Body (JSON):');
const rentalCreateBody = `{\n  "fullName": "Amit Verma",\n  "phone": "+919999999900",\n  "eventType": "Music Concert Backdrop",\n  "eventDate": "2026-10-12",\n  "venueName": "Kasturchand Park",\n  "venueCity": "Nagpur",\n  "durationDays": 4\n}`;
doc.y = drawCodeBlock(rentalCreateBody, doc.y + 5);

doc.y += 5;
addRouteHeading('Get All Rental Inquiries', 'GET', '/api/rentals', true);
doc.font(fontRegular).fontSize(9.5).text('List of event rental inquiries.', 50, doc.y + 5);

doc.y += 10;
addRouteHeading('Update Rental Status', 'PATCH', '/api/rentals/:id/status', true);
doc.font(fontRegular).fontSize(9.5).text('Confirms or completes a rental inquiry status log.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Status Update Payload:');
const rentalPatchBody = `{\n  "status": "confirmed"\n}`;
doc.y = drawCodeBlock(rentalPatchBody, doc.y + 5);

// =========================================================================
// PAGE 9: INTERACTIVE SPECS API
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(18).fillColor(COLOR_PRIMARY).text('6. Pixel Pitch Specifications API Reference');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Get All Pitch Specs', 'GET', '/api/specs', false);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Retrieve all hardware specs (P1.5 to P10.0) to load interactive specs slider grids.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Response (200 OK):');
const specListRes = `{\n  "success": true,\n  "count": 8,\n  "data": [\n    {\n      "pitch": "P1.5",\n      "type": "indoor",\n      "label": "LIBERAL Ultra-Fine P1.5",\n      "optimalViewingDistanceMin": 1.5,\n      "optimalViewingDistanceMax": 15,\n      "refreshRate": "≥ 3,840 Hz",\n      "maxPowerPerSqm": 650,\n      "avgPowerPerSqm": 210,\n      "cabinetDimensions": "600mm x 337.5mm x 45mm",\n      "pixelDensityPerSqm": 444444\n    },\n    ...\n  ]\n}`;
doc.y = drawCodeBlock(specListRes, doc.y + 5);

doc.y += 5;
addRouteHeading('Get Spec by Pitch Code', 'GET', '/api/specs/:pitch', false);
doc.font(fontRegular).fontSize(9.5).text('Retrieve detailed technical specs by pitch string.', 50, doc.y + 5);

// =========================================================================
// PAGE 10: CASE STUDIES API
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(18).fillColor(COLOR_PRIMARY).text('7. Case Studies Portfolio API Reference');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Get All Case Studies', 'GET', '/api/case-studies', false);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Lists completed display projects, resolving related model links.', 50, doc.y + 5);

doc.y += 10;
addRouteHeading('Get Case Study by ID', 'GET', '/api/case-studies/:id', false);
doc.font(fontRegular).fontSize(9.5).text('Retrieves narrative logs for a specific client installation.', 50, doc.y + 5);

doc.y += 15;
addRouteHeading('Create Case Study', 'POST', '/api/case-studies', true);
doc.font(fontRegular).fontSize(9.5).text('Uploads a new installation showcase item.', 50, doc.y + 5);

doc.y += 15;
doc.font(fontBold).fontSize(9.5).text('Sample Request Payload (JSON):');
const caseCreateBody = `{\n  "title": "Vidarbha Mall Grand Atrium Installation",\n  "clientName": "Vidarbha Mall Developers",\n  "location": "Nagpur",\n  "category": "retail",\n  "screenArea": "450 sq ft",\n  "challenge": "Architectural structural constraints...",\n  "solution": "Deployed P3 ultra-slim fixed indoor screen...",\n  "outcome": "Incredible footfall engagement...",\n  "images": ["https://images.unsplash.com/photo-1497366216548-37526070297c"]\n}`;
doc.y = drawCodeBlock(caseCreateBody, doc.y + 5);

// =========================================================================
// PAGE 11: ROOT DIRECTORY INFO
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(18).fillColor(COLOR_PRIMARY).text('8. Root Directory Information');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
addRouteHeading('Welcome Gateway Info', 'GET', '/', false);
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('API Base service entry containing server status and Liberal Systems organizational identification properties.', 50, doc.y + 5);

doc.y += 20;
doc.font(fontBold).fontSize(9.5).text('Gateway Server Response (200 OK):');
const rootResponse = `{
  "success": true,
  "message": "Welcome to Liberal Systems LED Display Backend API",
  "version": "1.0.0",
  "meta": {
    "company": "Liberal Systems Private Limited",
    "gst": "27AADCL2182N1Z6",
    "contact": "07942817759 | sales@liberalled.com",
    "address": "M.I.D.C Industrial Area, Nagpur, Maharashtra - 440016"
  }
}`;
doc.y = drawCodeBlock(rootResponse, doc.y + 5);

// =========================================================================
// PAGE 12: ERROR CODES & CODES GLOSSARY
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(18).fillColor(COLOR_PRIMARY).text('9. Error Codes & Troubleshooting Reference');
doc.y += 10;
drawDivider(doc.y);

doc.y += 15;
doc.font(fontRegular).fontSize(9.5).fillColor(COLOR_TEXT).text('Use this status glossary to resolve connection errors, validation rejections, or rate limits when integrating with frontend UI modules.', { lineGap: 3 });

doc.y += 20;
doc.font(fontBold).fontSize(10).text('HTTP Code', 50, doc.y)
   .text('Meaning', 150, doc.y - 12)
   .text('Common Cause', 280, doc.y - 12);
doc.y += 5;
drawDivider(doc.y);

const tableRows = [
  { code: '200 OK', meaning: 'Success', cause: 'Query completed successfully.' },
  { code: '201 Created', meaning: 'Resource Created', cause: 'Product, admin user, or lead registered.' },
  { code: '400 Bad Request', meaning: 'Validation Error', cause: 'Required fields missing, short password, or duplicate username.' },
  { code: '401 Unauthorized', meaning: 'Auth Failure', cause: 'JWT missing or invalid Bearer authorization header.' },
  { code: '404 Not Found', meaning: 'Missing Route/ID', cause: 'ID does not exist or API path is wrong.' },
  { code: '429 Too Many Req', meaning: 'Rate Limited', cause: 'Exceeded form submission limits (10 submissions/15 mins per IP).' },
  { code: '500 Server Err', meaning: 'Database Error', cause: 'MongoDB connection dropped or server code exception.' }
];

doc.font(fontRegular).fontSize(9);
tableRows.forEach(row => {
  doc.y += 10;
  doc.font(fontBold).text(row.code, 50, doc.y)
     .font(fontRegular).text(row.meaning, 150, doc.y - 12)
     .text(row.cause, 280, doc.y - 12);
  doc.y += 10;
  drawDivider(doc.y);
});

// Finalize page numbering across document buffer
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  if (i > 0) {
    doc.fillColor(COLOR_MUTED)
       .font(fontRegular)
       .fontSize(8)
       .text(`Page ${i + 1} of ${range.count}`, 50, 790, { align: 'right' });
  }
}

doc.end();

stream.on('finish', () => {
  console.log('[PDF Generator] Successfully compiled full documentation API report.');
  process.exit(0);
});
stream.on('error', (err) => {
  console.error('[PDF Generator] Compile failed with error:', err.message);
  process.exit(1);
});
