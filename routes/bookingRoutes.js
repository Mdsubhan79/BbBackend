const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// CREATE BOOKING (Tiffin booking)
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Booking created", booking });
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
