const express = require('express');
const Resident = require('../models/Resident');
const Feedback = require('../models/Feedback');
const Gallery = require('../models/Gallery');
const ImportantContact = require('../models/ImportantContact');
const { requireAdmin } = require('../middleware/auth');
const { cloudinary, upload } = require('../config/cloudinary');
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
  
  // Get all important contacts
  const importantContacts = await ImportantContact.find().sort({ category: 1, name: 1 });
  
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
    searchQuery,
    importantContacts
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

// Upload photo to Cloudinary
router.post('/admin/upload-photo', requireAdmin, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create gallery entry with Cloudinary URL
    const photo = await Gallery.create({
      filename: req.file.originalname || req.file.filename,
      url: req.file.path, // Cloudinary URL (secure_url or path)
      cloudinaryId: req.file.public_id || req.file.filename // Cloudinary public ID
    });

    res.redirect('/admin');
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Delete photo from Cloudinary and database
router.post('/admin/delete-photo/:id', requireAdmin, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    
    if (photo && photo.cloudinaryId) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(photo.cloudinaryId);
    }
    
    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);
    
    res.redirect('/admin');
  } catch (error) {
    console.error('Delete error:', error);
    res.redirect('/admin');
  }
});

// Add important contact
router.post('/admin/add-contact', requireAdmin, async (req, res) => {
  try {
    const { name, mobile, category } = req.body;
    
    if (!name || !mobile || !category) {
      return res.redirect('/admin');
    }
    
    await ImportantContact.create({
      name: name.trim(),
      mobile: mobile.trim(),
      category
    });
    
    res.redirect('/admin');
  } catch (error) {
    console.error('Add contact error:', error);
    res.redirect('/admin');
  }
});

// Edit important contact
router.post('/admin/edit-contact/:id', requireAdmin, async (req, res) => {
  try {
    const { name, mobile, category } = req.body;
    
    await ImportantContact.findByIdAndUpdate(req.params.id, {
      name: name.trim(),
      mobile: mobile.trim(),
      category
    });
    
    res.redirect('/admin');
  } catch (error) {
    console.error('Edit contact error:', error);
    res.redirect('/admin');
  }
});

// Delete important contact
router.post('/admin/delete-contact/:id', requireAdmin, async (req, res) => {
  try {
    await ImportantContact.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error('Delete contact error:', error);
    res.redirect('/admin');
  }
});

module.exports = router;
