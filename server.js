require("dotenv").config(); // load .env
const express = require("express");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const balanceRoutes = require("./src/routes/balanceRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const topupRoutes = require("./src/routes/topupRoutes");

const app = express();
app.use(express.json());

// Serve static uploads (profile image)
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Nutech Running " });
});

//  Auth routes: register & login
app.use("/", authRoutes);

//  Protected user routes
app.use("/user", userRoutes);

//  Protected Balance routes
app.use("/balance", balanceRoutes);

//  Protected Top-up routes
app.use("/topup", topupRoutes);

//  Protected Transaction routes
app.use("/transaction", transactionRoutes);

//  Public banner routes
app.use("/api/banners", bannerRoutes);

//  Protected service routes
app.use("/api/services", serviceRoutes);

//  Fallback route
app.use((req, res) => {
  res.status(404).json({ status: false, message: "Endpoint tidak ditemukan" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
