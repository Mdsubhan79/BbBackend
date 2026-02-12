const express = require("express");
const router = express.Router();
const Tiffin = require("../models/Tiffin");

/* ================= GET ACTIVE TIFFIN PLANS (PUBLIC) ================= */
router.get("/", async (req, res) => {
  try {
    const plans = await Tiffin.find({ active: true }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
