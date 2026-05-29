const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Product = require('../models/Product');
const PixelPitchSpec = require('../models/PixelPitchSpec');
const Admin = require('../models/Admin');

const { seedProducts } = require('./seedProducts');
const { seedSpecs } = require('./seedSpecs');

// Master seeding function
const runSeeder = async () => {
  try {
    console.log('====================================================');
    console.log('[Seed] Starting Liberal Systems Database Seeding...');
    console.log('====================================================');

    // 1. Seed Products
    await seedProducts();

    // 2. Seed Specs
    await seedSpecs();

    // 3. Seed Default Admin User
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const username = (process.env.INITIAL_ADMIN_USERNAME || 'admin').toLowerCase();
      const rawPassword = process.env.INITIAL_ADMIN_PASSWORD || 'LiberalAdmin2026!';

      console.log(`[Seed] Creating default admin user: '${username}'...`);
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);

      await Admin.create({
        username,
        password: hashedPassword
      });

      console.log('[Seed] Default admin account created successfully.');
      console.log(`[Seed] Username: ${username}`);
      console.log(`[Seed] Password: ${rawPassword} (Please change this in production!)`);
    } else {
      console.log('[Seed] Admin account(s) already exist in database, skipping admin seed.');
    }

    console.log('====================================================');
    console.log('[Seed] Database seeding completed successfully!');
    console.log('====================================================');
    return true;
  } catch (error) {
    console.error('[Seed] Master seeder failed with error:', error.message);
    throw error;
  }
};

// Check if run directly from CLI (e.g. node src/seed/seed.js)
if (require.main === module) {
  const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/liberal_db';
  console.log(`[Seed] Directly invoked. Connecting to MongoDB at: ${dbUri}`);
  
  mongoose.connect(dbUri)
    .then(async () => {
      await runSeeder();
      await mongoose.disconnect();
      console.log('[Seed] Disconnected from MongoDB. Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Database connection error during seed:', err.message);
      process.exit(1);
    });
}

module.exports = { runSeeder };
