const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ========= MIDDLEWARE ========= */
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
/* ========= ROUTES ========= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/admin")); 
app.use("/api/food", require("./routes/foodRoutes"));

/* USER TIFFIN BOOKINGS */
app.use("/api/tiffin-bookings", require("./routes/bookingRoutes"));

/* ADMIN TIFFIN BOOKINGS */
app.use(
  "/api/admin/tiffin-bookings",
  require("./routes/adminTiffinBookingRoutes")
);

app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));
app.use("/api/admin", require("./routes/adminMenuRoutes"));


/* ========= DATABASE ========= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

/* ========= START SERVER ========= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
