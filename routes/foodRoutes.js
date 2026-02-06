const express = require("express");
const router = express.Router();
const Food = require("../models/FoodItem");

// ADD FOOD
router.post("/add", async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.json({ message: "Food added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET FOOD (veg / nonveg / all)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type; // veg or nonveg
    }

    const foods = await Food.find(filter);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE FOOD
router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
