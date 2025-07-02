const express = require("express");

const router = express.Router();

const { browse, readById } = require("../controllers/contactsControllers");
const errorHandler = require("../middlewares/errorHandler");

router.get("/", browse);

router.get("/:id", readById);

router.get("/*", errorHandler);

module.exports = router;
