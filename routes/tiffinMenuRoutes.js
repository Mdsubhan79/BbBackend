const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TiffinMenu = require("../models/TiffinMenu");

router.get("/:bookingId", async (req, res) => {
  try {

    const { bookingId } = req.params;

  
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid bookingId" });
    }

    const menu = await TiffinMenu.findOne({
      bookingId: bookingId  
    });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menu);

  } catch (err) {
    console.error("Tiffin menu error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;