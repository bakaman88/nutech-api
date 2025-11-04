const express = require("express");
const router = express.Router();
const { getBanners } = require("../controllers/bannerController");

// Public: GET list banner
router.get("/", getBanners);

module.exports = router;
