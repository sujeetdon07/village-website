const express = require('express');
const Gallery = require('../models/Gallery');
const { requireAdmin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';

// Ensure upload directory exists
if (!fs.existsSync(path.join(__dirname, '..', UPLOAD_DIR))) {
  fs.mkdirSync(path.join(__dirname, '..', UPLOAD_DIR), { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', UPLOAD_DIR)),
  filename: (req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// ---------------- PUBLIC GALLERY ----------------
router.get('/gallery', asyncHandler(async (req, res) => {
  const photos = await Gallery.find().sort({ createdAt: -1 });
  res.render('gallery', { photos });
}));

// ---------------- ADMIN UPLOAD ----------------
router.post('/admin/upload-photo', requireAdmin, upload.array('photos', 10), asyncHandler(async (req, res) => {
  for (const file of req.files) {
    const originalPath = file.path;
    const resizedFilename = 'resized-' + file.filename;
    const resizedPath = path.join(path.dirname(originalPath), resizedFilename);

    // Resize image using Sharp (max 800x600)
    await sharp(originalPath)
      .resize(800, 600, { fit: 'inside' })
      .toFile(resizedPath);

    // Save resized image record in DB
    await new Gallery({ filename: resizedFilename, uploadedBy: req.session.user.name }).save();

    // Delete original uploaded image
    fs.unlinkSync(originalPath);
  }
  res.redirect('/admin');
}));

// ---------------- ADMIN DELETE PHOTO ----------------
router.post('/admin/delete-photo/:id', requireAdmin, asyncHandler(async (req, res) => {
  const g = await Gallery.findByIdAndDelete(req.params.id);
  if (g?.filename) {
    const fp = path.join(__dirname, '..', UPLOAD_DIR, g.filename);
    fs.unlink(fp, (err) => { if (err) console.warn('Failed to delete image:', err); });
  }
  res.redirect('/admin');
}));

module.exports = router;
