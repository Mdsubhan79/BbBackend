const express = require("express");
const router = express.Router();
const Food = require("../models/FoodItem");
const adminAuth = require("../middleware/adminAuth");

// GET VEG ITEMS
router.get("/menu", adminAuth, async (req, res) => {
  const { type } = req.query;
  const items = await Food.find({ type });
  res.json(items);
});

// ADD ITEM
router.post("/menu", adminAuth, async (req, res) => {
  const item = new Food(req.body);
  await item.save();
  res.json({ message: "Item added" });
});

// UPDATE ITEM
router.put("/menu/:id", adminAuth, async (req, res) => {
  await Food.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Item updated" });
});

// DELETE ITEM
router.delete("/menu/:id", adminAuth, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

module.exports = router;
