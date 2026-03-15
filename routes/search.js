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
    const query = (req.query.q || '').trim();
    if (!query) {
      return res.json({ message: 'Please provide a name or mobile to search' });
    }

    // Advanced search: check name, mobile, fatherName, ward, village
    // Using simple regex for partial matching (fuzzy-ish)
    const regex = new RegExp(query, 'i');
    
    // Search residents across multiple fields
    const residents = await Resident.find({
      $or: [
        { name: regex },
        { mobile: regex },
        { fatherName: regex },
        { ward: regex },
        { village: regex }
      ]
    }).select('name fatherName mobile fatherMobile ward village gender');

    // Search important contacts (name or mobile)
    const contacts = await ImportantContact.find({
      $or: [
        { name: regex },
        { mobile: regex }
      ]
    }).select('name mobile category');

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
