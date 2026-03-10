const express = require('express');
const Resident = require('../models/Resident');
const ImportantContact = require('../models/ImportantContact');
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
    
    // Search residents
    const residents = await Resident.find({ name: { $regex: regex } })
      .select('name fatherName mobile fatherMobile ward village gender');

    // Search important contacts
    const contacts = await ImportantContact.find({ name: { $regex: regex } })
      .select('name mobile category');

    if (residents.length === 0 && contacts.length === 0) {
      return res.json({ message: 'No details found' });
    }

    // Format residents
    const formattedResidents = residents.map(u => {
      // Mask only the resident's own mobile for female residents - show only last 4 digits
      // Father/Husband mobile is always shown in full
      const maskMobile = (mobile) => {
        if (!mobile || mobile === '-') return '-';
        if (u.gender === 'Female' && mobile.length === 10) {
          return '******' + mobile.slice(-4);
        }
        return mobile;
      };

      return {
        type: 'resident',
        name: u.name,
        fatherName: u.fatherName || '-',
        mobile: maskMobile(u.mobile), // Mask if female
        fatherMobile: u.fatherMobile || '-', // Always show full number
        ward: u.ward || '-',
        village: u.village || '-'
      };
    });

    // Format important contacts
    const formattedContacts = contacts.map(c => ({
      type: 'contact',
      name: c.name,
      mobile: c.mobile,
      category: c.category
    }));

    // Combine both results
    const allResults = [...formattedContacts, ...formattedResidents];

    res.json({ data: allResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
