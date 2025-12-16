const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ========= MIDDLEWARE ========= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());

/* ========= ROUTES ========= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/admin"));       // ✅ admin dashboard
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
const adminOrderRoutes = require("./routes/adminOrderRoutes");

app.use("/api/admin/Orders", adminOrderRoutes);
const adminMenuRoutes = require("./routes/adminMenuRoutes");

app.use("/api/admin", adminMenuRoutes);


/* ========= DATABASE ========= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

/* ========= START SERVER ========= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
