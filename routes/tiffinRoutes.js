const express = require("express");
const router = express.Router();
const Tiffin = require("../models/Tiffin");

/* ================= GET ACTIVE TIFFIN PLANS (PUBLIC) ================= */
router.get("/tiffins/:id", async (req, res) => {
  try {
    const plan = await Tiffin.findById(req.params.id);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
