const express = require("express");

const router = express.Router();

const techniquesControllers = require("../controllers/techniquesControllers");
const createTechniqueSchema = require("../Validators/createTechnique.validator");
const modifyTechniqueSchema = require("../Validators/modifyTechnique.validator");
const addTechniqueKey = require("../middlewares/reqAdders/addTechniqueKey");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const validateSchema = require("../middlewares/validateSchema");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");
const addModifyTechniqueQueries = require("../middlewares/reqAdders/addModifyTechniqueQueries");
const addDeleteTechniqueQueries = require("../middlewares/reqAdders/addDeleteTechniqueQueries");

router.get("/", techniquesControllers.browse, sendGetRes("techniques"));

router.get(
  "/techniquesWithDetails",
  techniquesControllers.browseWithDetails,
  sendGetRes("detailedTechniques")
);

router.get(
  "/adminOneDetailed/:id",
  techniquesControllers.adminFindOneDetailed,
  sendGetRes("detailedTechnique")
);

router.post(
  "/createTechnique",
  validateSchema(createTechniqueSchema),
  addTechniqueKey,
  checkPresenceInDb({
    manager: "techniques",
    method: "readByName",
    bodyKeyParams: { name: "techniqueKey" },
    errorNumber: "05005",
    rejectWhenTrue: true,
  }),
  techniquesControllers.createOneTechnique
);

router.put(
  "/modifyTechnique/:id",
  validateSchema(modifyTechniqueSchema),
  checkPresenceInDb({
    manager: "techniques",
    method: "findById",
    reqParamsKeyParams: { id: "id" },
    errorNumber: "05008",
  }),
  techniquesControllers.adminFindOneDetailed,
  addModifyTechniqueQueries,
  techniquesControllers.modifyOneTechnique
);

router.delete(
  "/deleteTechnique/:id",
  checkPresenceInDb(
    {
      manager: "techniques",
      method: "findById",
      reqParamsKeyParams: { id: "id" },
      errorNumber: "05008",
    },
    {
      manager: "paintingsHasTechniques",
      method: "findPaintingsIdByTechniqueId",
      reqParamsKeyParams: { techniqueId: "id" },
      errorNumber: "05014",
      rejectWhenTrue: true,
    }
  ),
  techniquesControllers.adminFindOneDetailed,
  addDeleteTechniqueQueries,
  techniquesControllers.deleteTechnique
);

module.exports = router;
