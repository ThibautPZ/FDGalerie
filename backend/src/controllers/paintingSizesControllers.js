const path = require("node:path");
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
const updateJsonFile = require("../services/fileSystem/updateJsonFile");
const readJsonFile = require("../services/fileSystem/readJsonFile");
const { isError } = require("../services/typesAndValidationChecks");

const givePath = (language) =>
  path.join(__dirname, `../../public/locales/${language}/paintingSizes.json`);

const baseQueriesWithReadJson = {
  jsonFr: async.retryable(5, async () => readJsonFile(givePath("fr"))),
  jsonEnUS: async.retryable(5, async () => readJsonFile(givePath("enUS"))),
  jsonEnGB: async.retryable(5, async () => readJsonFile(givePath("enGB"))),
};

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.paintingSizes.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const browseWithDetails = asyncHandler(async (req, res, next) => {
  const queries = {
    ...baseQueriesWithReadJson,
    paintingSizes: async.retryable(5, async () => {
      try {
        const [rows] = await tables.paintingSizes.readWithDetails();
        return rows;
      } catch (error) {
        return error;
      }
    }),
  };

  const results = await async.parallel(queries);

  const { success } = giveSuccesfulAndFailedQueryNames(results);

  const detailedPaintingSizes = {};
  for (let i = 0; i < success.length; i += 1) {
    const queryName = success[i];
    detailedPaintingSizes[queryName] = results[queryName];
  }

  req.body.detailedPaintingSizes = detailedPaintingSizes;

  return next();
});

const adminFindOneDetailed = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const queries = {
    ...baseQueriesWithReadJson,
    paintingSize: async.retryable(5, async () => {
      try {
        const [result] = await tables.paintingSizes.findOneAdminWithDetails(id);
        return result;
      } catch (error) {
        return error;
      }
    }),
    oeuvres: async.retryable(5, async () => {
      try {
        const [result] = await tables.paintings.findAllPaintingsBySize(id);
        return result;
      } catch (error) {
        return error;
      }
    }),
  };
  const results = await async.parallel(queries);

  const { failures } = giveSuccesfulAndFailedQueryNames(results, true);
  if (failures.length) {
    return next(new CustomErrorClass("07005", failures));
  }

  const { paintingSize, oeuvres, jsonFr, jsonEnUS, jsonEnGB } = results;

  const paintingSizeData = paintingSize[0];
  const untranslatedName = paintingSizeData.name;

  const detailedPaintingSize = {
    ...paintingSizeData,
    relatedOeuvres: oeuvres,
    nameFr: jsonFr[untranslatedName].name,
    nameEnUS: jsonEnUS[untranslatedName].name,
    nameEnGB: jsonEnGB[untranslatedName].name,
    descriptionFr: jsonFr[untranslatedName].description,
    descriptionEnUS: jsonEnUS[untranslatedName].description,
    descriptionEnGB: jsonEnGB[untranslatedName].description,
  };

  req.body.detailedPaintingSize = detailedPaintingSize;

  return next();
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
        "../../../public/locales/fr",
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
        "../../../public/locales/enUS",
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
        "../../../public/locales/enGB",
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
      undoPromises[lang] = async.retryable(5, async () =>
        updateJsonFile(
          "remove",
          `../../../public/locales/${lang}`,
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

const modifyOnePaintingSize = asyncHandler(async (req, res, next) => {
  const {
    jsonKey,
    modifyAttributeQueries,
    modifiedFields,
    paintingSizeNameFr,
    detailedPaintingSize,
  } = req.body;

  const modifyingQueries = {};

  for (const [language, queries] of Object.entries(modifyAttributeQueries)) {
    const { queries: queriesObj } = queries;
    modifyingQueries[language] = async.retryable(5, async () =>
      updateJsonFile(
        "add",
        `../../../public/locales/${language}`,
        "paintingSizes",
        jsonKey,
        queriesObj
      )
    );
  }

  const results = await async.parallel(modifyingQueries);

  const { success, failures } = giveSuccesfulAndFailedQueryNames(
    results,
    true,
    false
  );

  if (failures.length) {
    if (success.length) {
      const undoPromises = {};
      success.forEach((lang) => {
        undoPromises[lang] = async.retryable(5, async () =>
          updateJsonFile(
            "add",
            `../../../public/locales/${lang}`,
            "paintingSizes",
            jsonKey,
            modifyAttributeQueries[lang].undoQueries
          )
        );
      });

      await async.parallel(undoPromises);
    }
    return next(new CustomErrorClass("06015", failures));
  }

  const successObj = modifiedFields.paintingSizeNameFr
    ? {
        ...successfulResMsg.paintingSizesControllers.modifyPaintingSizeName,
        infoData: {
          insertText1: paintingSizeNameFr,
          insertText2: detailedPaintingSize.nameFr,
        },
      }
    : {
        ...successfulResMsg.paintingSizesControllers.modifyPaintingSize,
        infoData: {
          insertText1: paintingSizeNameFr,
        },
      };

  return res.status(200).json({ success: true, successObj });
});

const deletePaintingSize = asyncHandler(async (req, res, next) => {
  const { body, params } = req;
  const { id } = params;
  const { jsonKeyName, nameFr, jsonQueriesArgs } = body.deleteAttributeQueries;

  const deletePaintingSizeQuerySpecsReference = {
    name: "deletePaintingSize",
    queryArgs: [id],
    undoQueryArgs: [jsonKeyName],
  };

  const [deletePaintingSizeQuerySpecs] = giveDbQueriesSpecs([
    deletePaintingSizeQuerySpecsReference,
  ]);

  const jsonDeleteQueries = {
    fr: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/fr`,
        "paintingSizes",
        jsonKeyName
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/enUS`,
        "paintingSizes",
        jsonKeyName
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/enGB`,
        "paintingSizes",
        jsonKeyName
      )
    ),
  };

  const undoPromises = {};

  const undoJsonDelete = async (success) => {
    if (!success.length) {
      return;
    }
    success.forEach((lang) => {
      undoPromises[lang] = async.retryable(5, async () =>
        updateJsonFile(
          "add",
          `../../../public/locales/${lang}`,
          "paintingSizes",
          jsonKeyName,
          jsonQueriesArgs[lang]
        )
      );
    });
    async.parallel(undoPromises);
  };

  const jsonDeleteResults = await async.parallel(jsonDeleteQueries);

  const { success, failures } = giveSuccesfulAndFailedQueryNames(
    jsonDeleteResults,
    true,
    false
  );

  if (failures.length) {
    await undoJsonDelete(success);
    return next(new CustomErrorClass("06016", failures));
  }

  const results = await giveQueryPromise(deletePaintingSizeQuerySpecs, 5);

  if (isError(results)) {
    await undoJsonDelete(success);
    return next(new CustomErrorClass("06016", results));
  }

  const successObj = {
    ...successfulResMsg.paintingSizesControllers.deletePaintingSize,
    infoData: {
      insertText1: nameFr,
    },
  };

  return res.status(200).json({ success: true, successObj });
});

module.exports = {
  browse,
  browseWithDetails,
  adminFindOneDetailed,
  createPaintingSize,
  modifyOnePaintingSize,
  deletePaintingSize,
};
