'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['passenger', 'staff'], default: 'passenger', index: true },
    staffId: { type: String, trim: true },
    department: { type: String, enum: ['cabin_crew', 'sanitation', 'security', 'maintenance'], trim: true },
    phone: { type: String, trim: true },
    resetToken: { type: String },
    resetTokenExpiresAt: { type: Date }
  },
  { timestamps: true }
);

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = mongoose.model('User', UserSchema);


