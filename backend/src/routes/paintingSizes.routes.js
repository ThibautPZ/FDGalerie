const express = require("express");

const router = express.Router();

const validateSchema = require("../middlewares/validateSchema");
const paintingSizesControllers = require("../controllers/paintingSizesControllers");
const createPaintingSizeSchema = require("../Validators/createPaintingSize.validator");
const errorHandler = require("../middlewares/errorHandler");
const addPaintingSizeKey = require("../middlewares/reqAdders/addPaintingSizeKey");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");

router.get("/", paintingSizesControllers.browse);

router.post(
  "/createPaintingSize",
  validateSchema(createPaintingSizeSchema),
  addPaintingSizeKey,
  checkPresenceInDb({
    manager: "paintingSizes",
    method: "readByName",
    bodyKeyParams: { name: "paintingSizeKey" },
    errorNumber: "05011",
    rejectWhenTrue: true,
  }),
  paintingSizesControllers.createPaintingSize,
  errorHandler
);

module.exports = router;
