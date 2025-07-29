const async = require("async");
const asyncHandler = require("express-async-handler");

const tables = require("../tables");
const successfulResMsg = require("../../public/json/successfulResMsg.json");
const {
  giveQueryPromise,
  giveSuccesfulAndFailedQueryNames,
} = require("../helpers/dbAsyncQueriesHelper");
const CustomErrorClass = require("../services/ErrorClasses");
const updateJsonFile = require("../services/updateJsonFile");

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.techniques.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const createOneTechnique = asyncHandler(async (req, res, next) => {
  const {
    techniqueKey,
    techniqueNameFr,
    techniqueNameEnUS,
    techniqueNameEnGB,
  } = req.body;

  const result = await giveQueryPromise(
    {
      manager: "techniques",
      method: "insertTechnique",
      queryArgs: [techniqueKey],
    },
    5
  );

  if (!result.affectedRows) {
    const err = new CustomErrorClass("06006");
    return next(err);
  }

  const filesResults = await async.parallel({
    fr: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/fr",
        "techniques",
        techniqueKey,
        { name: techniqueNameFr }
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/enUS",
        "techniques",
        techniqueKey,
        { name: techniqueNameEnUS }
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../public/locales/enGB",
        "techniques",
        techniqueKey,
        { name: techniqueNameEnGB }
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
          "techniques",
          techniqueKey
        )
      );
    });
    await async.parallel(undoPromises);

    await giveQueryPromise(
      {
        manager: "techniques",
        method: "deleteById",
        queryArgs: [result.insertId],
      },
      5
    );

    const err = new CustomErrorClass("06006", failures);
    return next(err);
  }

  const successObj = {
    ...successfulResMsg.techniquesControllers.createTechnique,
    infoData: {
      insertText1: techniqueNameFr,
    },
  };
  return res.status(201).send({ success: true, successObj });
});

module.exports = {
  browse,
  createOneTechnique,
};
