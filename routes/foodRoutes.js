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


    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const food = new Food({
      name,
      price,
      item_type,
      category,
      description,
      image: req.file.path  
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: "Food item added successfully",
      food
    });

  } catch (err) {
  console.error("ADD FOOD ERROR:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Image must be under 3MB" });
  }

  res.status(500).json({ error: err.message });
}
});


/* ========= GET FOOD ========= */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.item_type = req.query.type;
    }

    const foods = await Food.find(filter);
    res.json(foods);

  } catch (err) {
    console.error("GET FOOD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ========= DELETE FOOD ========= */
router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Item deleted successfully" });

  } catch (err) {
    console.error("DELETE FOOD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;