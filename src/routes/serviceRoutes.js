const express = require("express");
const router = express.Router();
const { getServices } = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");

// GET list services (Private)
router.get("/", authMiddleware, getServices);

module.exports = router;
