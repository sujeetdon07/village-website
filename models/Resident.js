const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, default: '' },
  aadhaar: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  fatherName: { type: String, default: '' },
  grandfatherName: { type: String, default: '' },
  fatherMobile: { 
    type: String, 
    default: '', 
    match: [/^\d{10}$/, 'Father mobile must be 10 digits'] 
  },
  ward: { type: String, enum: ['1', '2', '3', ''], default: '' },
  panchayat: { type: String, default: 'Patarhi Panchayat' },
  village: { type: String, default: '' },

  isAdmin: { type: Boolean, default: false },
  detailsCompleted: { type: Boolean, default: false },

  // 🔑 Reset password OTP
  resetOTP: { type: String, default: null },
  resetOTPExpiry: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Resident', residentSchema);
