const mongoose = require('mongoose');

// =========================================================================
// MONGOOSE IN-MEMORY MOCK ENGINE
// =========================================================================
const db = {
  Product: [],
  QuoteRequest: [],
  RentalInquiry: [],
  PixelPitchSpec: [],
  CaseStudy: [],
  Admin: []
};

// Helper to match queries
function filterDocs(modelName, query) {
  let list = db[modelName];
  if (!query) return list;
  
  return list.filter(doc => {
    for (const key in query) {
      const val = query[key];
      
      // Handle soft delete filter: isDeleted: { $ne: true }
      if (key === 'isDeleted') {
        const isDeleted = doc.isDeleted || false;
        if (val && val.$ne === true) {
          if (isDeleted === true) return false;
        } else if (val === true) {
          if (isDeleted !== true) return false;
        }
      } 
      // Handle ID queries
      else if (key === '_id') {
        if (doc._id.toString() !== val.toString()) return false;
      } 
      // Handle specific fields
      else if (key === 'pitch') {
        if (doc.pitch !== val) return false;
      } else if (key === 'username') {
        if (doc.username !== val) return false;
      } else if (key === 'status') {
        if (doc.status !== val) return false;
      } else if (key === 'category') {
        if (doc.category !== val) return false;
      }
    }
    return true;
  });
}

function createDoc(modelName, data) {
  if (Array.isArray(data)) {
    return data.map(item => createSingleDoc(modelName, item));
  }
  return createSingleDoc(modelName, data);
}

function createSingleDoc(modelName, item) {
  const doc = {
    _id: new mongoose.Types.ObjectId(),
    createdAt: new Date(),
    ...item
  };
  db[modelName].push(doc);
  return doc;
}

function updateDoc(modelName, id, update) {
  const doc = db[modelName].find(d => d._id.toString() === id.toString());
  if (!doc) return null;

  const dataToUpdate = update.$set || update;
  for (const key in dataToUpdate) {
    doc[key] = dataToUpdate[key];
  }
  return doc;
}

class MockQuery {
  constructor(data, modelName) {
    this.data = data;
    this.modelName = modelName;
  }
  
  populate(path) {
    const resolvePopulate = (item) => {
      if (!item) return;
      
      // Populate productId
      if (item.productId && db.Product) {
        const product = db.Product.find(p => p._id.toString() === item.productId.toString());
        if (product) item.productId = { ...product };
      }
      
      // Populate productUsed
      if (item.productUsed && db.Product) {
        const product = db.Product.find(p => p._id.toString() === item.productUsed.toString());
        if (product) item.productUsed = { ...product };
      }
    };

    if (Array.isArray(this.data)) {
      this.data.forEach(resolvePopulate);
    } else {
      resolvePopulate(this.data);
    }
    return this;
  }

  select() {
    return this;
  }

  sort() { return this; }
  
  skip(n) {
    if (Array.isArray(this.data)) {
      this.data = this.data.slice(n);
    }
    return this;
  }

  limit(n) {
    if (Array.isArray(this.data)) {
      this.data = this.data.slice(0, n);
    }
    return this;
  }

  then(onResolve, onReject) {
    return Promise.resolve(this.data).then(onResolve, onReject);
  }
}

// Override connection methods
mongoose.connect = async () => {
  console.log('[MOCK DB] Intercepted mongoose.connect. Initializing in-memory mock database.');
  return { connection: { host: 'mock-in-memory-db' } };
};

mongoose.disconnect = async () => {
  console.log('[MOCK DB] Intercepted mongoose.disconnect.');
  return true;
};

// Override Mongoose model methods
const Product = require('../models/Product');
const QuoteRequest = require('../models/QuoteRequest');
const RentalInquiry = require('../models/RentalInquiry');
const PixelPitchSpec = require('../models/PixelPitchSpec');
const CaseStudy = require('../models/CaseStudy');
const Admin = require('../models/Admin');

const models = [Product, QuoteRequest, RentalInquiry, PixelPitchSpec, CaseStudy, Admin];
models.forEach(model => {
  const name = model.modelName;

  model.countDocuments = async function(query) {
    const list = filterDocs(name, query);
    return list.length;
  };

  model.find = function(query) {
    const list = filterDocs(name, query);
    return new MockQuery(list, name);
  };

  model.findOne = function(query) {
    const list = filterDocs(name, query);
    const item = list.length > 0 ? list[0] : null;
    return new MockQuery(item, name);
  };

  model.findById = function(id) {
    const item = db[name].find(d => d._id.toString() === id.toString()) || null;
    return new MockQuery(item, name);
  };

  model.create = async function(data) {
    return createDoc(name, data);
  };

  model.findByIdAndUpdate = function(id, update, options) {
    const doc = updateDoc(name, id, update);
    return new MockQuery(doc, name);
  };

  model.deleteOne = async function(query) {
    const list = filterDocs(name, query);
    list.forEach(item => {
      const idx = db[name].indexOf(item);
      if (idx !== -1) db[name].splice(idx, 1);
    });
    return { deletedCount: list.length };
  };
});

// =========================================================================
// INTEGRATION TESTS RUNNER
// =========================================================================
const { app, connectDB } = require('../app');

const TEST_PORT = 5001;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

let server;
let adminToken;
let testProduct;
let testQuote;
let testRental;

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ Pass: ${message}`);
}

async function runTests() {
  console.log('\n====================================================');
  console.log('[Test] Starting API Integration Tests (Mock DB)...');
  console.log('====================================================');

  // Connect to the (mocked) database to trigger auto-seeding
  await connectDB();

  // Start Express server
  server = app.listen(TEST_PORT, () => {
    console.log(`[Test] Test server running on port ${TEST_PORT}`);
  });

  // Wait a short moment for database and seeding to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // --- TEST ROOT ---
    console.log('\n--- Testing Root Endpoint ---');
    const rootRes = await fetch(`${BASE_URL}/`);
    assert(rootRes.status === 200, 'Root status is 200');
    const rootData = await rootRes.json();
    assert(rootData.success === true, 'Root response has success: true');
    assert(rootData.meta.company === 'Liberal Systems Private Limited', 'Root response company metadata is correct');

    // --- TEST PRODUCTS ---
    console.log('\n--- Testing Products Endpoints ---');
    const productsRes = await fetch(`${BASE_URL}/api/products`);
    assert(productsRes.status === 200, 'GET /api/products status is 200');
    const productsData = await productsRes.json();
    assert(productsData.success === true, 'GET /api/products success is true');
    assert(productsData.count === 4, `GET /api/products returned ${productsData.count} seeded products`);
    
    testProduct = productsData.data[0];

    // Test product filtering by category
    const filterRes = await fetch(`${BASE_URL}/api/products?category=outdoor`);
    assert(filterRes.status === 200, 'GET /api/products?category=outdoor status is 200');
    const filterData = await filterRes.json();
    const allOutdoor = filterData.data.every(p => p.category === 'outdoor');
    assert(allOutdoor, 'All returned products under category outdoor indeed have category=outdoor');

    // Test single product endpoint
    const singleProductRes = await fetch(`${BASE_URL}/api/products/${testProduct._id}`);
    assert(singleProductRes.status === 200, 'GET /api/products/:id status is 200');
    const singleProductData = await singleProductRes.json();
    assert(singleProductData.data.name === testProduct.name, 'GET /api/products/:id matches name');

    // --- TEST SPECS ---
    console.log('\n--- Testing Pitch Specs Endpoints ---');
    const specsRes = await fetch(`${BASE_URL}/api/specs`);
    assert(specsRes.status === 200, 'GET /api/specs status is 200');
    const specsData = await specsRes.json();
    assert(specsData.count === 8, `GET /api/specs returned ${specsData.count} entries (expecting 8: P1.5 to P10.0)`);

    const singleSpecRes = await fetch(`${BASE_URL}/api/specs/P1.5`);
    assert(singleSpecRes.status === 200, 'GET /api/specs/P1.5 status is 200');
    const singleSpecData = await singleSpecRes.json();
    assert(singleSpecData.data.label === 'LIBERAL Ultra-Fine P1.5', 'GET /api/specs/P1.5 label is correct');

    // --- TEST AUTH ---
    console.log('\n--- Testing Auth Endpoint ---');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'LiberalAdmin2026!'
      })
    });
    assert(loginRes.status === 200, 'POST /api/auth/login status is 200 with default credentials');
    const loginData = await loginRes.json();
    assert(loginData.success === true, 'Login success is true');
    assert(!!loginData.token, 'Login returned a token');
    adminToken = loginData.token;

    // Unauthorized endpoint access checks
    console.log('\n--- Testing Authorization Protection ---');
    const unauthQuotesRes = await fetch(`${BASE_URL}/api/quotes`);
    assert(unauthQuotesRes.status === 401, 'GET /api/quotes without token returns 401');

    const authQuotesRes = await fetch(`${BASE_URL}/api/quotes`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(authQuotesRes.status === 200, 'GET /api/quotes with token returns 200');

    // --- TEST LEADS INGESTION ---
    console.log('\n--- Testing Leads Submission & Handling ---');
    
    // Submit Quote Request
    const submitQuoteRes = await fetch(`${BASE_URL}/api/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Nagpur Staging Co.',
        companyName: 'Nagpur Events Corp',
        projectType: 'events',
        phoneNumber: '+919999999999',
        email: 'nagpur@events.com',
        pixelPitchPreference: 'P2.5',
        screenAreaSqFt: 500,
        productId: testProduct._id,
        additionalNotes: 'Urgent event setup needed.'
      })
    });
    assert(submitQuoteRes.status === 201, 'POST /api/quotes status is 201');
    const submitQuoteData = await submitQuoteRes.json();
    assert(submitQuoteData.success === true, 'Quote creation success is true');
    testQuote = submitQuoteData.data;

    // Submit Rental Inquiry
    const submitRentalRes = await fetch(`${BASE_URL}/api/rentals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Rahul Sharma',
        phone: '+918888888888',
        email: 'rahul@gmail.com',
        eventType: 'Wedding Reception',
        eventDate: new Date('2026-12-15'),
        venueName: 'Radisson Blu Nagpur',
        venueCity: 'Nagpur',
        screenSizeRequired: '12ft x 8ft',
        durationDays: 3,
        message: 'Looking for a bright indoor screen.'
      })
    });
    assert(submitRentalRes.status === 201, 'POST /api/rentals status is 201');
    const submitRentalData = await submitRentalRes.json();
    assert(submitRentalData.success === true, 'Rental creation success is true');
    testRental = submitRentalData.data;

    // Admin updates Quote Status
    const updateQuoteRes = await fetch(`${BASE_URL}/api/quotes/${testQuote._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'contacted',
        assignedTo: 'Sales Team Nagpur'
      })
    });
    assert(updateQuoteRes.status === 200, 'PATCH /api/quotes/:id/status status is 200');
    const updateQuoteData = await updateQuoteRes.json();
    assert(updateQuoteData.data.status === 'contacted', 'Quote status updated to contacted');
    assert(updateQuoteData.data.assignedTo === 'Sales Team Nagpur', 'Quote assignedTo updated');

    // Admin updates Rental Status
    const updateRentalRes = await fetch(`${BASE_URL}/api/rentals/${testRental._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'confirmed'
      })
    });
    assert(updateRentalRes.status === 200, 'PATCH /api/rentals/:id/status status is 200');
    const updateRentalData = await updateRentalRes.json();
    assert(updateRentalData.data.status === 'confirmed', 'Rental status updated to confirmed');

    // --- TEST ADMIN PRODUCT CRUD ---
    console.log('\n--- Testing Product Creation & Soft Deletion ---');
    
    // Admin creates Product
    const newProductRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Temporary Test LED Screen',
        category: 'indoor',
        type: 'TEST SYSTEM',
        price: 15000,
        priceUnit: 'piece',
        pixelPitchOptions: ['P2.5']
      })
    });
    assert(newProductRes.status === 201, 'POST /api/products status is 201');
    const newProductData = await newProductRes.json();
    const createdProduct = newProductData.data;

    // Admin soft-deletes Product
    const deleteProductRes = await fetch(`${BASE_URL}/api/products/${createdProduct._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(deleteProductRes.status === 200, 'DELETE /api/products/:id status is 200');

    // Confirm product is hidden in list
    const checkListRes = await fetch(`${BASE_URL}/api/products`);
    const checkListData = await checkListRes.json();
    const foundDeleted = checkListData.data.find(p => p._id === createdProduct._id);
    assert(!foundDeleted, 'Soft-deleted product is hidden from GET /api/products');

    // --- TEST VALIDATION CHECKS ---
    console.log('\n--- Testing Validation Failures ---');
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '' })
    });
    assert(badLoginRes.status === 400, 'Missing password returns 400 Validation Error');

    const badQuoteRes = await fetch(`${BASE_URL}/api/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: '' })
    });
    assert(badQuoteRes.status === 400, 'Missing phone and empty fullName returns 400 validation error');

    console.log('====================================================');
    console.log('[Test] All Mock Integration Tests Passed Successfully!');
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ Mock test execution failed with error:', err.message);
    console.error(err.stack);
    cleanupAndExit(1);
    return;
  }

  cleanupAndExit(0);
}

function cleanupAndExit(code) {
  if (server) {
    server.close(() => {
      console.log('[Test] Server shut down.');
      console.log('[Test] Exiting test runner process.');
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

runTests();
