const pool = require("../db");
const path = require("path");
const fs = require("fs");

/**
 * GET /user/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT id, first_name, last_name, email, profile_image FROM users WHERE id = ?",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ status: false, message: "User tidak ditemukan" });
    }

    return res.json({
      status: true,
      message: "Sukses mendapatkan data profile",
      data: rows[0]
    });

  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan server" });
  }
};

/**
 * PUT /user/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, email } = req.body;

    if (!first_name && !last_name && !email) {
      return res.status(400).json({ status: false, message: "Minimal satu field harus diupdate" });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ status: false, message: "Format email tidak valid" });
      }

      const [existingRows] = await pool.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, userId]
      );
      if (existingRows.length > 0) {
        return res.status(400).json({ status: false, message: "Email sudah digunakan user lain" });
      }
    }

    const fields = [];
    const values = [];
    if (first_name) { fields.push("first_name = ?"); values.push(first_name); }
    if (last_name) { fields.push("last_name = ?"); values.push(last_name); }
    if (email) { fields.push("email = ?"); values.push(email); }
    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await pool.query(sql, values);

    const [updatedRows] = await pool.query(
      "SELECT id, first_name, last_name, email, profile_image FROM users WHERE id = ?",
      [userId]
    );

    return res.json({
      status: true,
      message: "Profile berhasil diperbarui",
      data: updatedRows[0]
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan server" });
  }
};

/**
 * POST /user/profile/image
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "File tidak ditemukan" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ status: false, message: "Format file hanya PNG/JPG/JPEG" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    await pool.query("UPDATE users SET profile_image = ? WHERE id = ?", [imageUrl, userId]);

    return res.json({
      status: true,
      message: "Profile image berhasil diupload",
      data: { profile_image: imageUrl }
    });

  } catch (err) {
    console.error("UPLOAD PROFILE IMAGE ERROR:", err);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan server" });
  }
};
