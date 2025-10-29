require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import your Resident model
const Resident = require('./models/Resident'); // adjust path if needed

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true
    });
    console.log('✅ Connected to MongoDB');

    const adminExists = await Resident.findOne({ email: 'sujeetpatahari@gmail.com' });
    if (adminExists) {
      console.log('⚠️ Admin already exists');
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash('Sujeet@6461', 10);

    const admin = new Resident({
      name: 'Admin',
      email: 'sujeetpatahari@gmail.com',
      mobile: '9473383137',
      aadhaar: '646155225238',
      passwordHash,
      fatherName: 'Sujeet Kumar',
      fatherMobile: '1234567890',
      ward: '1',
      panchayat: 'Patarhi Panchayat',
      village: 'Patarhi',
      isAdmin: true,
      detailsCompleted: true,
      createdAt: new Date()
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
