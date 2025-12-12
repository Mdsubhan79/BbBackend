const express = require("express");
const router = express.Router();
const Food = require("../models/FoodItem");

// Add food
router.post("/add", async (req, res) => {
  const food = new Food(req.body);
  await food.save();
  res.json({ message: "Food added successfully" });
});

// Get all food
router.get("/", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// Delete food
router.delete("/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "Food deleted" });
});

module.exports = router;
