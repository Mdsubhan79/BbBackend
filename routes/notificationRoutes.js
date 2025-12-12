const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// CREATE NOTIFICATION
router.post("/", async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.json({ message: "Notification created", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
