const { readFile, writeFile } = require("fs").promises;
const path = require("path");
const async = require("async");
const asyncHandler = require("express-async-handler");

const tables = require("../tables");
const successfulResMsg = require("../../public/json/successfulResMsg.json");
const {
  giveQueryPromise,
  giveSuccesfulAndFailedQueryNames,
} = require("../helpers/dbAsyncQueriesHelper");
const CustomErrorClass = require("../services/ErrorClasses");

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

  async function updateJSONFile(
    operation,
    fileFolderPath,
    fileName,
    key,
    value
  ) {
    try {
      const filePath = path.join(
        __dirname,
        `${fileFolderPath}/${fileName}.json`
      );
      const data = await readFile(filePath);
      const jsonData = JSON.parse(data);
      if (operation === "add") {
        jsonData[key] = value;
      }
      if (operation === "remove") {
        delete jsonData[key];
      }
      await writeFile(filePath, JSON.stringify(jsonData, null, 2));

      return true;
    } catch (err) {
      console.error(`Error updating JSON file: ${err.message}`);
      return err;
    }
  }

  const filesResults = await async.parallel({
    fr: async.retryable(5, async () =>
      updateJSONFile(
        "add",
        "../../public/locales/fr",
        "techniques",
        techniqueKey,
        techniqueNameFr
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJSONFile(
        "add",
        "../../public/locales/enUS",
        "techniques",
        techniqueKey,
        techniqueNameEnUS
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJSONFile(
        "add",
        "../../public/locales/enGB",
        "techniques",
        techniqueKey,
        techniqueNameEnGB
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
        updateJSONFile(
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
    ...successfulResMsg.techniquesController.createTechnique,
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
