const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper: validasi email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// REGISTER
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validasi input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ status: false, message: "Semua field wajib diisi" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ status: false, message: "Format email tidak valid" });
    }

    if (password.length < 8) {
      return res.status(400).json({ status: false, message: "Password minimal 8 karakter" });
    }

    // Cek email sudah terdaftar
    const [existingUser] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ status: false, message: "Email sudah terdaftar" });
    }

    // Hash password & simpan user
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
      [first_name, last_name, email, hashedPassword]
    );

    return res.status(201).json({ status: true, message: "Registrasi berhasil" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan server" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email dan password wajib diisi" });
    }

    // Ambil user
    const [rows] = await pool.query(
      "SELECT id, first_name, last_name, email, password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ status: false, message: "Email atau password salah" });
    }

    const user = rows[0];

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: false, message: "Email atau password salah" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      status: true,
      message: "Login berhasil",
      data: {
        token,
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan server" });
  }
};
