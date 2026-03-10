# Cloudinary Setup Guide

## ✅ Installation Complete

Cloudinary has been successfully integrated into your village website for dynamic photo uploads.

## 📋 What Was Configured

### 1. **Dependencies Installed**
- `cloudinary` - Official Cloudinary SDK
- `multer-storage-cloudinary` - Multer storage engine for Cloudinary

### 2. **Configuration Files**

#### `config/cloudinary.js`
- Cloudinary configuration with your credentials
- Multer upload middleware
- File validation (images only, max 5MB)
- Auto image optimization and resizing (max 1200x1200)

### 3. **Environment Variables**

Add these to your `.env` file (already added to `.env.example`):

```env
CLOUDINARY_CLOUD_NAME=djmpck7sk
CLOUDINARY_API_KEY=792653465239753
CLOUDINARY_API_SECRET=j6s0L2NncdZIRjlMIjRyMrOrYyI
CLOUDINARY_URL=cloudinary://792653465239753:j6s0L2NncdZIRjlMIjRyMrOrYyI@djmpck7sk
```

### 4. **Database Schema Updated**

`models/Gallery.js` now includes:
- `url` - Cloudinary image URL
- `cloudinaryId` - Public ID for deletion
- `filename` - Original filename
- `createdAt` - Upload timestamp

### 5. **Routes Updated**

#### Admin Routes (`routes/admin.js`):
- **POST `/admin/upload-photo`** - Upload single photo to Cloudinary
- **POST `/admin/delete-photo/:id`** - Delete photo from Cloudinary and database

### 6. **Views Updated**

#### Admin Panel (`views/admin.ejs`):
- New upload form with Cloudinary branding
- Photo counter showing total uploaded photos
- Delete button for each photo
- Displays Cloudinary-hosted images

#### Gallery Page (`views/gallery.ejs`):
- Updated to display Cloudinary URLs
- Fallback to local uploads for backward compatibility

#### Home Page (`routes/home.js`):
- Image slider uses Cloudinary URLs
- Fallback to local uploads

## 🚀 How to Use

### For Admin Users:

1. **Login to Admin Panel**
   - Navigate to `/admin`
   - Login with admin credentials

2. **Upload Photos**
   - Click "Choose File" button
   - Select an image (JPG, PNG, GIF, WEBP)
   - Click "☁️ Upload to Cloudinary"
   - Photo will be uploaded and displayed immediately

3. **Delete Photos**
   - Click "🗑️ Delete" button under any photo
   - Photo will be removed from both Cloudinary and database

### Features:

✅ **Automatic Image Optimization**
- Images are automatically optimized for web
- Maximum dimensions: 1200x1200px
- Quality: Auto (Cloudinary optimizes based on content)

✅ **File Validation**
- Only image files allowed
- Maximum file size: 5MB
- Supported formats: JPG, JPEG, PNG, GIF, WEBP

✅ **Cloud Storage**
- All photos stored on Cloudinary CDN
- Fast loading times worldwide
- No server storage required

✅ **Backward Compatibility**
- Existing local uploads still work
- Gradual migration to Cloudinary

## 🔧 Cloudinary Dashboard

Access your Cloudinary dashboard at:
https://cloudinary.com/console

**Your Cloud Name:** djmpck7sk

### Dashboard Features:
- View all uploaded images
- Monitor storage usage
- View transformation statistics
- Manage folders and assets

## 📁 Folder Structure

Photos are uploaded to:
```
Cloudinary > patarhi-village/
```

## 🔐 Security Notes

1. **API Credentials**
   - Never commit `.env` file to Git
   - Keep API secret confidential
   - Rotate credentials if exposed

2. **File Upload Limits**
   - Max file size: 5MB
   - Only images allowed
   - Admin-only access

## 🐛 Troubleshooting

### Upload Fails:
1. Check `.env` file has correct credentials
2. Verify internet connection
3. Check file size (must be < 5MB)
4. Ensure file is an image format

### Images Not Displaying:
1. Check Cloudinary dashboard for uploaded images
2. Verify `url` field in database
3. Check browser console for errors

### Delete Fails:
1. Verify `cloudinaryId` exists in database
2. Check Cloudinary API credentials
3. Check admin permissions

## 📊 Cloudinary Limits (Free Plan)

- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month
- **Images:** Unlimited

## 🔄 Migration from Local to Cloudinary

Existing local photos will continue to work. To migrate:

1. Re-upload photos through admin panel
2. Old local files can be deleted manually
3. Database will automatically use Cloudinary URLs

## 📞 Support

For Cloudinary issues:
- Documentation: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com

For website issues:
- Contact: Sujeet Kumar
- Mobile: +91 6203803766

---

**Setup Date:** October 27, 2025
**Version:** 1.0.0
