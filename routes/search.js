const express = require('express');
const Resident = require('../models/Resident');
const router = express.Router();

// Render details page
router.get('/details', (req, res) => {
  res.render('details');
});

// API endpoint for search
router.get('/api/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    if (!q) {
      return res.json({ message: 'Please provide a name to search' });
    }

    const regex = new RegExp(`^${q}`, 'i');
    const results = await Resident.find({ name: { $regex: regex } })
      .select('name fatherName grandfatherName mobile fatherMobile ward village gender');

    if (results.length === 0) {
      return res.json({ message: 'No details found' });
    }

    const formatted = results.map(u => {
      // Mask mobile numbers for female residents - show only last 4 digits
      const maskMobile = (mobile) => {
        if (!mobile || mobile === '-') return '-';
        if (u.gender === 'Female' && mobile.length === 10) {
          return '******' + mobile.slice(-4);
        }
        return mobile;
      };

      return {
        name: u.name,
        fatherName: u.fatherName || '-',
        grandfatherName: u.grandfatherName || '-',
        mobile: maskMobile(u.mobile),
        fatherMobile: maskMobile(u.fatherMobile),
        ward: u.ward || '-',
        village: u.village || '-'
      };
    });

    res.json({ data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
