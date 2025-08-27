const express = require("express");

const router = express.Router();

const supportsControllers = require("../controllers/supportsControllers");
const validateSchema = require("../middlewares/validateSchema");
const createSupportSchema = require("../Validators/createSupport.validator");
const modifySupportSchema = require("../Validators/modifySupport.validator");
const addSupportKey = require("../middlewares/reqAdders/addSupportKey");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");
const addModifyAttributeQueries = require("../middlewares/reqAdders/addModifyAttributeQueries");
const addDeleteAttributeQueries = require("../middlewares/reqAdders/addDeleteAttributeQueries");

router.get("/", supportsControllers.browse);

router.get(
  "/supportsWithDetails",
  supportsControllers.browseWithDetails,
  sendGetRes("detailedSupports")
);

router.get(
  "/adminOneDetailed/:id",
  supportsControllers.adminFindOneDetailed,
  sendGetRes("detailedSupport")
);

router.post(
  "/createSupport",
  validateSchema(createSupportSchema),
  addSupportKey,
  checkPresenceInDb({
    manager: "supports",
    method: "readByName",
    bodyKeyParams: { name: "supportKey" },
    errorNumber: "05012",
    rejectWhenTrue: true,
  }),
  supportsControllers.createSupport
);

router.put(
  "/modifySupport/:id",
  validateSchema(modifySupportSchema),
  checkPresenceInDb({
    manager: "supports",
    method: "readById",
    reqParamsKeyParams: { id: "id" },
    errorNumber: "05006",
  }),
  supportsControllers.adminFindOneDetailed,
  addModifyAttributeQueries("support"),
  supportsControllers.modifyOneSupport
);

router.delete(
  "/deleteSupport/:id",
  checkPresenceInDb(
    {
      manager: "supports",
      method: "readById",
      reqParamsKeyParams: { id: "id" },
      errorNumber: "05006",
    },
    {
      manager: "supports",
      method: "findPaintingsIdBySupportId",
      reqParamsKeyParams: { supportId: "id" },
      errorNumber: "05017",
      rejectWhenTrue: true,
    }
  ),
  supportsControllers.adminFindOneDetailed,
  addDeleteAttributeQueries("support"),
  supportsControllers.deleteSupport
);

module.exports = router;
