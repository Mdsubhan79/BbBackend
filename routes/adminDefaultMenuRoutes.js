const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const DefaultMenu = require("../models/DefaultTiffinMenu");


router.get("/", adminAuth, async (req, res) => {
  const menu = await DefaultMenu.findOne();
  res.json(menu);
});

router.post("/", adminAuth, async (req, res) => {

  await DefaultMenu.deleteMany(); 

  const menu = new DefaultMenu(req.body);
  await menu.save();

  res.json({ success: true });
});

module.exports = router;