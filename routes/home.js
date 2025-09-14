const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery'); // your existing model

// Home page
router.get('/', async (req, res) => {
  try {
    // Fetch all images from the gallery, latest first
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    // Map to URLs for your EJS template
    const imagesWithUrl = images.map(img => ({
      url: `/uploads/${img.filename}` // assuming files are in /public/uploads
    }));

    res.render('home', { images: imagesWithUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
