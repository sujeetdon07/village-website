const express = require('express');
const Gallery = require('../models/Gallery');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// ---------------- PUBLIC GALLERY ----------------
router.get('/gallery', asyncHandler(async (req, res) => {
  const photos = await Gallery.find().sort({ createdAt: -1 });
  res.render('gallery', { photos });
}));

// Note: Photo upload and delete routes are now handled in admin.js using Cloudinary
// The duplicate routes have been removed to prevent MulterError conflicts

module.exports = router;
