const async = require("async");
const asyncHandler = require("express-async-handler");

const tables = require("../tables");
const {
  giveQueryPromise,
  giveDbQueriesSpecs,
  giveDbQueryUndoSpecs,
  giveSuccesfulAndFailedQueryNames,
} = require("../helpers/dbAsyncQueriesHelper");
const successfulResMsg = require("../../public/json/successfulResMsg.json");
const CustomErrorClass = require("../services/ErrorClasses");
const updateJsonFile = require("../services/updateJsonFile");

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.paintingSizes.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const createPaintingSize = asyncHandler(async (req, res, next) => {
  const { body } = req;

  const {
    paintingSizeKey,
    paintingSizeNameFr,
    paintingSizeDescriptionFr,
    paintingSizeNameEnUS,
    paintingSizeDescriptionEnUS,
    paintingSizeNameEnGB,
    paintingSizeDescriptionEnGB,
  } = body;

  const [createPaintingSizeQuerySpecs] = giveDbQueriesSpecs([
    { name: "createPaintingSize", queryArgs: [paintingSizeKey] },
  ]);

  const result = await giveQueryPromise(createPaintingSizeQuerySpecs, 5);

  if (!result.affectedRows) {
    const err = new CustomErrorClass("06008");
    return next(err);
  }

  const filesResults = await async.parallel({
    fr: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/fr",
        "paintingSizes",
        paintingSizeKey,
        {
          name: paintingSizeNameFr,
          description: paintingSizeDescriptionFr || "",
        }
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/enUS",
        "paintingSizes",
        paintingSizeKey,
        {
          name: paintingSizeNameEnUS,
          description: paintingSizeDescriptionEnUS || "",
        }
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/enGB",
        "paintingSizes",
        paintingSizeKey,
        {
          name: paintingSizeNameEnGB,
          description: paintingSizeDescriptionEnGB || "",
        }
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
          "paintingSizes",
          paintingSizeKey
        )
      );
    });
    await async.parallel(undoPromises);

    const undoNewPaintingSizeQuerySpecs = giveDbQueryUndoSpecs({
      name: "createPaintingSize",
      undoQueryArgs: [result.insertId],
    });

    await giveQueryPromise(undoNewPaintingSizeQuerySpecs);
    const err = new CustomErrorClass("06008", failures);
    return next(err);
  }

  const successObj = {
    ...successfulResMsg.paintingSizesControllers.createPaintingSize,
    infoData: {
      insertText1: paintingSizeNameFr,
    },
  };
  return res.status(201).send({ success: true, successObj });
});

module.exports = {
  browse,
  createPaintingSize,
};
