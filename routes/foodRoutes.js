const express = require("express");
const router = express.Router();
const Food = require("../models/FoodItem");

router.post("/add", async (req, res) => {
  try {
    const { name, price, item_type, category, description, image } = req.body;

    if (!name || !price || !item_type) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const food = new Food({
      name,
      price,
      item_type,
      category,
      description,
      image
    });

    await food.save();

    res.json({
      success: true,
      message: "Food added successfully",
      food
    });
  } catch (err) {
    console.error("ADD FOOD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET FOOD (veg / nonveg / all)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.item_type = req.query.type; // veg or nonveg
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
