const express = require("express");
const mongoose = require("mongoose");
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

  try {

    const menu = await TiffinMenu.findOne({
      bookingId: new mongoose.Types.ObjectId(req.params.bookingId)
    });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menu);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

module.exports = router;