const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, default: '' },
  aadhaar: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  birthYear: { type: String, required: true },

  gender: { type: String, enum: ['Male', 'Female', ''], default: '' },
  fatherName: { type: String, default: '' }, // Father's Name/Husband's Name
  fatherMobile: { 
    type: String, 
    default: '', 
    match: [/^\d{10}$/, 'Father/Husband mobile must be 10 digits'] 
  },
  ward: { type: String, enum: ['1', '2', '3', ''], default: '' },
  panchayat: { type: String, default: 'Patarhi Panchayat' },
  village: { type: String, default: '' },

  isAdmin: { type: Boolean, default: false },
  detailsCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Resident', residentSchema);
