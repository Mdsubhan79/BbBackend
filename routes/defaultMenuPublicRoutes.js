const express = require("express");
const router = express.Router();
const DefaultMenu = require("../models/DefaultTiffinMenu");

/* PUBLIC GET DEFAULT MENU */
router.get("/", async (req, res) => {
  try {
    const menu = await DefaultMenu.findOne();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;