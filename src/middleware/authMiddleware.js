const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Cek apakah header Authorization ada dan formatnya benar
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Token tidak ditemukan",
    });
  }

  // 2️⃣ Ambil token
  const token = authHeader.split(" ")[1];

  try {
    // 3️⃣ Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Simpan data user ke req untuk digunakan di controller
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next(); // Lanjut ke route berikutnya
  } catch (err) {
    console.error("JWT ERROR:", err.message); // <--- logging untuk debugging
    return res.status(401).json({
      status: false,
      message: "Token tidak valid atau sudah kadaluarsa",
    });
  }
};
