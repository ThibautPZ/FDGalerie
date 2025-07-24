const express = require("express");

const router = express.Router();

const familiesControllers = require("../controllers/familiesControllers");

router.get("/", familiesControllers.browse);

module.exports = router;
