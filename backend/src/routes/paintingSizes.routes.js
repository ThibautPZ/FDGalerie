const express = require("express");

const router = express.Router();

const validateSchema = require("../middlewares/validateSchema");
const paintingSizesControllers = require("../controllers/paintingSizesControllers");
const createPaintingSizeSchema = require("../Validators/createPaintingSize.validator");
const modifyPaintingSizeSchema = require("../Validators/modifyPaintingSize.validator");
const addPaintingSizeKey = require("../middlewares/reqAdders/addPaintingSizeKey");
const checkPresenceInDb = require("../middlewares/dbCheckers/checkPresenceInDb");
const addModifyAttributeQueries = require("../middlewares/reqAdders/addModifyAttributeQueries");
const addDeleteAttributeQueries = require("../middlewares/reqAdders/addDeleteAttributeQueries");
const sendGetRes = require("../middlewares/resSenders/sendGetRes");

router.get("/", paintingSizesControllers.browse);

router.get(
  "/paintingSizesWithDetails",
  paintingSizesControllers.browseWithDetails,
  sendGetRes("detailedPaintingSizes")
);

router.get(
  "/adminOneDetailed/:id",
  paintingSizesControllers.adminFindOneDetailed,
  sendGetRes("detailedPaintingSize")
);

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
  paintingSizesControllers.createPaintingSize
);

router.put(
  "/modifyPaintingSize/:id",
  validateSchema(modifyPaintingSizeSchema),

  checkPresenceInDb({
    manager: "paintingSizes",
    method: "readById",
    reqParamsKeyParams: { id: "id" },
    errorNumber: "05007",
  }),
  paintingSizesControllers.adminFindOneDetailed,
  addModifyAttributeQueries("paintingSize"),
  paintingSizesControllers.modifyOnePaintingSize
);

router.delete(
  "/deletePaintingSize/:id",
  checkPresenceInDb(
    {
      manager: "paintingSizes",
      method: "readById",
      reqParamsKeyParams: { id: "id" },
      errorNumber: "05007",
    },
    {
      manager: "paintingSizes",
      method: "findPaintingsIdByPaintingSizeId",
      reqParamsKeyParams: { paintingSizeId: "id" },
      errorNumber: "05016",
      rejectWhenTrue: true,
    }
  ),
  paintingSizesControllers.adminFindOneDetailed,
  addDeleteAttributeQueries("paintingSize"),
  paintingSizesControllers.deletePaintingSize
);

module.exports = router;
