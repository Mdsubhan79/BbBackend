const express = require("express");
const router = express.Router();
const multer = require("multer");
const Food = require("../models/FoodItem");
const upload = require("../middleware/upload");

/* ========= ADD FOOD WITH IMAGE ========= */
router.post("/add", (req, res) => {

  upload.single("image")(req, res, async function (err) {

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Image must be under 1MB" });
      }
      return res.status(400).json({ error: err.message });
    }

    if (err) {
      return res.status(400).json({ error: err.message });
    }

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
        image: req.file ? req.file.path : ""
      });

      await food.save();

      res.json({ success: true, food });

    } catch (error) {
      console.error("ADD FOOD ERROR:", error);
      res.status(500).json({ error: "Server error" });
    }

  });

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