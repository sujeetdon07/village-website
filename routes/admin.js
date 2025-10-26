const express = require('express');
const Resident = require('../models/Resident');
const Feedback = require('../models/Feedback');
const Gallery = require('../models/Gallery');
const { requireAdmin } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';

// Admin dashboard
router.get('/admin', requireAdmin, async (req, res) => {
  const searchQuery = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Get photos
  const photos = await Gallery.find().sort({ createdAt: -1 });
  
  // Get only 6 latest feedbacks
  const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(6);
  
  // Build search query for residents
  let residentQuery = {};
  if (searchQuery) {
    residentQuery = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { mobile: { $regex: searchQuery, $options: 'i' } },
        { aadhaar: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { village: { $regex: searchQuery, $options: 'i' } },
        { fatherName: { $regex: searchQuery, $options: 'i' } }
      ]
    };
  }

  // Get total count for pagination
  const totalResidents = await Resident.countDocuments(residentQuery);
  const totalPages = Math.ceil(totalResidents / limit);

  // Get residents with pagination, admin always on top
  const residents = await Resident.find(residentQuery)
    .sort({ isAdmin: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.render('admin', { 
    photos, 
    feedbacks, 
    residents, 
    totalResidents,
    currentPage: page,
    totalPages,
    searchQuery
  });
});

// Toggle admin
router.post('/admin/toggle-admin/:id', requireAdmin, async (req, res) => {
  const r = await Resident.findById(req.params.id);
  if (r) {
    r.isAdmin = !r.isAdmin;
    await r.save();
  }
  res.redirect('/admin');
});

// Delete resident
router.post('/admin/delete-resident/:id', requireAdmin, async (req, res) => {
  await Resident.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

// Delete feedback
router.post('/admin/delete-feedback/:id', requireAdmin, async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

module.exports = router;
