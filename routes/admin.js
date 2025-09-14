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
  const photos = await Gallery.find().sort({ createdAt: -1 });
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  const residents = await Resident.find().sort({ createdAt: -1 });
  res.render('admin', { photos, feedbacks, residents });
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
