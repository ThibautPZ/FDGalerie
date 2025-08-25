const path = require("node:path");
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
const updateJsonFile = require("../services/fileSystem/updateJsonFile");
const readJsonFile = require("../services/fileSystem/readJsonFile");
const { isError } = require("../services/typesAndValidationChecks");

const givePath = (language) =>
  path.join(__dirname, `../../public/locales/${language}/supports.json`);

const baseQueriesWithReadJson = {
  jsonFr: async.retryable(5, async () => readJsonFile(givePath("fr"))),
  jsonEnUS: async.retryable(5, async () => readJsonFile(givePath("enUS"))),
  jsonEnGB: async.retryable(5, async () => readJsonFile(givePath("enGB"))),
};

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.supports.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const browseWithDetails = asyncHandler(async (req, res, next) => {
  const queries = {
    ...baseQueriesWithReadJson,
    supports: async.retryable(5, async () => {
      try {
        const [rows] = await tables.supports.readWithDetails();
        return rows;
      } catch (error) {
        return error;
      }
    }),
  };

  const results = await async.parallel(queries);

  const { success } = giveSuccesfulAndFailedQueryNames(results);

  const detailedSupports = {};
  for (let i = 0; i < success.length; i += 1) {
    const queryName = success[i];
    detailedSupports[queryName] = results[queryName];
  }

  req.body.detailedSupports = detailedSupports;

  return next();
});

const adminFindOneDetailed = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const queries = {
    ...baseQueriesWithReadJson,
    support: async.retryable(5, async () => {
      try {
        const [result] = await tables.supports.findOneAdminWithDetails(id);
        return result;
      } catch (error) {
        return error;
      }
    }),
    oeuvres: async.retryable(5, async () => {
      try {
        const [result] = await tables.paintings.findAllPaintingsBySupportId(id);
        return result;
      } catch (error) {
        return error;
      }
    }),
  };
  const results = await async.parallel(queries);

  const { failures } = giveSuccesfulAndFailedQueryNames(results);
  if (failures.length) {
    return next(new CustomErrorClass("07006", failures));
  }

  const { support, oeuvres, jsonFr, jsonEnUS, jsonEnGB } = results;

  const supportData = support[0];
  const untranslatedName = supportData.keyName;

  const detailedSupport = {
    ...supportData,
    relatedOeuvres: oeuvres,
    nameFr: jsonFr[untranslatedName].name,
    nameEnUS: jsonEnUS[untranslatedName].name,
    nameEnGB: jsonEnGB[untranslatedName].name,
    descriptionFr: jsonFr[untranslatedName].description,
    descriptionEnUS: jsonEnUS[untranslatedName].description,
    descriptionEnGB: jsonEnGB[untranslatedName].description,
  };

  req.body.detailedSupport = detailedSupport;

  return next();
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
      updateJsonFile(
        "add",
        "../../../public/locales/fr",
        "supports",
        supportKey,
        {
          name: supportNameFr,
          description: supportDescriptionFr || "",
        }
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../../public/locales/enUS",
        "supports",
        supportKey,
        { name: supportNameEnUS, description: supportDescriptionEnUS || "" }
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../../public/locales/enGB",
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
      undoPromises[lang] = async.retryable(5, async () =>
        updateJsonFile(
          "remove",
          `../../../public/locales/${lang}`,
          "supports",
          supportKey
        )
      );
    });
    await async.parallel(undoPromises);

    Object.assign(createSupportQuerySpecs, {
      undoQueryArgs: [result.insertId],
    });

    const undoNewSupportQuerySpecs = giveDbQueryUndoSpecs(
      createSupportQuerySpecs
    );

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

const modifyOneSupport = asyncHandler(async (req, res, next) => {
  const {
    jsonKey,
    modifyAttributeQueries,
    modifiedFields,
    detailedSupport,
    supportNameFr,
  } = req.body;

  const modifyingQueries = {};

  for (const [language, queries] of Object.entries(modifyAttributeQueries)) {
    const { queries: queriesObj } = queries;
    modifyingQueries[language] = async.retryable(5, async () =>
      updateJsonFile(
        "add",
        `../../../public/locales/${language}`,
        "supports",
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
            "supports",
            jsonKey,
            modifyAttributeQueries[lang].undoQueries
          )
        );
      });

      await async.parallel(undoPromises);
    }
    return next(new CustomErrorClass("06013", failures));
  }

  const successObj = modifiedFields.supportNameFr
    ? {
        ...successfulResMsg.supportsControllers.modifySupportName,
        infoData: {
          insertText1: supportNameFr,
          insertText2: detailedSupport.nameFr,
        },
      }
    : {
        ...successfulResMsg.supportsControllers.modifySupport,
        infoData: {
          insertText1: supportNameFr,
        },
      };

  return res.status(200).json({ success: true, successObj });
});

const deleteSupport = asyncHandler(async (req, res, next) => {
  const { body, params } = req;
  const { id } = params;
  const { jsonKeyName, nameFr, jsonQueriesArgs } = body.deleteAttributeQueries;

  const deleteSupportQuerySpecsReference = {
    name: "deleteSupport",
    queryArgs: [id],
    undoQueryArgs: [jsonKeyName],
  };

  const [deleteSupportQuerySpecs] = giveDbQueriesSpecs([
    deleteSupportQuerySpecsReference,
  ]);

  const jsonDeleteQueries = {
    fr: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/fr`,
        "supports",
        jsonKeyName
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/enUS`,
        "supports",
        jsonKeyName
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/enGB`,
        "supports",
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
          "supports",
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
    return next(new CustomErrorClass("06014", failures));
  }

  const results = await giveQueryPromise(deleteSupportQuerySpecs, 5);

  if (isError(results)) {
    await undoJsonDelete(success);
    return next(new CustomErrorClass("06014", results));
  }

  const successObj = {
    ...successfulResMsg.supportsControllers.deleteSupport,
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
  createSupport,
  modifyOneSupport,
  deleteSupport,
};
