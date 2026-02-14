const express = require("express");
const router = express.Router();
const TiffinBooking = require("../models/TiffinBooking");

/* GET ALL TIFFIN BOOKINGS (ADMIN) */
router.get("/", async (req, res) => {
  try {
    const bookings = await TiffinBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ACTIVATE / UPDATE BOOKING */
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

router.delete("/tiffin-bookings/:id", adminAuth, async (req, res) => {
  try {
    await TiffinBooking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;
