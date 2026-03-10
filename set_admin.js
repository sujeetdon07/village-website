require('dotenv').config();
const mongoose = require('mongoose');
const Resident = require('./models/Resident');

async function setAdmin() {
  try {
    const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/villageDB';
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'sujeetpatahari@gmail.com';
    let user = await Resident.findOne({ $or: [{ email: email }, { mobile: '9473383137' }] });

    if (user) {
      user.isAdmin = true;
      user.email = email; // Ensure email is set
      await user.save();
      console.log(`✅ User ${user.mobile} / ${email} updated to Admin.`);
    } else {
      console.log(`❌ User not found. Creating a new admin user...`);
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('Sujeet@6461', 10);
      
      const admin = new Resident({
        name: 'Sujeet Kumar',
        email: email,
        mobile: '9473383137',
        aadhaar: '523864615522', // Placeholder Aadhaar (valid 12 digits)
        passwordHash: hash,
        isAdmin: true,
        detailsCompleted: true,
        birthYear: '1995', // Placeholder
        dateOfBirth: new Date('1995-01-01') // Placeholder
      });
      
      await admin.save();
      console.log(`✅ Admin user created: mobile=9473383137 email=${email} password=Sujeet@6461`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating admin:', err);
    process.exit(1);
  }
}

setAdmin();
