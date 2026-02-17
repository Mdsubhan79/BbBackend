const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const DefaultMenu = require("../models/DefaultTiffinMenu");

/* GET DEFAULT MENU */
router.get("/", adminAuth, async (req, res) => {
  const menu = await DefaultMenu.findOne();
  res.json(menu);
});

/* SET DEFAULT MENU */
router.post("/", adminAuth, async (req, res) => {

  await DefaultMenu.deleteMany(); // keep only one default

  const menu = new DefaultMenu(req.body);
  await menu.save();

  res.json({ success: true });
});

module.exports = router;