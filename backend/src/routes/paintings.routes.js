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
const checkPaintingOwnerId = require("../middlewares/dbCheckers/checkPaintingOwnerId");
const modifyPaintingSchema = require("../Validators/modifyPainting.validator");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");
const deleteFiles = require("../middlewares/fsWriters/deleteFiles");
const addModifyPaintingQueries = require("../middlewares/reqAdders/addModifyPaintingQueries");

const isPreviousPaintingFileToBeDeleted = (request) => {
  const { fileFields } = request.query;
  const { detailedPaintingData, oeuvreFileDeleteFile } = request.body;
  if (!detailedPaintingData) {
    return false;
  }
  const { fileName: prevFileName, fileExtension: prevFileExtension } =
    detailedPaintingData;
  if (!prevFileName || !prevFileExtension) {
    return false;
  }
  if (fileFields === "none" && !oeuvreFileDeleteFile) {
    return false;
  }
  return true;
};

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
  paintingsControllers.readOneAdminWithDetails,
  sendGetRes("detailedPaintingData")
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
  checkPaintingOwnerId,
  addFamilyMemberNumber,

  checkFile("image"),
  writeFile("paintings"),
  createThumbnail("paintings", { medium: true, large: true }),
  paintingsControllers.createPainting
);

router.put(
  "/updatePainting/:id",
  handleMulterParsing({ maxCount: { oeuvreFile: 1 }, fileSize: 100000000 }),
  validateSchema(modifyPaintingSchema),
  checkPaintingVisibility,
  checkPresenceInDb(
    {
      manager: "paintings",
      method: "findById",
      reqParamsKeyParams: { id: "id" },
      errorNumber: "05004",
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
    }
  ),
  checkPaintingOwnerId,
  addFamilyMemberNumber,
  paintingsControllers.readOneAdminWithDetails,
  checkFile("image"),
  writeFile("paintings"),
  createThumbnail("paintings", { medium: true, large: true }),
  deleteFiles(
    [
      {
        folderName: "paintings",
        fileName: { key: "body.detailedPaintingData.fileName" },
        fileExtension: { key: "body.detailedPaintingData.fileExtension" },
      },
      {
        folderName: "paintingsThumb_lg",
        fileName: { key: "body.detailedPaintingData.fileName", suffix: "_lg" },
        fileExtension: { extension: "jpg" },
      },
      {
        folderName: "paintingsThumb_md",
        fileName: { key: "body.detailedPaintingData.fileName", suffix: "_md" },
        fileExtension: { extension: "jpg" },
      },
    ],
    isPreviousPaintingFileToBeDeleted,
    "03002"
  ),
  addModifyPaintingQueries,
  paintingsControllers.modifyPainting
);

module.exports = router;
