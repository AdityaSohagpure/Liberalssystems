const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { runSeeder } = require('./seed/seed');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const productRoutes = require('./routes/products');
const quoteRoutes = require('./routes/quotes');
const rentalRoutes = require('./routes/rentals');
const specRoutes = require('./routes/specs');
const caseStudyRoutes = require('./routes/caseStudies');
const authRoutes = require('./routes/auth');

const app = express();

// Set security headers
app.use(helmet());

// Configure CORS
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000'];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    },
    credentials: true
  })
);

// Logging middleware
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Liberal Systems LED Display Backend API',
    version: '1.0.0',
    meta: {
      company: 'Liberal Systems Private Limited',
      gst: '27AADCL2182N1Z6',
      contact: '07942817759 | sales@liberalled.com',
      address: 'M.I.D.C Industrial Area, Nagpur, Maharashtra - 440016'
    }
  });
});

// Register API Routes
app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/specs', specRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/auth', authRoutes);

// Catch 404 errors (Route not found)
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handler
app.use(errorHandler);

// Database connection logic
const connectDB = async () => {
  const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/liberal_db';
  console.log(`[Database] Attempting connection to MongoDB at: ${dbUri}`);
  
  try {
    const conn = await mongoose.connect(dbUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed database if empty
    await runSeeder();
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    process.exit(1); // Exit process on db failure
  }
};

module.exports = { app, connectDB };
