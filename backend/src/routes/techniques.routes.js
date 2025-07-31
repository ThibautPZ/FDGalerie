const express = require("express");

const router = express.Router();

const techniquesControllers = require("../controllers/techniquesControllers");
const createTechniqueSchema = require("../Validators/createTechnique.validator");
const addTechniqueKey = require("../middlewares/reqAdders/addTechniqueKey");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const validateSchema = require("../middlewares/validateSchema");

router.get("/", techniquesControllers.browse);

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

module.exports = router;
