const express = require("express");

const router = express.Router();

const supportsControllers = require("../controllers/supportsControllers");

router.get("/", supportsControllers.browse);

module.exports = router;
