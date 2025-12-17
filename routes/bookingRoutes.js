const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// CREATE BOOKING (Tiffin booking)
router.post("/", async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      status: "pending" // FORCE pending
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking submitted. Waiting for admin activation."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ALL BOOKINGS (For Admin)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


// GET booking by user email (latest)
router.get("/user/:email", async (req, res) => {
  try {
    const booking = await Booking.findOne({
      userEmail: req.params.email
    }).sort({ bookingDate: -1 });

    if (!booking) {
      return res.json({ message: "No booking found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
