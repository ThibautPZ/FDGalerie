const asyncHandler = require("express-async-handler");

const tables = require("../tables");
const successfulResMsg = require("../../public/json/successfulResMsg.json");
const {
  giveDbQueriesSpecs,
  giveQueryPromise,
} = require("../helpers/dbAsyncQueriesHelper");
const CustomErrorClass = require("../services/ErrorClasses");

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.families.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const createFamily = asyncHandler(async (req, res, next) => {
  const { familyName, familyDescription } = req.body;

  const [createFamilyQuerySpecs] = giveDbQueriesSpecs([
    {
      name: "createFamily",
      queryArgs: [familyName, familyDescription],
    },
  ]);

  const result = await giveQueryPromise(createFamilyQuerySpecs, 5);

  if (!result.affectedRows) {
    const err = new CustomErrorClass("06007");
    return next(err);
  }

  const successObj = {
    ...successfulResMsg.familiesControllers.createFamily,
    infoData: { insertText1: familyName },
  };
  return res.status(200).json({ success: true, successObj });
});

module.exports = {
  browse,
  createFamily,
};
