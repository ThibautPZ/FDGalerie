const express = require("express");

const router = express.Router();

const paintingsControllers = require("../controllers/paintingsControllers");
const handleMulterParsing = require("../middlewares/handleMulterParsing");
const createPaintingSchema = require("../Validators/createPainting.validator");
const createThumbnail = require("../middlewares/createThumbnail");
const addFamilyMemberNumber = require("../middlewares/reqAdders/addFamiliyMemberNumber");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const checkFile = require("../middlewares/reqCheckers/checkFile");
const writeFile = require("../middlewares/fsWriters/writeFile");
const validateSchema = require("../middlewares/validateSchema");
const checkPaintingVisibility = require("../middlewares/reqCheckers/checkPaintingVisibility");

router.get("/sizes", paintingsControllers.readAllSizes);

router.get("/techniques", paintingsControllers.readAllTechniques);

router.get(
  "/publicTechnique/:techniqueName",
  paintingsControllers.readPublicByTechnique
);

router.get(
  "/publicFormat/:formatName",
  paintingsControllers.readPublicByFormat
);

router.get("/adminDetailed", paintingsControllers.browseAdminWithDetails);

router.get(
  "/adminOneDetailed/:id",
  paintingsControllers.readOneAdminWithDetails
);

router.get(
  "/allPublicMinimalInfos",
  paintingsControllers.readAllPublicMinimalInfos
);

router.get("/:id", paintingsControllers.readPublicByTitle);

router.get("/", paintingsControllers.browse);

router.post(
  "/createPainting",
  handleMulterParsing({ maxCount: { oeuvreFile: 1 }, fileSize: 100000000 }),
  validateSchema(createPaintingSchema),
  checkPaintingVisibility,
  checkPresenceInDb(
    {
      manager: "paintings",
      method: "findByTitle",
      bodyKeyParams: { title: "oeuvreTitle" },
      errorNumber: "05003",
      rejectWhenTrue: true,
    },
    {
      manager: "supports",
      method: "readById",
      bodyKeyParams: { id: "oeuvreSupport" },
      errorNumber: "05006",
    },
    {
      manager: "paintingSizes",
      method: "readById",
      bodyKeyParams: { id: "oeuvreFormat" },
      errorNumber: "05007",
    },
    {
      manager: "techniques",
      method: "countByIds",
      bodyKeyParams: { ids: "oeuvreTechnique" },
      errorNumber: "05008",
      count: {
        param: "oeuvreTechnique",
      },
    },
    {
      manager: "paintingsAvailabilities",
      method: "readById",
      bodyKeyParams: { id: "oeuvreAvailability" },
      errorNumber: "05009",
    }
  ),
  checkFile("image"),
  writeFile("paintings"),
  createThumbnail("paintings", { medium: true, large: true }),
  addFamilyMemberNumber,
  paintingsControllers.createPainting
);

module.exports = router;
