const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { makeTransaction, getTransactionHistory } = require("../controllers/transactionController");

// POST /transaction → melakukan pembayaran
router.post("/", authMiddleware, makeTransaction);

// GET /transaction/history → history transaksi
router.get("/history", authMiddleware, getTransactionHistory);

module.exports = router;
