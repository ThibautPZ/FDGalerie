const async = require("async");
const asyncHandler = require("express-async-handler");

const tables = require("../tables");
const CustomErrorClass = require("../services/ErrorClasses");
const successfulResMsg = require("../../public/json/successfulResMsg.json");
const {
  giveDbQueriesSpecs,
  giveSuccesfulAndFailedQueryNames,
  giveQueryPromise,
  giveDbQueryUndoSpecs,
} = require("../helpers/dbAsyncQueriesHelper");
const updateJsonFile = require("../services/updateJsonFile");

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.supports.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const createSupport = asyncHandler(async (req, res, next) => {
  const {
    supportKey,
    supportNameFr,
    supportNameEnUS,
    supportNameEnGB,
    supportDescriptionFr,
    supportDescriptionEnUS,
    supportDescriptionEnGB,
  } = req.body;

  const [createSupportQuerySpecs] = giveDbQueriesSpecs([
    {
      name: "createSupport",
      queryArgs: [supportKey],
    },
  ]);

  const result = await giveQueryPromise(createSupportQuerySpecs, 5);

  if (!result.affectedRows) {
    const err = new Error("06009");
    return next(err);
  }

  const filesResults = await async.parallel({
    fr: async.retryable(5, async () =>
      updateJsonFile("add", "../../public/locales/fr", "supports", supportKey, {
        name: supportNameFr,
        description: supportDescriptionFr || "",
      })
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/enUS",
        "supports",
        supportKey,
        { name: supportNameEnUS, description: supportDescriptionEnUS || "" }
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/enGB",
        "supports",
        supportKey,
        { name: supportNameEnGB, description: supportDescriptionEnGB || "" }
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
      undoPromises[lang] = async.retryable(
        5,
        updateJsonFile(
          "remove",
          `../../public/locales/${lang}`,
          "supports",
          supportKey
        )
      );
    });
    await async.parallel(undoPromises);

    Object.assign(createSupportQuerySpecs, {
      undoQueryArgs: [result.insertId],
    });

    const undoNewSupportQuerySpecs = giveDbQueryUndoSpecs([
      createSupportQuerySpecs,
    ]);

    await giveQueryPromise(undoNewSupportQuerySpecs);
    const err = await new CustomErrorClass("06009", failures);
    return next(err);
  }

  const successObj = {
    ...successfulResMsg.supportsControllers.createSupport,
    infoData: { insertText1: supportNameFr },
  };
  return res.status(201).json({ success: true, successObj });
});

module.exports = {
  browse,
  createSupport,
};
