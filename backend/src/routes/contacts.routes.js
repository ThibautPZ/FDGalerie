const express = require("express");

const router = express.Router();

const {
  browse,
  browseWithPaintingsOwningCount,
  readById,
} = require("../controllers/contactsControllers");

router.get("/browseWithPaintingsOwningCount", browseWithPaintingsOwningCount);

router.get("/:id", readById);

router.get("/", browse);

module.exports = router;
