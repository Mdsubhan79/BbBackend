const express = require("express");
const router = express.Router();
const Tiffin = require("../models/Tiffin");
const adminAuth = require("../middleware/adminAuth");

/* ================= GET ALL TIFFIN PLANS ================= */
router.get("/tiffins", adminAuth, async (req, res) => {
  try {
    const plans = await Tiffin.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADD TIFFIN PLAN ================= */
router.post("/tiffins", adminAuth, async (req, res) => {
  try {
    const plan = new Tiffin(req.body);
    await plan.save();
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= DELETE TIFFIN PLAN ================= */
router.delete("/tiffins/:id", adminAuth, async (req, res) => {
  try {
    await Tiffin.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= UPDATE TIFFIN PLAN ================= */
router.put("/tiffins/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Tiffin.findByIdAndUpdate(
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
router.post("/tiffins", adminAuth, async (req, res) => {
  try {
    const { planName, type, mealTime, description, price, active } = req.body;

    const tiffin = new Tiffin({
      planName,
      type,
      mealTime,
      description,
      price,
      active
    });

    await tiffin.save();
    res.json({ success: true, tiffin });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});