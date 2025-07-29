const async = require("async");
const asyncHandler = require("express-async-handler");

const tables = require("../tables");
const successfulResMsg = require("../../public/json/successfulResMsg.json");
const {
  giveDbQueriesSpecs,
  giveQueryPromise,
  giveSuccesfulAndFailedQueryNames,
} = require("../helpers/dbAsyncQueriesHelper");
const CustomErrorClass = require("../services/ErrorClasses");
const updateJsonFile = require("../services/updateJsonFile");

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.families.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const createFamily = asyncHandler(async (req, res, next) => {
  const {
    familyName,
    familyKey,
    familyDescriptionFr,
    familyDescriptionEnUS,
    familyDescriptionEnGB,
  } = req.body;

  const [createFamilyQuerySpecs] = giveDbQueriesSpecs([
    {
      name: "createFamily",
      queryArgs: [familyKey],
    },
  ]);

  const result = await giveQueryPromise(createFamilyQuerySpecs, 5);

  if (!result.affectedRows) {
    const err = new CustomErrorClass("06007");
    return next(err);
  }

  const filesResults = await async.parallel({
    fr: async.retryable(5, async () =>
      updateJsonFile("add", "../../public/locales/fr", "families", familyKey, {
        name: familyName,
        description: familyDescriptionFr || "",
      })
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/enUS",
        "families",
        familyKey,
        { name: familyName, description: familyDescriptionEnUS || "" }
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/enGB",
        "families",
        familyKey,
        { name: familyName, description: familyDescriptionEnGB || "" }
      )
    ),
  });

  const { success, failures } = giveSuccesfulAndFailedQueryNames(
    filesResults,
    true,
    false
  );

  if (failures.length) {
    const undoPromises = {};
    success.forEach((lang) => {
      undoPromises[lang] = async.retryable(5, async () =>
        updateJsonFile(
          "remove",
          `../../public/locales/${lang}`,
          "families",
          familyKey
        )
      );
    });
    await async.parallel(undoPromises);

    await giveQueryPromise(
      {
        manager: "families",
        method: "deleteById",
        queryArgs: [result.insertId],
      },
      5
    );

    const err = new CustomErrorClass("06007", failures);
    return next(err);
  }

  const successObj = {
    ...successfulResMsg.familiesControllers.createFamily,
    infoData: { insertText1: familyName },
  };
  return res.status(201).json({ success: true, successObj });
});

module.exports = {
  browse,
  createFamily,
};
