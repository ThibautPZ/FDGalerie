const express = require("express");

const router = express.Router();

const paintingGiftsControllers = require("../controllers/paintingGiftsControllers");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");

router.get(
  "/browseWithDetails",
  paintingGiftsControllers.browseWithDetails,
  sendGetRes("detailedGiftsData")
);

module.exports = router;
