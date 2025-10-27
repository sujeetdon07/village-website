const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery'); // Your existing model

// Home page
router.get('/', async (req, res) => {
  try {
    // Fetch all images from the gallery, latest first
    const images = await Gallery.find().sort({ createdAt: -1 }); // Use createdAt if uploadedAt isn't defined

    // Map to URLs for EJS template (support both Cloudinary and local uploads)
    const imagesWithUrl = images.map(img => ({
      url: img.url || `/uploads/${img.filename}` // Use Cloudinary URL if available, fallback to local
    }));

    // Render home.ejs with images array
    res.render('home', { images: imagesWithUrl });
  } catch (err) {
    console.error('Error fetching gallery images:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
