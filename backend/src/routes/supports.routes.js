const express = require("express");

const router = express.Router();

const supportsControllers = require("../controllers/supportsControllers");
const validateSchema = require("../middlewares/validateSchema");
const createSupportSchema = require("../Validators/createSupport.validator");
const addSupportKey = require("../middlewares/reqAdders/addSupportKey");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");

router.get("/", supportsControllers.browse);

router.get(
  "/supportsWithDetails",
  supportsControllers.browseWithDetails,
  sendGetRes("detailedSupportsData")
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

module.exports = router;
