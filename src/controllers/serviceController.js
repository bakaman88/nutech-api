const db = require("../db");

exports.getServices = async (req, res) => {
  try {
    const [services] = await db.query(
      "SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY service_name ASC"
    );

    return res.json({
      status: 0,
      message: "Sukses",
      data: services,
    });
  } catch (error) {
    console.error("GET SERVICES ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
    });
  }
};
