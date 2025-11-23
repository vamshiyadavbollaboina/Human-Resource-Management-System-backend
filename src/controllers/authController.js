// backend/src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// FIXED: Correct models path
const db = require('../db');
const { User, Employee, Team, Organisation, Log } = db;


const { createLog } = require('../services/LogService');

// Utility to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, orgId: user.organisation_id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Register a new Organisation and the first Admin User
 */
exports.register = async (req, res) => {
  const { name, email, password, orgName } = req.body;

  if (!name || !email || !password || !orgName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const t = await db.sequelize.transaction();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res
        .status(409)
        .json({ message: 'User with this email already exists.' });
    }

    // Create Organisation
    const organisation = await Organisation.create(
      { name: orgName },
      { transaction: t }
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin User
    const user = await User.create(
      {
        name,
        email,
        password_hash: hashedPassword,
        organisation_id: organisation.id
      },
      { transaction: t }
    );

    // Commit transaction
    await t.commit();

    // Logs
    await createLog(
      organisation.id,
      user.id,
      'organisation_created',
      { orgId: organisation.id, orgName: organisation.name }
    );

    await createLog(organisation.id, user.id, 'user_registered', {
      userId: user.id
    });

    res
      .status(201)
      .json({ message: 'Organization and Admin registered successfully. Please log in.' });

  } catch (error) {
    await t.rollback();

    console.error('*** REGISTRATION ERROR ***');
    console.error(error);

    res.status(500).json({
      message: 'Server error during registration. Check backend logs.'
    });
  }
};

/**
 * Authenticate User and return JWT
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Organisation, attributes: ['name'] }] // works ONLY after fixing models import
    });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgName: user.Organisation.name,
        orgId: user.organisation_id
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Get current logged user
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.userId },
      attributes: ['id', 'name', 'email', 'organisation_id'],
      include: [{ model: Organisation, attributes: ['name'] }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      orgName: user.Organisation.name,
      orgId: user.organisation_id
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error fetching user details' });
  }
};
