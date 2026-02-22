const express = require("express");
const router = express.Router();
const TiffinBooking = require("../models/TiffinBooking");

/* ================= USER BOOK TIFFIN ================= */
router.post("/", async (req, res) => {
  try {
    const booking = new TiffinBooking(req.body);
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= ADMIN VIEW ALL BOOKINGS ================= */
router.get("/", async (req, res) => {
  try {
    const bookings = await TiffinBooking
      .find()
      .populate("planId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADMIN UPDATE STATUS / PAYMENT ================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await TiffinBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


router.get("/:id", async (req, res) => {

  try {
    const booking = await TiffinBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});