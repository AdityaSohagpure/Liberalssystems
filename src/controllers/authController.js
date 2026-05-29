const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'liberal_systems_nagpur_secret_key_2026', {
    expiresIn: '30d' // Token valid for 30 days
  });
};

/**
 * @desc    Authenticate admin user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check for admin user
    const admin = await Admin.findOne({ username: username.toLowerCase() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    // Optional: set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new admin user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const registerAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: username.toLowerCase() });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        error: 'Admin user already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      username: username.toLowerCase(),
      password: hashedPassword
    });

    // Generate token
    const token = generateToken(admin._id);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout admin user (Clear cookie)
 * @route   POST /api/auth/logout
 * @access  Public (client can discard JWT)
 */
const logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
  logoutAdmin
};

