# Render.com Deployment Guide

## Environment Variables Required on Render.com

Make sure to set these environment variables in your Render.com dashboard:

1. **MONGO_URI**: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/villageDB`

2. **SESSION_SECRET**: A random secret string for session encryption
   - Example: `your-super-secret-random-string-here`

3. **NODE_ENV**: Set to `production`
   - Value: `production`

4. **PORT**: Render automatically sets this, but you can specify
   - Value: `3000` (or leave empty for Render's default)

5. **SHOW_OTP**: Whether to show OTP in responses (for testing)
   - Value: `false` (for production)

## Steps to Deploy on Render.com

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Fix session configuration for Render.com deployment"
git push origin main
```

### 2. Create Web Service on Render.com
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `https://github.com/sujeetdon07/village-website`
4. Configure the service:
   - **Name**: village-website
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 3. Add Environment Variables
In the Render dashboard, go to "Environment" tab and add:
- `MONGO_URI` = your MongoDB connection string
- `SESSION_SECRET` = a random secret string
- `NODE_ENV` = production
- `SHOW_OTP` = false

### 4. Deploy
Click "Create Web Service" and wait for deployment to complete.

## Important Notes

### Session Configuration
The app is now configured to work with Render's proxy:
- `trust proxy` is enabled
- Cookies use `secure: true` in production (HTTPS only)
- `sameSite: 'none'` for cross-site cookie support

### MongoDB Atlas
Make sure your MongoDB Atlas cluster:
1. Allows connections from anywhere (0.0.0.0/0) or add Render's IP addresses
2. Has a database user with read/write permissions

### After Deployment
1. Visit your Render URL: `https://village-website.onrender.com`
2. Test registration and login
3. Check that sessions persist after login
4. Verify redirects work correctly

## Troubleshooting

### Sessions Not Persisting
- Check that `NODE_ENV=production` is set in Render
- Verify MongoDB connection is working
- Check Render logs for session errors

### Login Redirects Not Working
- Ensure all environment variables are set correctly
- Check that MongoDB Atlas allows Render's IP addresses
- Review application logs in Render dashboard

### Cookie Issues
- Verify your site is using HTTPS (Render provides this automatically)
- Check browser console for cookie warnings
- Ensure `SESSION_SECRET` is set and not empty
