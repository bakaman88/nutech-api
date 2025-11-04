const db = require("../db");

// GET list banner (Public)
exports.getBanners = async (req, res) => {
  try {
    const [banners] = await db.query(
      "SELECT id, title, images, description FROM banners ORDER BY id DESC"
    );

    return res.json({
      status: true,
      message: "Berhasil mendapatkan daftar banner",
      data: banners,
    });

  } catch (error) {
    console.error("GET BANNERS ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
    });
  }
};
