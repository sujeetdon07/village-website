const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Mobile number must be exactly 10 digits'
    }
  },
  email: { type: String, default: '' },
  aadhaar: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{12}$/.test(v);
      },
      message: 'Aadhaar must be exactly 12 digits'
    }
  },
  passwordHash: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  birthYear: { type: String, required: true },

  gender: { type: String, enum: ['Male', 'Female', ''], default: '' },
  fatherName: { type: String, default: '' }, // Father's Name/Husband's Name
  fatherMobile: { 
    type: String, 
    default: '',
    validate: {
      validator: function(v) {
        return v === '' || /^\d{10}$/.test(v);
      },
      message: 'Father/Husband mobile must be exactly 10 digits'
    }
  },
  ward: { type: String, enum: ['1', '2', '3', ''], default: '' },
  panchayat: { type: String, default: 'Patarhi Panchayat' },
  village: { type: String, default: '' },

  isAdmin: { type: Boolean, default: false },
  detailsCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Resident', residentSchema);
