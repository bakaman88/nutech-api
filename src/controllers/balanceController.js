// src/controllers/balanceController.js
const db = require("../db");

exports.getBalance = async (req, res) => {
  try {
    const userEmail = req.user.email; // email dari payload JWT

    const [user] = await db.query("SELECT balance FROM users WHERE email = ?", [
      userEmail,
    ]);

    if (user.length === 0) {
      return res.status(400).json({
        status: 102,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    return res.json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: user[0].balance,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};
