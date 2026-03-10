// server.js - Production-ready version
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// ---------------- CREATE APP ----------------
const app = express();
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/villageDB';

// Validate MongoDB URI
if (!MONGO_URI || MONGO_URI === 'your_mongodb_uri_here') {
  console.error('❌ MONGO_URI environment variable is not set or is placeholder!');
  console.error('Please set MONGO_URI in your environment variables.');
  process.exit(1);
}

// Trust proxy for Render.com deployment
app.set('trust proxy', 1);

// ---------------- RATE LIMIT ----------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  standardHeaders: true, 
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later"
});

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  message: "Too many attempts from this IP, please try again after 15 minutes"
});

// More relaxed limiter for OTP routes (resend, verify, etc.)
const otpLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 5,                // max 5 OTP actions per minute
  message: "Too many OTP attempts, please wait a minute"
});

// ---------------- MIDDLEWARE ----------------
app.set('view engine', 'ejs');      // important
app.set('views', path.join(__dirname, 'views'));  // correct path to views folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Security - Configure helmet to allow Cloudinary images and inline scripts/styles
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));
app.use(compression());
app.use(mongoSanitize());
app.use(limiter);

// Auth routes limiter
app.use('/login', authLimiter);
app.use('/forgot-password', authLimiter);
app.use('/verify-otp', otpLimiter);

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: MONGO_URI,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(flash());

// Make flash + user session available to all views
app.use((req, res, next) => {
  if (typeof res.locals.success === "undefined" || res.locals.success === null) {
    res.locals.success = req.flash("success");
  }
  if (typeof res.locals.error === "undefined" || res.locals.error === null) {
    res.locals.error = req.flash("error");
  }
  res.locals.user = req.session.user || null;
  next();
});


// ---------------- MONGOOSE ----------------

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  // Don't exit process in production - let the app start and retry
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});


// ---------------- ROUTES ----------------

// Health Check endpoints (Ping to keep server awake on Render)
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const searchRoutes = require('./routes/search');
const feedbackRoutes = require('./routes/feedback');
const galleryRoutes = require('./routes/gallery');
const adminRoutes = require('./routes/admin');

app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', searchRoutes);
app.use('/', feedbackRoutes);
app.use('/', galleryRoutes);
app.use('/', adminRoutes);

// ---------------- 404 ----------------
app.use((req, res) => res.status(404).render('404'));

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! Please try again.");
});

// ---------------- START SERVER ----------------
const PORT = parseInt(process.env.PORT, 10) || 3000; // fallback for local dev
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

