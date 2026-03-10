require('dotenv').config();
const mongoose = require('mongoose');
const Resident = require('./models/Resident');

async function setAdmin() {
  try {
    const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/villageDB';
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'sujeetpatahari@gmail.com';
    const result = await Resident.findOneAndUpdate(
      { email: email },
      { isAdmin: true },
      { new: true }
    );

    if (result) {
      console.log(`✅ User ${email} is now an Admin.`);
    } else {
      console.log(`❌ User with email ${email} not found.`);
      // Try searching by mobile if email is not set but you know the user's mobile
      console.log('Attempting to find by mobile 9473383137...');
      const resultByMobile = await Resident.findOneAndUpdate(
        { mobile: '9473383137' },
        { isAdmin: true },
        { new: true }
      );
      if (resultByMobile) {
        console.log(`✅ User with mobile 9473383137 is now an Admin.`);
      } else {
        console.log('❌ User not found by mobile either.');
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating admin:', err);
    process.exit(1);
  }
}

setAdmin();
