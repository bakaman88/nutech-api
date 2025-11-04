// src/routes/balanceRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getBalance } = require("../controllers/balanceController");

// GET /balance (Private)
router.get("/", authMiddleware, getBalance);

module.exports = router;
