const express = require("express");

const router = express.Router();

const paintingReservationsControllers = require("../controllers/paintingReservationsControllers");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");

router.get(
  "/browseWithDetails",
  paintingReservationsControllers.browseWithDetails,
  sendGetRes("detailedReservationsData")
);

module.exports = router;
