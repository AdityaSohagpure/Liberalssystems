const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Colors
const COLOR_PRIMARY = '#1A202C'; // Deep Slate
const COLOR_ACCENT = '#C0A060';  // Muted Gold
const COLOR_TEXT = '#2D3748';    // Dark Slate
const COLOR_MUTED = '#718096';   // Muted Gray
const COLOR_BG_CODE = '#F7FAFC'; // Light Gray BG for Code Blocks
const COLOR_BORDER = '#E2E8F0';  // Light Border

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true
});

const reportPath = path.join(__dirname, 'Liberal_Systems_Product_API_Report.pdf');
const stream = fs.createWriteStream(reportPath);
doc.pipe(stream);

// Register standard fonts
const fontRegular = 'Helvetica';
const fontBold = 'Helvetica-Bold';
const fontMono = 'Courier';

// Helper to draw horizontal lines
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
  const height = lines.length * 12 + 16;
  
  // Check page overflow
  if (startY + height > 780) {
    doc.addPage();
    startY = 50;
  }
  
  // Background rect
  doc.fillColor(COLOR_BG_CODE)
     .rect(50, startY, 495, height)
     .fill();
     
  // Border rect
  doc.strokeColor(COLOR_BORDER)
     .lineWidth(0.5)
     .rect(50, startY, 495, height)
     .stroke();
     
  // Code text
  doc.fillColor('#1A202C')
     .font(fontMono)
     .fontSize(9.5);
     
  let currentY = startY + 8;
  lines.forEach(line => {
    doc.text(line, 60, currentY);
    currentY += 12;
  });
  
  return startY + height + 15;
}

// Helper for section headings
function addSectionHeading(title, method, url) {
  doc.font(fontBold).fontSize(16).fillColor(COLOR_PRIMARY).text(title);
  const currentY = doc.y;
  
  // Draw Method badge
  const isGet = method.toUpperCase() === 'GET';
  const isPost = method.toUpperCase() === 'POST';
  const isPut = method.toUpperCase() === 'PUT';
  const badgeColor = isGet ? '#3182CE' : isPost ? '#38A169' : isPut ? '#DD6B20' : '#E53E3E';
  
  doc.fillColor(badgeColor)
     .rect(50, currentY + 6, 50, 16)
     .fill();
     
  doc.fillColor('#FFFFFF')
     .font(fontBold)
     .fontSize(9)
     .text(method.toUpperCase(), 50, currentY + 10, { width: 50, align: 'center' });
     
  doc.fillColor(COLOR_TEXT)
     .font(fontMono)
     .fontSize(11)
     .text(url, 110, currentY + 9);
     
  doc.y = currentY + 30;
}

// =========================================================================
// PAGE 1: TITLE PAGE
// =========================================================================
// Background accent stripe on left
doc.fillColor(COLOR_PRIMARY)
   .rect(0, 0, 15, 842)
   .fill();

doc.fillColor(COLOR_ACCENT)
   .rect(15, 0, 5, 842)
   .fill();

// Title content
doc.y = 150;
doc.fillColor(COLOR_PRIMARY)
   .font(fontBold)
   .fontSize(32)
   .text('LIBERAL SYSTEMS', 50, doc.y)
   .fillColor(COLOR_ACCENT)
   .text('PRIVATE LIMITED', 50, doc.y - 5);

doc.y += 20;
doc.fillColor(COLOR_TEXT)
   .font(fontRegular)
   .fontSize(16)
   .text('Product API Documentation & Reference Manual');

doc.y += 40;
drawDivider(doc.y);

// Metadata Block
doc.y += 20;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('COMPANY DETAILS:');
doc.font(fontRegular).fillColor(COLOR_TEXT).fontSize(10);
doc.text('GST Identification Number: 27AADCL2182N1Z6', 50, doc.y + 5);
doc.text('Contact Hotline: 07942817759 | Email: sales@liberalled.com', 50, doc.y + 20);
doc.text('Factory Address: M.I.D.C Industrial Area, Nagpur, Maharashtra - 440016', 50, doc.y + 35);

doc.y += 80;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('REPORT SPECIFICATIONS:');
doc.font(fontRegular).fillColor(COLOR_TEXT).fontSize(10);
doc.text('Document Type: API Technical Reference Manual', 50, doc.y + 5);
doc.text('Target Scope: LED Display & Screen Catalog Management', 50, doc.y + 20);
doc.text(`Generated Date: ${new Date().toLocaleDateString('en-IN')}`, 50, doc.y + 35);
doc.text('Environment: Development / Staging Reference', 50, doc.y + 50);

// Footer
doc.fontSize(9)
   .fillColor(COLOR_MUTED)
   .text('© 2026 Liberal Systems Private Limited. Confidential Document.', 50, 750, { align: 'left' });

// =========================================================================
// PAGE 2: TABLE OF CONTENTS & OVERVIEW
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(20).fillColor(COLOR_PRIMARY).text('Table of Contents');
doc.y += 10;
drawDivider(doc.y);

doc.y += 20;
doc.font(fontRegular).fontSize(11).fillColor(COLOR_TEXT);

const tocItems = [
  { page: 2, section: '1. API Overview & Design Systems' },
  { page: 3, section: '2. Endpoint Reference: GET /api/products' },
  { page: 4, section: '3. Endpoint Reference: GET /api/products/:id' },
  { page: 5, section: '4. Endpoint Reference: POST /api/products (Admin)' },
  { page: 6, section: '5. Endpoint Reference: PUT /api/products/:id (Admin)' },
  { page: 7, section: '6. Endpoint Reference: DELETE /api/products/:id (Admin)' },
  { page: 8, section: '7. Troubleshooting & Response Code Matrices' }
];

tocItems.forEach(item => {
  doc.text(item.section, 50, doc.y);
  doc.text(item.page.toString(), 520, doc.y - 12, { align: 'right' });
  doc.y += 10;
});

doc.y += 30;
doc.font(fontBold).fontSize(14).fillColor(COLOR_PRIMARY).text('1. API Overview & Design Systems');
doc.y += 8;
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT)
   .text('The Liberal Systems Product API is a RESTful backend interface structured to power web catalogs, interactive price estimation sheets, and internal administrative dashboards. All data exchanges are formatted as JSON payloads. Admin routing protection is enforced using JWT Bearer headers.', { lineGap: 4 });

doc.y += 15;
doc.font(fontBold).text('Base Service Address:');
doc.font(fontMono).fontSize(10).text('http://localhost:5000', 50, doc.y + 4);

doc.y += 20;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Standard Security Headers Enforced:');
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT);
doc.text('• Authorization: Bearer <JWT_TOKEN>', 60, doc.y + 5);
doc.text('• Content-Type: application/json', 60, doc.y + 18);
doc.text('• Helmet Security Policies (XSS Protection, HSTS, No-Sniff)', 60, doc.y + 31);

// =========================================================================
// PAGE 3: GET ALL PRODUCTS
// =========================================================================
doc.addPage();
doc.y = 50;
addSectionHeading('2. Get All Products', 'GET', '/api/products');

doc.y += 15;
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT)
   .text('Fetches list of all active (non-deleted) products in the catalog. Includes support for pagination, search, price ranges, and category filters.', { lineGap: 3 });

doc.y += 15;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Query Parameters:');
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT);
doc.text('• category: Filter by category (indoor, outdoor, transparent, mobile-advertising)', 60, doc.y + 5);
doc.text('• minPrice: Minimum price filter in INR', 60, doc.y + 18);
doc.text('• maxPrice: Maximum price filter in INR', 60, doc.y + 31);
doc.text('• inStock: Filter by stock status (true or false)', 60, doc.y + 44);
doc.text('• search: Keyword search against product name or type', 60, doc.y + 57);

doc.y += 75;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Sample Success Response (200 OK):');

const getResponse = `{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6a19568cbae69c7c4d5f82fb",
      "name": "Outdoor Building LED Display Screen",
      "category": "outdoor",
      "type": "OUTDOOR HIGH-BRIGHT",
      "price": 5500,
      "priceUnit": "sq_ft",
      "brightness": "> 6,500 Nits",
      "cabinetType": "IP65 Waterproof Aluminum",
      "pixelPitchOptions": ["P4", "P5", "P6", "P8", "P10"],
      "refreshRate": "3,840 Hz",
      "cabinetDimensions": "960mm x 960mm x 120mm",
      "powerConsumption": "Avg 280W/sqm, Max 750W/sqm",
      "images": ["https://images.unsplash.com/photo-1542744094-3a31f103e35f"],
      "inStock": true,
      "createdAt": "2026-05-29T10:18:14.000Z"
    }
  ]
}`;

doc.y = drawCodeBlock(getResponse, doc.y + 5);

// =========================================================================
// PAGE 4: GET SINGLE PRODUCT
// =========================================================================
doc.addPage();
doc.y = 50;
addSectionHeading('3. Get Single Product', 'GET', '/api/products/:id');

doc.y += 15;
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT)
   .text('Fetch complete metadata, description, and spec sheets of a single product utilizing its MongoDB object ID.', { lineGap: 3 });

doc.y += 15;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Route Parameters:');
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT);
doc.text('• id (Required): The unique 24-character hexadecimal MongoDB ID of the product.', 60, doc.y + 5);

doc.y += 25;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Sample Success Response (200 OK):');

const singleResponse = `{
  "success": true,
  "data": {
    "_id": "6a19568cbae69c7c4d5f82fb",
    "name": "P3 Indoor Fixed LED Screen",
    "category": "indoor",
    "price": 31300,
    "priceUnit": "piece",
    "inStock": true,
    ...
  }
}`;

doc.y = drawCodeBlock(singleResponse, doc.y + 5);

doc.y += 10;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Sample Failure Response (404 Not Found):');
const notFoundResponse = `{
  "success": false,
  "error": "Product not found"
}`;
doc.y = drawCodeBlock(notFoundResponse, doc.y + 5);

// =========================================================================
// PAGE 5: CREATE PRODUCT
// =========================================================================
doc.addPage();
doc.y = 50;
addSectionHeading('4. Create Product (Admin Only)', 'POST', '/api/products');

doc.y += 15;
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT)
   .text('Registers a new LED panel configuration. Requires an admin JWT Bearer token.', { lineGap: 3 });

doc.y += 15;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Headers Required:');
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT);
doc.text('• Authorization: Bearer <admin_jwt_token>', 60, doc.y + 5);
doc.text('• Content-Type: application/json', 60, doc.y + 18);

doc.y += 35;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Required Body Parameters:');
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT);
doc.text('• name: String (e.g. "P2 Indoor Screen")', 60, doc.y + 5);
doc.text('• category: String (enum: indoor, outdoor, transparent, mobile-advertising)', 60, doc.y + 18);
doc.text('• price: Number (e.g. 25000)', 60, doc.y + 31);
doc.text('• priceUnit: String (enum: sq_ft, piece)', 60, doc.y + 44);

doc.y += 60;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Sample Request Body (JSON):');

const createBody = `{
  "name": "Liberal Glass-Facade P3.8 LED",
  "category": "transparent",
  "type": "TRANSPARENT SYSTEM",
  "price": 10000,
  "priceUnit": "sq_ft",
  "pixelPitchOptions": ["P3.8"],
  "transparency": "70%"
}`;

doc.y = drawCodeBlock(createBody, doc.y + 5);

// =========================================================================
// PAGE 6: UPDATE PRODUCT
// =========================================================================
doc.addPage();
doc.y = 50;
addSectionHeading('5. Update Product (Admin Only)', 'PUT', '/api/products/:id');

doc.y += 15;
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT)
   .text('Update fields of an existing product. Only send fields you wish to modify. Fields are validated by Mongoose schemas.', { lineGap: 3 });

doc.y += 15;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Headers Required:');
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT);
doc.text('• Authorization: Bearer <admin_jwt_token>', 60, doc.y + 5);

doc.y += 30;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Sample Request Body (Updating stock and price):');
const updateBody = `{
  "price": 9500,
  "inStock": false
}`;
doc.y = drawCodeBlock(updateBody, doc.y + 5);

doc.y += 10;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Sample Success Response (200 OK):');
const updateResponse = `{
  "success": true,
  "data": {
    "_id": "6a19568cbae69c7c4d5f82fb",
    "name": "Liberal Glass-Facade P3.8 LED",
    "category": "transparent",
    "price": 9500,
    "priceUnit": "sq_ft",
    "inStock": false
  }
}`;
doc.y = drawCodeBlock(updateResponse, doc.y + 5);

// =========================================================================
// PAGE 7: DELETE PRODUCT
// =========================================================================
doc.addPage();
doc.y = 50;
addSectionHeading('6. Soft Delete Product (Admin Only)', 'DELETE', '/api/products/:id');

doc.y += 15;
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT)
   .text('Performs a soft delete on a product. The product is kept in the database for log referencing (e.g. quote records) but is filtered out of all public GET product catalogs.', { lineGap: 3 });

doc.y += 15;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Headers Required:');
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT);
doc.text('• Authorization: Bearer <admin_jwt_token>', 60, doc.y + 5);

doc.y += 35;
doc.font(fontBold).fontSize(11).fillColor(COLOR_PRIMARY).text('Sample Success Response (200 OK):');
const deleteResponse = `{
  "success": true,
  "message": "Product deleted successfully (soft delete)"
}`;
doc.y = drawCodeBlock(deleteResponse, doc.y + 5);

// =========================================================================
// PAGE 8: ERROR CODES & SUMMARY
// =========================================================================
doc.addPage();
doc.y = 50;
doc.font(fontBold).fontSize(16).fillColor(COLOR_PRIMARY).text('7. Troubleshooting & Response Code Matrices');
doc.y += 10;
drawDivider(doc.y);

doc.y += 20;
doc.font(fontRegular).fontSize(10).fillColor(COLOR_TEXT)
   .text('The API returns standard HTTP status codes combined with structured JSON objects indicating details of success or failure. Use the table below as a guide to debug connectivity problems.', { lineGap: 3 });

// Simple grid/table helper
doc.y += 20;
doc.font(fontBold).fontSize(10).text('HTTP Code', 50, doc.y)
   .text('Meaning', 150, doc.y - 12)
   .text('Common Cause', 280, doc.y - 12);
doc.y += 5;
drawDivider(doc.y);

const tableRows = [
  { code: '200 OK', meaning: 'Success', cause: 'Query completed successfully.' },
  { code: '201 Created', meaning: 'Resource Created', cause: 'Product or lead successfully registered.' },
  { code: '400 Bad Request', meaning: 'Validation Error', cause: 'Missing required fields or malformed JSON body.' },
  { code: '401 Unauthorized', meaning: 'Auth Failure', cause: 'JWT missing or invalid Bearer header.' },
  { code: '404 Not Found', meaning: 'Missing Route/ID', cause: 'ID does not exist or route endpoint is wrong.' },
  { code: '429 Too Many Req', meaning: 'Rate Limited', cause: 'Exceeded form submission limits (public routes).' },
  { code: '500 Server Err', meaning: 'Database Error', cause: 'Mongoose connectivity dropped or unhandled exception.' }
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

// Finalize document page numbers dynamically
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  // Footer page numbers (Skip page 1/Title page)
  if (i > 0) {
    doc.fillColor(COLOR_MUTED)
       .font(fontRegular)
       .fontSize(8)
       .text(`Page ${i + 1} of ${range.count}`, 50, 790, { align: 'right' });
  }
}

doc.end();

stream.on('finish', () => {
  console.log('[PDF Generator] Successfully compiled premium PDF API report.');
  process.exit(0);
});
stream.on('error', (err) => {
  console.error('[PDF Generator] Compile failed with error:', err.message);
  process.exit(1);
});
