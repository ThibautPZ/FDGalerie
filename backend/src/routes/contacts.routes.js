const express = require("express");

const router = express.Router();

const {
  browse,
  browseWithPaintingsOwningCount,
  readById,
} = require("../controllers/contactsControllers");
const errorHandler = require("../middlewares/errorHandler");

router.get("/browseWithPaintingsOwningCount", browseWithPaintingsOwningCount);

router.get("/:id", readById);

router.get("/", browse);

router.get("/*", errorHandler);

module.exports = router;
