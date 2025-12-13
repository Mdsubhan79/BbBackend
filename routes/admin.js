const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const User = require("../models/User");
const Food = require("../models/FoodItem");
const Order = require("../models/Order");
const Booking = require("../models/Booking");

/* ================= DASHBOARD STATS ================= */
router.get("/dashboard-stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const vegItems = await Food.countDocuments({ type: "veg" });
    const nonVegItems = await Food.countDocuments({ type: "nonveg" });
    const activeTiffins = await Booking.countDocuments({ status: "active" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const todayRevenue = revenueData[0]?.total || 0;

    res.json({
      totalUsers,
      todayOrders,
      vegItems,
      nonVegItems,
      activeTiffins,
      todayRevenue
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET MENU ================= */
router.get("/menu", adminAuth, async (req, res) => {
  const { type } = req.query;
  const items = await Food.find({ type });
  res.json(items);
});

/* ================= ADD MENU ================= */
router.post("/menu", adminAuth, async (req, res) => {
  const { name, price, type } = req.body;

  const item = new Food({
    name,
    price,
    type,
    available: true
  });

  await item.save();
  res.json(item);
});

/* ================= DELETE MENU ================= */
router.delete("/menu/:id", adminAuth, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

module.exports = router;


const Tiffin = require("../models/Tiffin");

/* ================= GET TIFFINS ================= */
router.get("/tiffins", adminAuth, async (req, res) => {
  const tiffins = await Tiffin.find();
  res.json(tiffins);
});

/* ================= ADD TIFFIN ================= */
router.post("/tiffins", adminAuth, async (req, res) => {
  const { planName, type, price, meals, active } = req.body;

  const tiffin = new Tiffin({
    planName,
    type,
    price,
    meals,
    active
  });

  await tiffin.save();
  res.json(tiffin);
});

/* ================= UPDATE TIFFIN ================= */
router.put("/tiffins/:id", adminAuth, async (req, res) => {
  const updated = await Tiffin.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* ================= DELETE TIFFIN ================= */
router.delete("/tiffins/:id", adminAuth, async (req, res) => {
  await Tiffin.findByIdAndDelete(req.params.id);
  res.json({ message: "Tiffin deleted" });
});
/* ================= UPDATE TIFFIN ================= */
router.put("/tiffins/:id", adminAuth, async (req, res) => {
  try {
    const { type, price, meals, active } = req.body;

    const tiffin = await Tiffin.findByIdAndUpdate(
      req.params.id,
      { type, price, meals, active },
      { new: true }
    );

    res.json(tiffin);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});
const Tiffin = require("../models/Tiffin");

// UPDATE TIFFIN
router.put("/tiffins/:id", adminAuth, async (req, res) => {
  try {
    const { type, price, meals, active } = req.body;

    const updated = await Tiffin.findByIdAndUpdate(
      req.params.id,
      { type, price, meals, active },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});


/* ================= USERS LIST ================= */
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


/* ================= ORDERS LIST ================= */
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
/* ================= UPDATE ORDER STATUS ================= */
router.put("/orders/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
});
