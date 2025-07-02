const express = require("express");

const router = express.Router();

const paintingSizesControllers = require("../controllers/paintingSizesControllers");

router.get("/", paintingSizesControllers.browse);

module.exports = router;
