const express = require("express");

const router = express.Router();

const familiesControllers = require("../controllers/familiesControllers");
const validateSchema = require("../middlewares/validateSchema");
const createFamilySchema = require("../Validators/createFamily.validator");
const modifyFamilySchema = require("../Validators/modifyFamily.validator");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const addFamilyKey = require("../middlewares/reqAdders/addFamilyKey");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");
const addModifyAttributeQueries = require("../middlewares/reqAdders/addModifyAttributeQueries");
const addDeleteAttributeQueries = require("../middlewares/reqAdders/addDeleteAttributeQueries");

router.get("/", familiesControllers.browse);

router.get(
  "/familiesWithDetails",
  familiesControllers.browseWithDetails,
  sendGetRes("detailedFamilies")
);

router.get(
  "/adminOneDetailed/:id",
  familiesControllers.adminFindOneDetailed,
  sendGetRes("detailedFamily")
);

router.post(
  "/createFamily",
  validateSchema(createFamilySchema),
  addFamilyKey,
  checkPresenceInDb({
    manager: "families",
    method: "readByName",
    bodyKeyParams: { name: "familyName" },
    errorNumber: "05010",
    rejectWhenTrue: true,
  }),
  familiesControllers.createFamily
);

router.put(
  "/modifyFamily/:id",
  validateSchema(modifyFamilySchema),
  checkPresenceInDb({
    manager: "families",
    method: "findById",
    reqParamsKeyParams: { id: "id" },
    errorNumber: "07008",
  }),
  familiesControllers.adminFindOneDetailed,
  addModifyAttributeQueries("family"),
  familiesControllers.modifyOneFamily
);

router.delete(
  "/deleteFamily/:id",
  checkPresenceInDb(
    {
      manager: "families",
      method: "findById",
      reqParamsKeyParams: { id: "id" },
      errorNumber: "07008",
    },
    {
      manager: "families",
      method: "findPaintingsIdByFamilyId",
      reqParamsKeyParams: { familyId: "id" },
      errorNumber: "05015",
      rejectWhenTrue: true,
    }
  ),
  familiesControllers.adminFindOneDetailed,
  addDeleteAttributeQueries("family"),
  familiesControllers.deleteFamily
);

module.exports = router;
