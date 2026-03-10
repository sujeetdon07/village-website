const express = require("express");
const Feedback = require("../models/Feedback");
const router = express.Router();

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).send("Access denied. Admins only.");
}

// GET all feedbacks - Admin only
router.get("/feedback", isAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.render("feedback", { feedbacks });
  } catch (err) {
    console.error(err);
    res.send("Error fetching feedbacks");
  }
});

router.post("/feedback", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !message) return res.send("Name and message required");

    // Save and keep a reference
    const newFeedback = await new Feedback({ name, email, message }).save();

    // If admin submits feedback, redirect to dashboard
    if (req.user && req.user.isAdmin) {
      return res.redirect("/admin"); // <-- adjust if your admin dashboard route differs
    }

    // Prepare safe date/time values
    const createdAt = newFeedback.createdAt || new Date();

    // Render thank-you page with name, date, time
    res.render("feedback-thankyou", {
      name,
      date: newFeedback.createdAt.toDateString(),
      time: newFeedback.createdAt.toLocaleTimeString(),
      title: "Thank You",
    });
  } catch (err) {
    console.error(err);
    res.send("Error saving feedback");
  }
});

module.exports = router;
