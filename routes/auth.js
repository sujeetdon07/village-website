// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("../middleware/asyncHandler");
const Resident = require("../models/Resident");

// ---------- GET PAGES ----------
router.get("/register", (req, res) => res.render("register"));
router.get("/login", (req, res) => {
  res.render("login", {
    error: req.flash('error'),    // get any error flash messages
    success: req.flash('success') // get any success flash messages
  });
});

router.get("/forgot-password", (req, res) =>
  res.render("forgot-password", { error: null, success: null })
);

router.get("/verify-otp", (req, res) => {
  const showOtp =
    process.env.SHOW_OTP === "true" || process.env.NODE_ENV !== "production";
  res.render("verify-otp", {
    error: null,
    otp: showOtp ? req.session.resetOTP || null : null,
  });
});

// ---------- REGISTER ----------
router.post(
  "/api/register",
  [
    body("name").trim().notEmpty().withMessage("Name required"),
    body("mobile")
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Mobile must be 10 digits"),
    body("aadhaar")
      .trim()
      .matches(/^\d{12}$/)
      .withMessage("Aadhaar must be 12 digits"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars"),
    body("confirmPassword")
      .custom((v, { req }) => v === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ success: false, error: errors.array()[0].msg });

    const { name, mobile, email, aadhaar, password, panchayat, village } =
      req.body;

    if (await Resident.findOne({ aadhaar }))
      return res
        .status(409)
        .json({ success: false, error: "Aadhaar already exists" });

    if (await Resident.findOne({ mobile }))
      return res
        .status(409)
        .json({ success: false, error: "Mobile already registered" });

    const hash = await bcrypt.hash(password, 12);
    const resident = await Resident.create({
      name,
      mobile,
      email: email || "",
      aadhaar,
      passwordHash: hash,
      panchayat: panchayat || "Patarhi Panchayat",
      village: village || "",
    });

    req.session.user = {
      id: resident._id,
      name: resident.name,
      mobile: resident.mobile,
      isAdmin: resident.isAdmin || false,
    };

    res.json({ success: true, redirect: "/enter-details" });
  })
);

// ---------- LOGIN ----------
router.post(
  "/api/login",
  [
    body("mobile").trim().notEmpty().withMessage("Mobile is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { mobile, password } = req.body;
    try {
      const resident = await Resident.findOne({ mobile });
      if (!resident) {
        return res.status(401).json({ success: false, error: "Invalid mobile or password" });
      }

      const match = await bcrypt.compare(password, resident.passwordHash);
      if (!match) {
        return res.status(401).json({ success: false, error: "Invalid mobile or password" });
      }

      req.session.user = {
        id: resident._id,
        name: resident.name,
        mobile: resident.mobile,
        isAdmin: resident.isAdmin || false,
      };

      const redirect = resident.detailsCompleted ? "/profile" : "/enter-details";
      res.json({ success: true, redirect });
    } catch (err) {
      res.status(500).json({ success: false, error: "Server error, try again" });
    }
  })
);

// ---------- LOGOUT ----------
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ---------- FORGOT PASSWORD ----------
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { mobile } = req.body;
    const user = await Resident.findOne({ mobile });
    if (!user)
      return res.render("forgot-password", { error: "Mobile not registered", success: null });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    req.session.resetOTP = otp;
    req.session.resetMobile = mobile;
    req.session.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

    const showOtp =
      process.env.SHOW_OTP === "true" || process.env.NODE_ENV !== "production";

    return res.render("verify-otp", { error: null, otp: showOtp ? otp : null });
  })
);

router.post(
  "/verify-otp",
  asyncHandler(async (req, res) => {
    const { otp } = req.body;

    if (
      !req.session.resetOTP ||
      !req.session.resetOTPExpiry ||
      Date.now() > req.session.resetOTPExpiry
    ) {
      req.session.resetOTP = null;
      req.session.resetMobile = null;
      req.session.resetOTPExpiry = null;
      return res.render("verify-otp", {
        error: "OTP expired. Please request again.",
        otp: null,
      });
    }

    if (otp === req.session.resetOTP)
      return res.render("reset-password", { error: null });

    const showOtp =
      process.env.SHOW_OTP === "true" || process.env.NODE_ENV !== "production";

    return res.render("verify-otp", {
      error: "Invalid OTP",
      otp: showOtp ? req.session.resetOTP : null,
    });
  })
);

router.post(
  "/resend-otp",
  asyncHandler(async (req, res) => {
    if (!req.session.resetMobile)
      return res.status(400).json({
        success: false,
        error: "Session expired. Please request OTP again.",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    req.session.resetOTP = otp;
    req.session.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

    const showOtp =
      process.env.SHOW_OTP === "true" || process.env.NODE_ENV !== "production";

    res.json({
      success: true,
      otp: showOtp ? otp : null,
      message: "A new OTP has been sent!",
    });
  })
);

// ---------- RESET PASSWORD ----------
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (!req.session.resetMobile) return res.redirect("/forgot-password");

    if (password !== confirmPassword)
      return res.render("reset-password", { error: "Passwords do not match", success: null });

    const hash = await bcrypt.hash(password, 12);
    await Resident.findOneAndUpdate(
      { mobile: req.session.resetMobile },
      { passwordHash: hash }
    );

    req.session.resetOTP = null;
    req.session.resetMobile = null;
    req.session.resetOTPExpiry = null;
    req.flash("success", "Password reset successfully");
    return res.redirect("/login");
  })
);

module.exports = router;
