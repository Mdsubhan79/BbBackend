const express = require("express");
const router = express.Router();
const Food = require("../models/FoodItem");
const upload = require("../middleware/upload");

/* ========= ADD FOOD WITH IMAGE ========= */
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price, item_type, category, description } = req.body;

    if (!name || !price || !item_type) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const food = new Food({
      name,
      price,
      item_type,
      category,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await food.save();

    res.json({ success: true, food });
  } catch (err) {
    console.error("ADD FOOD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ========= GET FOOD ========= */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.item_type = req.query.type;

    const foods = await Food.find(filter);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========= DELETE FOOD ========= */
router.delete("/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
