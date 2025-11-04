const db = require("../db");

/**
 * Handle Transaction Payment
 * POST /transaction
 */
exports.makeTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { service_code } = req.body;

    if (!service_code) {
      return res.status(400).json({
        status: 102,
        message: "Parameter service_code tidak boleh kosong",
        data: null,
      });
    }

    // Ambil data service
    const [serviceRows] = await db.query(
      "SELECT service_code, service_name, service_tariff FROM services WHERE service_code = ?",
      [service_code]
    );

    if (serviceRows.length === 0) {
      return res.status(400).json({
        status: 102,
        message: "Service atau Layanan tidak ditemukan",
        data: null,
      });
    }

    const service = serviceRows[0];

    // Ambil data user
    const [userRows] = await db.query(
      "SELECT id, balance FROM users WHERE id = ?",
      [userId]
    );
    const user = userRows[0];

    if (!user || user.balance < service.service_tariff) {
      return res.status(400).json({
        status: 103,
        message: "Saldo tidak mencukupi",
        data: null,
      });
    }

    // Generate invoice
    const invoice_number = `INV${Date.now()}`;

    // Kurangi saldo user
    await db.query(
      "UPDATE users SET balance = balance - ? WHERE id = ?",
      [service.service_tariff, userId]
    );

    // Simpan transaksi dengan description
    const [insertResult] = await db.query(
      `INSERT INTO transactions
       (invoice_number, user_id, service_code, transaction_type, total_amount, description)
       VALUES (?, ?, ?, 'PAYMENT', ?, ?)`,
      [invoice_number, userId, service.service_code, service.service_tariff, service.service_name]
    );

    // Ambil created_on dari DB
    const [transRow] = await db.query(
      "SELECT created_on FROM transactions WHERE id = ?",
      [insertResult.insertId]
    );

    return res.json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: service.service_tariff,
        created_on: transRow[0].created_on,
      },
    });
  } catch (error) {
    console.error("TRANSACTION ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
    });
  }
};

/**
 * Get Transaction History
 * GET /transaction/history
 */
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const offset = Number(req.query.offset) || 0;
    const limit = req.query.limit ? Number(req.query.limit) : null;

    let query = `
      SELECT 
        invoice_number,
        transaction_type,
        description,
        total_amount,
        created_on
      FROM transactions
      WHERE user_id = ?
      ORDER BY created_on DESC
    `;
    const params = [userId];

    if (limit) {
      query += " LIMIT ? OFFSET ?";
      params.push(limit, offset);
    }

    const [rows] = await db.query(query, params);

    return res.json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset,
        limit: limit || rows.length,
        records: rows,
      },
    });
  } catch (error) {
    console.error("GET HISTORY ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
    });
  }
};
