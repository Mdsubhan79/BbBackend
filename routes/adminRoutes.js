const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Food = require("../models/FoodItem");
const Booking = require("../models/Booking");
const Order = require("../models/Order");

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({ message: "Login successful", token });
});

// GET ALL USERS
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET ALL ORDERS
router.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// GET TIFFIN BOOKINGS
router.get("/Bookings", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

module.exports = router;
// DASHBOARD OVERVIEW STATS
router.get("/dashboard-stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments();

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    const vegItems = await Food.countDocuments({ type: "veg" });
    const nonVegItems = await Food.countDocuments({ type: "nonveg" });

    const activeTiffins = await Booking.countDocuments({
      status: "active"
    });

    const revenue = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      totalUsers,
      todayOrders,
      vegItems,
      nonVegItems,
      activeTiffins,
      todayRevenue: revenue[0]?.total || 0
    });

  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
});
