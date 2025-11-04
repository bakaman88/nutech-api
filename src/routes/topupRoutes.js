const express = require("express");
const router = express.Router();
const { topUpBalance } = require("../controllers/topupController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /topup (Private)
router.post("/", authMiddleware, topUpBalance);

module.exports = router;
