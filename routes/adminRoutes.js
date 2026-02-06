const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Food = require("../models/FoodItem");
const Booking = require("../models/Booking");
const Order = require("../models/Order");

/* ================= ADMIN LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ message: "Login successful", token });
});

/* ================= USERS ================= */
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/* ================= ORDERS ================= */
router.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

/* ================= TIFFIN BOOKINGS ================= */
router.get("/bookings", async (req, res) => {
  const bookings = await Booking.find().sort({ bookingDate: -1 });
  res.json(bookings);
});

/* ================= DASHBOARD STATS ================= */
router.get("/dashboard-stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments();
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const vegItems = await Food.countDocuments({ item_type: "veg" });
    const nonVegItems = await Food.countDocuments({ item_type: "nonveg" });
    const activeTiffins = await Booking.countDocuments({ status: "active" });

    res.json({
      totalUsers,
      todayOrders,
      vegItems,
      nonVegItems,
      activeTiffins
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
});

/* ================= ACTIVATE TIFFIN ================= */
router.put("/bookings/:id/activate", async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, {
      status: "active"
    });

    res.json({ success: true, message: "Tiffin activated" });
  } catch (err) {
    res.status(500).json({ message: "Activation failed" });
  }
});

module.exports = router;
