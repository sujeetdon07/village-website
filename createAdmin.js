// createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Resident = require('./models/Resident');

(async ()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const pwd = 'Sujeet@6461'; // change after creation
    const hash = await bcrypt.hash(pwd, 10);
    const admin = new Resident({
      name: 'Admin',
      mobile: '9473383137',
      email: 'sujeetpatahari@gmail.com',
      aadhaar: '523864615522',
      passwordHash: hash,
      isAdmin: true,
      detailsCompleted: true
    });
    await admin.save();
    console.log('Admin created: mobile=9473383137 password=' + pwd);
    process.exit(0);
  } catch (err) {
    console.error('createAdmin err', err);
    process.exit(1);
  }
})();
