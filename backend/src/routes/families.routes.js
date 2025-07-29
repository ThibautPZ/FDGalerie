const express = require("express");

const router = express.Router();

const familiesControllers = require("../controllers/familiesControllers");

const validateSchema = require("../middlewares/validateSchema");
const createFamilySchema = require("../Validators/createFamily.validator");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const errorHandler = require("../middlewares/errorHandler");
const addFamilyKey = require("../middlewares/reqAdders/addFamilyKey");

router.get("/", familiesControllers.browse);

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
  familiesControllers.createFamily,
  errorHandler
);

module.exports = router;
