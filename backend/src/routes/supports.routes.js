const express = require("express");

const router = express.Router();

const supportsControllers = require("../controllers/supportsControllers");
const validateSchema = require("../middlewares/validateSchema");
const createSupportSchema = require("../Validators/createSupport.validator");
const addSupportKey = require("../middlewares/reqAdders/addSupportKey");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const errorHandler = require("../middlewares/errorHandler");

router.get("/", supportsControllers.browse);

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
  supportsControllers.createSupport,
  errorHandler
);

module.exports = router;
