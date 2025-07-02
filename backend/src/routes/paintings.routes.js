const express = require("express");

const router = express.Router();

const paintingsControllers = require("../controllers/paintingsControllers");
const errorHandler = require("../middlewares/errorHandler");
const handleMulterParsing = require("../middlewares/handleMulterParsing");
const handleVerificationsOnReqIfNoFiles = require("../middlewares/handleVerificationsOnReqIfNoFiles");
const createPaintingSchema = require("../Validators/createPainting.validator");
const checkPaintingTitleDoesntExist = require("../services/checkFunctions/checkPaintingTitleDoesntExist");

const createContact = require("../middlewares/dbWriters/createContact");

router.get("/sizes", paintingsControllers.readAllSizes);

router.get("/techniques", paintingsControllers.readAllTechniques);

router.get("/technique/:id", paintingsControllers.readByTechnique);

router.get("/format/:id", paintingsControllers.readByFormat);

router.get("/details", paintingsControllers.browseWithDetails, errorHandler);

router.get("/:id", paintingsControllers.readByTitle);

router.get("/", paintingsControllers.browse);

router.post(
  "/createPainting",

  handleMulterParsing(
    {
      folderName: "paintings",
      fileType: "image",
    },
    { maxCount: { oeuvreFile: 1 }, fileSize: 100000000 },
    createPaintingSchema,
    checkPaintingTitleDoesntExist
  ),
  handleVerificationsOnReqIfNoFiles(
    createPaintingSchema,
    checkPaintingTitleDoesntExist
  ),
  createContact,
  paintingsControllers.createPainting,
  errorHandler
);

module.exports = router;
