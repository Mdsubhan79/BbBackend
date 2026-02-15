const express = require("express");
const router = express.Router();
const TiffinMenu = require("../models/TiffinMenu");

router.post("/", async (req, res) => {
  try {
    const menu = new TiffinMenu(req.body);
    await menu.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:bookingId", async (req, res) => {
  const menu = await TiffinMenu.findOne({
    bookingId: req.params.bookingId
  });
  res.json(menu);
});

module.exports = router;