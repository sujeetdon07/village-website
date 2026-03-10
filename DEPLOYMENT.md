# Deployment Guide - Render.com

## Step 1: Prepare MongoDB
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster and get your connection string
4. Update `MONGO_URI` in `.env.production`

## Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/village-website.git
git push -u origin main
```

## Step 3: Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   - **Name**: village-website
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: A random secret string
   - `NODE_ENV`: production
7. Click "Deploy"

## Step 4: Keep Server Awake (Anti-Sleep)
Use one of these FREE services to ping your server every 5 minutes:

### Option A: Kaffeine (Recommended)
1. Go to [kaffeine.herokuapp.com](http://kaffeine.herokuapp.com/)
2. Enter your Render URL: `https://your-app.onrender.com/ping`
3. Click "Keep it awake"
4. Done! It will ping every 30 minutes automatically

### Option B: Cron-job.org
1. Go to [cron-job.org](https://cron-job.org/en/)
2. Sign up (free)
3. Create new cronjob
4. URL: `https://your-app.onrender.com/ping`
5. Execution interval: 5 minutes
6. Save and activate

### Option C: Uptime Robot
1. Go to [uptimerobot.com](https://uptimerobot.com/)
2. Sign up (free)
3. Add new monitor
4. Type: HTTP(s)
5. URL: `https://your-app.onrender.com/ping`
6. Monitoring interval: 5 minutes
7. Save

## Health Check Endpoints
Your app has these endpoints for monitoring:
- `/ping` - Simple pong response
- `/api/health` - Detailed health status with uptime

## Troubleshooting
- **Build fails**: Check if all dependencies in `package.json` are correct
- **Env variables missing**: Make sure all vars are set in Render dashboard
- **Still going to sleep**: Ping service might be down, use multiple services
- **MongoDB connection error**: Verify MONGO_URI is correct for production

## Notes
- Free tier gets 0.5 CPU & 512MB RAM (enough for small projects)
- With active pinging, your app stays always-on
- First deploy takes 5-10 minutes
