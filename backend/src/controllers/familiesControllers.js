const path = require("node:path");
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
const updateJsonFile = require("../services/fileSystem/updateJsonFile");
const readJsonFile = require("../services/fileSystem/readJsonFile");
const { isError } = require("../services/typesAndValidationChecks");

const givePath = (language) =>
  path.join(__dirname, `../../public/locales/${language}/families.json`);

const baseQueriesWithReadJson = {
  jsonFr: async.retryable(5, async () => readJsonFile(givePath("fr"))),
  jsonEnUS: async.retryable(5, async () => readJsonFile(givePath("enUS"))),
  jsonEnGB: async.retryable(5, async () => readJsonFile(givePath("enGB"))),
};

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.families.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const browseWithDetails = asyncHandler(async (req, res, next) => {
  const queries = {
    ...baseQueriesWithReadJson,
    families: async.retryable(5, async () => {
      try {
        const [rows] = await tables.families.readWithDetails();
        return rows;
      } catch (error) {
        return error;
      }
    }),
  };

  const results = await async.parallel(queries);

  const { success } = giveSuccesfulAndFailedQueryNames(results);

  const detailedFamilies = {};
  for (let i = 0; i < success.length; i += 1) {
    const queryName = success[i];

    detailedFamilies[queryName] = results[queryName];
  }

  req.body.detailedFamilies = detailedFamilies;

  return next();
});

const adminFindOneDetailed = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const queries = {
    ...baseQueriesWithReadJson,
    family: async.retryable(5, async () => {
      try {
        const [result] = await tables.families.findOneAdminWithDetails(id);
        return result;
      } catch (error) {
        return error;
      }
    }),
    oeuvres: async.retryable(5, async () => {
      try {
        const [result] = await tables.paintings.findAllPaintingsByFamilyId(id);
        return result;
      } catch (error) {
        return error;
      }
    }),
  };
  const results = await async.parallel(queries);

  const { failures } = giveSuccesfulAndFailedQueryNames(results);
  if (failures.length) {
    return next(new CustomErrorClass("07008", failures));
  }

  const { family, oeuvres, jsonFr, jsonEnUS, jsonEnGB } = results;

  const familyData = family[0];
  const untranslatedName = familyData.keyName;

  const detailedFamily = {
    ...familyData,
    relatedOeuvres: oeuvres,
    name: jsonFr[untranslatedName].name,
    descriptionFr: jsonFr[untranslatedName].description,
    descriptionEnUS: jsonEnUS[untranslatedName].description,
    descriptionEnGB: jsonEnGB[untranslatedName].description,
  };

  req.body.detailedFamily = detailedFamily;

  return next();
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
      updateJsonFile(
        "add",
        "../../../public/locales/fr",
        "families",
        familyKey,
        {
          name: familyName,
          description: familyDescriptionFr || "",
        }
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../../public/locales/enUS",
        "families",
        familyKey,
        { name: familyName, description: familyDescriptionEnUS || "" }
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../../public/locales/enGB",
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
          `../../../public/locales/${lang}`,
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

const modifyOneFamily = asyncHandler(async (req, res, next) => {
  const {
    jsonKey,
    modifyAttributeQueries,
    modifiedFields,
    detailedFamily,
    familyName,
  } = req.body;

  const modifyingQueries = {};

  for (const [language, queries] of Object.entries(modifyAttributeQueries)) {
    const { queries: queriesObj } = queries;
    modifyingQueries[language] = async.retryable(5, async () =>
      updateJsonFile(
        "add",
        `../../../public/locales/${language}`,
        "families",
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
    const undoPromises = {};
    success.forEach((lang) => {
      undoPromises[lang] = async.retryable(5, async () =>
        updateJsonFile(
          "remove",
          `../../../public/locales/${lang}`,
          "families",
          jsonKey,
          modifyAttributeQueries[lang].undoQueries
        )
      );
    });
    await async.parallel(undoPromises);

    const err = new CustomErrorClass("06017", failures);
    return next(err);
  }

  const successObj = modifiedFields.familyName
    ? {
        ...successfulResMsg.familiesControllers.modifyFamilyName,
        infoData: {
          insertText1: familyName,
          insertText2: detailedFamily.name,
        },
      }
    : {
        ...successfulResMsg.familiesControllers.modifyFamily,
        infoData: {
          insertText1: detailedFamily.name,
        },
      };

  return res.status(200).json({ success: true, successObj });
});

const deleteFamily = asyncHandler(async (req, res, next) => {
  const { body, params } = req;
  const { id } = params;
  const { jsonKeyName, nameFr, jsonQueriesArgs } = body.deleteAttributeQueries;

  const deleteFamilyQuerySpecsReference = {
    name: "deleteFamily",
    queryArgs: [id],
    undoQueryArgs: [jsonKeyName],
  };

  const [deleteFamilyQuerySpecs] = giveDbQueriesSpecs([
    deleteFamilyQuerySpecsReference,
  ]);

  const jsonDeleteQueries = {
    fr: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/fr`,
        "families",
        jsonKeyName
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/enUS`,
        "families",
        jsonKeyName
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/enGB`,
        "families",
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
          "families",
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
    return next(new CustomErrorClass("06018", failures));
  }

  const results = await giveQueryPromise(deleteFamilyQuerySpecs, 5);

  if (isError(results)) {
    await undoJsonDelete(success);
    return next(new CustomErrorClass("06018", results));
  }

  const successObj = {
    ...successfulResMsg.familiesControllers.deleteFamily,
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
  createFamily,
  modifyOneFamily,
  deleteFamily,
};
