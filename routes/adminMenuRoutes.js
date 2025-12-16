const express = require("express");
const router = express.Router();
const FoodItem = require("../models/FoodItem"); 
const adminAuth = require("../middleware/adminAuth");

// GET VEG / NONVEG MENU
router.get("/menu", adminAuth, async (req, res) => {
  try {
    const { type } = req.query; // veg / nonveg
    const items = await FoodItem.find({ type });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load menu" });
  }
});

// ADD ITEM
router.post("/menu", adminAuth, async (req, res) => {
  try {
    const item = new FoodItem(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item" });
  }
});

// DELETE ITEM
router.delete("/menu/:id", adminAuth, async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
