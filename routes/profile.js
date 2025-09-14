const express = require('express');
const Resident = require('../models/Resident');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();

// Enter Details
router.get('/enter-details', requireLogin, async (req, res) => {
  const resident = await Resident.findById(req.session.user.id);
  res.render('enter-details', { resident });
});

router.post('/enter-details', requireLogin, async (req, res) => {
  try {
    const { fatherName, grandfatherName, fatherMobile, ward, village } = req.body;
    if (!fatherName || !grandfatherName || !fatherMobile || !ward)
      return res.send('Please fill all fields');
    if (!/^\d{10}$/.test(fatherMobile)) return res.send('Father mobile must be 10 digits');

    await Resident.findByIdAndUpdate(req.session.user.id, {
      fatherName, grandfatherName, fatherMobile, ward, village, detailsCompleted: true
    });
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.send('Error saving details');
  }
});

// Profile
router.get('/profile', requireLogin, async (req, res) => {
  const resident = await Resident.findById(req.session.user.id);
  res.render('profile', { resident });
});

module.exports = router;
