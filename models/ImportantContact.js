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
    trim: true
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
  }
}, { timestamps: true });

module.exports = mongoose.model('ImportantContact', importantContactSchema);
