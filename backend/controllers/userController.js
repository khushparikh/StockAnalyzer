const bcrypt = require('bcryptjs');
const User = require('../models/User');
const SessionService = require('../middleware/sessionService');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = await SessionService.createSession(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await SessionService.createSession(user.id);
    await user.update({jwt_token: token})
    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    await SessionService.invalidateSession(req.token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

module.exports = {
  register,
  login,
  logout
};