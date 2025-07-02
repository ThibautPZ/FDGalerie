const express = require("express");

const router = express.Router();

const techniquesControllers = require("../controllers/techniquesControllers");

router.get("/", techniquesControllers.browse);

module.exports = router;
