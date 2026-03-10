# Debugging Guide for Recent Changes

## Issues to Debug

### 1. Important Contacts Not Showing in Search Results
**Problem**: Important contacts are not displayed when searching on the details page.

**Debug Steps**:
1. Open browser console (F12) when on the details page
2. Search for an important contact name
3. Check console logs for:
   - "Search result:" - shows what API returned
   - "Rendering X results" - shows how many items are being rendered
4. Check server logs for:
   - "Search query:" - shows what was searched
   - "Found residents:" and "Found contacts:" - shows what was found in database
   - "Sending results:" - shows the formatted data being sent

**Possible Causes**:
- No important contacts added in admin panel yet
- Contact names don't match search query
- Database connection issue

**Solution**:
1. Go to admin panel
2. Add at least one important contact (e.g., Name: "Police", Mobile: "100", Category: "Police Station")
3. Search for "Police" on details page
4. Should see green-bordered card with category badge

---

### 2. Photos Not Displaying (Showing Alt Text Instead)
**Problem**: Uploaded photos show alt text/icon instead of actual image.

**Debug Steps**:
1. Upload a photo via admin panel
2. Check server console logs for:
   - "Uploaded file:" - shows Cloudinary file object
   - "Saved photo:" - shows what was saved to database
3. Check browser console for image load errors
4. Right-click on broken image → "Inspect" → check `src` attribute

**Expected Cloudinary File Object**:
```javascript
{
  fieldname: 'photo',
  originalname: 'example.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  path: 'https://res.cloudinary.com/djmpck7sk/image/upload/v1234567890/patarhi-village/abc123.jpg',
  size: 123456,
  filename: 'patarhi-village/abc123',
  public_id: 'patarhi-village/abc123'
}
```

**What Gets Saved to Database**:
```javascript
{
  filename: 'example.jpg',
  url: 'https://res.cloudinary.com/djmpck7sk/image/upload/v1234567890/patarhi-village/abc123.jpg',
  cloudinaryId: 'patarhi-village/abc123'
}
```

**Possible Causes**:
- Cloudinary credentials not set in environment variables
- `req.file.path` is undefined or incorrect
- Network issue preventing image load from Cloudinary

**Solution**:
1. Check `.env` file has correct Cloudinary credentials:
   ```
   CLOUDINARY_CLOUD_NAME=djmpck7sk
   CLOUDINARY_API_KEY=792653465239753
   CLOUDINARY_API_SECRET=j6s0L2NncdZIRjlMIjRyMrOrYyI
   ```
2. Check server logs when uploading to see actual file object
3. If `url` is empty in database, Cloudinary upload failed
4. If `url` exists but image doesn't load, check Cloudinary dashboard

---

## How to Test

### Test Important Contacts Search:
1. Login as admin
2. Go to admin panel
3. Scroll to "Important Contacts" section
4. Add a contact:
   - Name: Police Station
   - Mobile: 100
   - Category: Police Station
5. Go to "Get Details" page
6. Search for "Police"
7. Should see green card with "Police Station" and category badge

### Test Photo Upload:
1. Login as admin
2. Go to admin panel
3. Upload a photo (JPG, PNG, etc.)
4. Check server console for logs
5. Photo should appear in gallery section
6. Go to Gallery page (public)
7. Photo should be visible there too

---

## Logs to Check

### Server Console (Terminal):
- Search logs: Shows what's being searched and found
- Upload logs: Shows Cloudinary file object and saved data

### Browser Console (F12):
- Search result logs: Shows API response
- Rendering logs: Shows how many items being displayed
- Network tab: Check if API calls are successful
- Console errors: Any JavaScript errors

---

## Quick Fixes

### If Important Contacts Still Don't Show:
Check the database directly to ensure contacts exist:
```javascript
// In MongoDB or via admin panel
db.importantcontacts.find()
```

### If Photos Still Don't Load:
1. Check if URL starts with `https://res.cloudinary.com/`
2. Try accessing the URL directly in browser
3. Check Cloudinary dashboard for uploaded images
4. Verify environment variables are loaded (restart server after changing .env)

---

## Contact for Help
If issues persist after following this guide, provide:
1. Server console logs (from terminal)
2. Browser console logs (from F12 developer tools)
3. Screenshot of the issue
4. Steps you followed
