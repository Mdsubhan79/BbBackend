const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TiffinMenu = require("../models/TiffinMenu");

/* ========= SAVE TIFFIN MENU ========= */
router.post("/", async (req, res) => {
  try {

    const { bookingId, days } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid bookingId" });
    }

    let menu = await TiffinMenu.findOne({ bookingId });

    if (menu) {
      // update existing menu
      menu.days = days;
      await menu.save();

    } else {
      // create new menu
      menu = new TiffinMenu({
        bookingId,
        days
      });

      await menu.save();
    }

    res.json({
      success: true,
      menu
      
    });

  } catch (err) {
    console.error("SAVE TIFFIN MENU ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


/* ========= GET MENU BY BOOKING ========= */
router.get("/:bookingId", async (req, res) => {
  try {

    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid bookingId" });
    }

    const menu = await TiffinMenu.findOne({ bookingId });

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