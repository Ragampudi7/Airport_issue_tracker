'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');
const crypto = require('crypto');

const router = express.Router();

function signToken(user) {
  const payload = { sub: user._id, role: user.role, name: user.name, email: user.email, staffId: user.staffId };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await User.hashPassword(password);
    let staffId;
    if (role === 'staff') {
      const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
      staffId = 'STF-' + rnd;
    }
    const user = await User.create({ name, email, passwordHash, role: role === 'staff' ? 'staff' : 'customer', staffId });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, staffId: user.staffId } });
  } catch (err) {
    res.status(400).json({ message: 'Failed to register', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, staffId: user.staffId } });
  } catch (err) {
    res.status(400).json({ message: 'Failed to login', error: err.message });
  }
});

// Request password reset
router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If that email exists, we sent a link' });
    user.resetToken = crypto.randomBytes(24).toString('hex');
    user.resetTokenExpiresAt = new Date(Date.now() + 1000*60*30);
    await user.save();
    const base = process.env.PUBLIC_BASE_URL || ('http://localhost:' + (process.env.PORT || 3000));
    const resetUrl = `${base}/#reset/${user.resetToken}`;
    await sendMail(user.email, 'Reset your password', `Reset link: ${resetUrl}`);
    res.json({ message: 'If that email exists, we sent a link' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to request reset', error: err.message });
  }
});

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ resetToken: token, resetTokenExpiresAt: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.passwordHash = await User.hashPassword(password);
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to reset', error: err.message });
  }
});

module.exports = router;


