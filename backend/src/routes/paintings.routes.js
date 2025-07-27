const express = require("express");

const router = express.Router();

const paintingsControllers = require("../controllers/paintingsControllers");
const errorHandler = require("../middlewares/errorHandler");
const handleMulterParsing = require("../middlewares/handleMulterParsing");
const handleVerificationsOnReqIfNoFiles = require("../middlewares/handleVerificationsOnReqIfNoFiles");
const createPaintingSchema = require("../Validators/createPainting.validator");
const checkPaintingTitleDoesntExist = require("../services/checkFunctions/checkPaintingTitleDoesntExist");
const createThumbnail = require("../middlewares/createThumbnail");
const addFamilyMemberNumber = require("../middlewares/reqAdders/addFamiliyMemberNumber");
const checkBodyKeyValuesFuncProvider = require("../services/checkFunctionsProvider/checkBodyKeyValuesFuncProvider");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");

const checkPaintingNotPublic = checkBodyKeyValuesFuncProvider([
  {
    fieldName: "oeuvreVisibility",
    values: [true],
    errorNum: "05004",
    isMatchInvalid: true,
  },
]);

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

router.get(
  "/adminDetailed",
  paintingsControllers.browseAdminWithDetails,
  errorHandler
);

router.get(
  "/allPublicMinimalInfos",
  paintingsControllers.readAllPublicMinimalInfos
);

router.get("/:id", paintingsControllers.readPublicByTitle);

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
    checkPaintingTitleDoesntExist,
    checkPaintingNotPublic
  ),
  createThumbnail("paintings", { medium: true, large: true }),
  addFamilyMemberNumber,
  checkPresenceInDb(
    {
      manager: "supports",
      method: "readById",
      bodyKeyParams: { id: "supportId" },
      errorNumber: "02002",
    },
    {
      manager: "techniques",
      method: "countByIds",
      bodyKeyParams: { ids: "techniqueId" },
      errorNumber: "02004",
      count: {
        param: "techniqueId",
      },
    }
  ),
  paintingsControllers.createPainting,
  errorHandler
);

module.exports = router;
// oeuvreAvailabilityid, formatid, supportid, techniquesidss
