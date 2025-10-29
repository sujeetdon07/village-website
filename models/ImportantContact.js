const mongoose = require('mongoose');

const importantContactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  mobile: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, 'Mobile must be 10 digits']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Police Station',
      'Fire Brigade',
      'Government Official',
      'Doctor',
      'Engineer',
      'Labour',
      'Other'
    ]
  },
  village: {
    type: String,
    default: 'Patarhi'
  }
}, { timestamps: true });

module.exports = mongoose.model('ImportantContact', importantContactSchema);
