// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  mobile: { type: String, default: '' },
  email: { type: String, default: '' },
  aadhaar: { type: String, unique: true, sparse: true }, // unique Aadhaar
  passwordHash: { type: String, required: true },

  // more details (filled on "Enter Your Details" page)
  fatherName: { type: String, default: '' },
  grandfatherName: { type: String, default: '' },
  fatherMobile: { type: String, default: '' },
  ward: { type: String, enum: ['1','2','3',''], default: '' },

  detailsCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Ensure index for aadhaar uniqueness
userSchema.index({ aadhaar: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);
