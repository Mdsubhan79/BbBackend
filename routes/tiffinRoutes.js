const express = require("express");
const router = express.Router();
const Tiffin = require("../models/Tiffin");

/* ================= GET ALL ACTIVE TIFFIN PLANS (PUBLIC) ================= */
router.get("/", async (req, res) => {
  try {
    const plans = await Tiffin.find({ active: true }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET SINGLE TIFFIN PLAN ================= */
router.get("/:id", async (req, res) => {
  try {
    const plan = await Tiffin.findById(req.params.id);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;