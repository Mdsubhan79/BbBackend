const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 5000;


const clients = new Set();


wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected');

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

global.broadcastUpdate = (data) => {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

/* ========= MIDDLEWARE ========= */
app.use(cors());
app.use(express.json());

/* ========= ROUTES ========= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/admin")); 
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/tiffins", require("./routes/tiffinRoutes"));
app.use("/api/tiffin-bookings", require("./routes/bookingRoutes"));
app.use("/api/admin/tiffin-bookings",require("./routes/adminTiffinBookingRoutes"));
app.use("/api/admin/default-menu", require("./routes/adminDefaultMenuRoutes"));
app.use("/api/tiffin-menus", require("./routes/tiffinMenuRoutes"));
app.use("/api/default-menu", require("./routes/defaultMenuPublicRoutes"));
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin", require("./routes/adminMenuRoutes"));
app.use("/api/admin", require("./routes/adminTiffinRoutes"));

/* ========= DATABASE ========= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

/* ========= START SERVER ========= */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});