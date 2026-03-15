const express = require("express");
const router = express.Router();
const DefaultTiffinMenu = require("../models/DefaultTiffinMenu");

router.get("/default-menu", async (req, res) => {
  try {

    const menu = await DefaultTiffinMenu.findOne();

    if (!menu) {
      return res.status(404).json({ message: "No menu set yet" });
    }

    res.json(menu);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;