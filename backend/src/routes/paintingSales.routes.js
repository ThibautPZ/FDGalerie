const express = require("express");

const router = express.Router();

const paintingSalesControllers = require("../controllers/paintingSalesControllers");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");

router.get(
  "/browseWithDetails",
  paintingSalesControllers.browseWithDetails,
  sendGetRes("detailedSalesData")
);

module.exports = router;
