const express = require("express");
const router = express.Router();
const Food = require("../models/FoodItem");
const adminAuth = require("../middleware/adminAuth");

/* GET VEG / NON-VEG MENU */
router.get("/menu", adminAuth, async (req, res) => {
  try {
    const { type } = req.query; // veg / nonveg
    const items = await Food.find({ type });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load menu" });
  }
});

/* ADD MENU ITEM */
router.post("/menu", adminAuth, async (req, res) => {
  try {
    const item = new Food(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item" });
  }
});

/* DELETE MENU ITEM */
router.delete("/menu/:id", adminAuth, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
