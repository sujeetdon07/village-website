const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String }, // Cloudinary URL
  cloudinaryId: { type: String }, // Cloudinary public ID for deletion
  uploadedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Gallery", gallerySchema);
