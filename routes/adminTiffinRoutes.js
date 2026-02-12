const express = require("express");
const router = express.Router();
const Tiffin = require("../models/Tiffin");

/* ================= GET ALL TIFFIN PLANS ================= */
router.get("/tiffins", async (req, res) => {
  try {
    const plans = await Tiffin.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADD TIFFIN PLAN ================= */
router.post("/tiffins", async (req, res) => {
  try {
    const plan = new Tiffin(req.body);
    await plan.save();
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= DELETE TIFFIN PLAN ================= */
router.delete("/tiffins/:id", async (req, res) => {
  try {
    await Tiffin.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= UPDATE TIFFIN PLAN ================= */
router.put("/tiffins/:id", async (req, res) => {
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
