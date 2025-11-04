const db = require("../db");

/**
 * Top Up Balance
 */
exports.topUpBalance = async (req, res) => {
  try {
    const userId = req.user.id; // dari token
    const { top_up_amount } = req.body;

    if (!top_up_amount || typeof top_up_amount !== "number" || top_up_amount <= 0) {
      return res.status(400).json({
        status: 102,
        message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        data: null,
      });
    }

    // Ambil saldo user
    const [userRows] = await db.query("SELECT balance FROM users WHERE id = ?", [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({
        status: 104,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const user = userRows[0];
    const newBalance = user.balance + top_up_amount;

    // Update saldo user
    await db.query("UPDATE users SET balance = ? WHERE id = ?", [newBalance, userId]);

    // Generate invoice
    const invoice_number = `INV${Date.now()}`;

    // Simpan transaksi top-up
    await db.query(
      `INSERT INTO transactions (invoice_number, user_id, transaction_type, total_amount, description)
       VALUES (?, ?, 'TOPUP', ?, ?)`,
      [invoice_number, userId, top_up_amount, "Top Up balance"]
    );

    return res.json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: { balance: newBalance },
    });
  } catch (error) {
    console.error("TOPUP ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
    });
  }
};
