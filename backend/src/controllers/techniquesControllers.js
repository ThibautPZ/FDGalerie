const path = require("node:path");
const async = require("async");
const asyncHandler = require("express-async-handler");

const tables = require("../tables");
const successfulResMsg = require("../../public/json/successfulResMsg.json");
const {
  giveQueryPromise,
  giveSuccesfulAndFailedQueryNames,
  giveDbQueriesSpecs,
} = require("../helpers/dbAsyncQueriesHelper");
const CustomErrorClass = require("../services/ErrorClasses");
const updateJsonFile = require("../services/fileSystem/updateJsonFile");
const readJsonFile = require("../services/fileSystem/readJsonFile");
const { isError } = require("../services/typesAndValidationChecks");

const givePath = (language) =>
  path.join(__dirname, `../../public/locales/${language}/techniques.json`);

const baseQueriesWithReadJson = {
  jsonFr: async.retryable(5, async () => readJsonFile(givePath("fr"))),
  jsonEnUS: async.retryable(5, async () => readJsonFile(givePath("enUS"))),
  jsonEnGB: async.retryable(5, async () => readJsonFile(givePath("enGB"))),
};

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.techniques.readAll();
  if (rows) {
    req.body.techniques = rows;
  } else {
    req.body.techniques = [];
  }
  return next();
});

const browseWithDetails = asyncHandler(async (req, res, next) => {
  const queries = {
    ...baseQueriesWithReadJson,
    techniques: async.retryable(5, async () => {
      try {
        const [rows] = await tables.techniques.readWithDetails();
        return rows;
      } catch (error) {
        return error;
      }
    }),
  };

  const results = await async.parallel(queries);

  const { success } = giveSuccesfulAndFailedQueryNames(results);

  const detailedTechniques = {};
  for (let i = 0; i < success.length; i += 1) {
    const queryName = success[i];
    detailedTechniques[queryName] = results[queryName];
  }

  req.body.detailedTechniques = detailedTechniques;

  return next();
});

const adminFindOneDetailed = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const queries = {
    ...baseQueriesWithReadJson,
    technique: async.retryable(5, async () => {
      try {
        const [result] = await tables.techniques.findOneAdminWithDetails(id);
        return result;
      } catch (error) {
        return error;
      }
    }),
    oeuvres: async.retryable(5, async () => {
      try {
        const [result] =
          await tables.paintingsHasTechniques.findAllPaintingsByTechniqueId(id);
        return result;
      } catch (error) {
        return error;
      }
    }),
  };

  const results = await async.parallel(queries);

  const { failures } = giveSuccesfulAndFailedQueryNames(results);
  if (failures.length) {
    return next(new CustomErrorClass("07005", failures));
  }

  const { technique, oeuvres, jsonFr, jsonEnUS, jsonEnGB } = results;

  const techniqueData = technique[0];
  const untranslatedName = techniqueData.name;

  const detailedTechnique = {
    ...techniqueData,
    relatedOeuvres: oeuvres,
    nameFr: jsonFr[untranslatedName].name,
    nameEnUS: jsonEnUS[untranslatedName].name,
    nameEnGB: jsonEnGB[untranslatedName].name,
    descriptionFr: jsonFr[untranslatedName].description,
    descriptionEnUS: jsonEnUS[untranslatedName].description,
    descriptionEnGB: jsonEnGB[untranslatedName].description,
  };

  req.body.detailedTechnique = detailedTechnique;

  return next();
});

const createOneTechnique = asyncHandler(async (req, res, next) => {
  const {
    techniqueKey,
    techniqueNameFr,
    techniqueNameEnUS,
    techniqueNameEnGB,
    techniqueDescriptionFr,
    techniqueDescriptionEnUS,
    techniqueDescriptionEnGB,
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
        "../../../public/locales/fr",
        "techniques",
        techniqueKey,
        { name: techniqueNameFr, description: techniqueDescriptionFr }
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../../public/locales/enUS",
        "techniques",
        techniqueKey,
        { name: techniqueNameEnUS, description: techniqueDescriptionEnUS }
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "add",
        "../../../public/locales/enGB",
        "techniques",
        techniqueKey,
        { name: techniqueNameEnGB, description: techniqueDescriptionEnGB }
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
  return res.status(201).json({ success: true, successObj });
});

const modifyOneTechnique = asyncHandler(async (req, res, next) => {
  const {
    techniqueKey,
    modifyTechniqueQueries,
    modifiedFields,
    detailedTechnique,
    techniqueNameFr,
  } = req.body;

  const modifyingQueries = {};

  for (const [language, queries] of Object.entries(modifyTechniqueQueries)) {
    const { queries: queriesObj } = queries;
    modifyingQueries[language] = async.retryable(5, async () =>
      updateJsonFile(
        "add",
        `../../../public/locales/${language}`,
        "techniques",
        techniqueKey,
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
            "techniques",
            techniqueKey,
            modifyTechniqueQueries[lang].undoQueries
          )
        );
      });

      await async.parallel(undoPromises);
    }

    return next(new CustomErrorClass("06011", failures));
  }

  const successObj = modifiedFields.techniqueNameFr
    ? {
        ...successfulResMsg.techniquesControllers.modifyTechniqueName,
        infoData: {
          insertText1: techniqueNameFr,
          insertText2: detailedTechnique.nameFr,
        },
      }
    : {
        ...successfulResMsg.techniquesControllers.modifyTechnique,
        infoData: {
          insertText1: techniqueNameFr,
        },
      };

  return res.status(201).json({ success: true, successObj });
});

const deleteTechnique = asyncHandler(async (req, res, next) => {
  const { body, params } = req;
  const { id } = params;
  const { jsonKeyName, nameFr, jsonQueriesArgs } = body.deleteTechniqueQueries;

  const deleteTechniqueQuerySpecsReference = {
    name: "deleteTechnique",
    queryArgs: [id],
    undoQueryArgs: [jsonKeyName],
  };

  const [deleteTechniqueQuerySpecs] = giveDbQueriesSpecs([
    deleteTechniqueQuerySpecsReference,
  ]);

  const jsonDeleteQueries = {
    fr: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/fr`,
        "techniques",
        jsonKeyName
      )
    ),
    enUS: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/enUS`,
        "techniques",
        jsonKeyName
      )
    ),
    enGB: async.retryable(5, async () =>
      updateJsonFile(
        "remove",
        `../../../public/locales/enGB`,
        "techniques",
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
          "techniques",
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
    return next(new CustomErrorClass("06012", failures));
  }

  const results = await giveQueryPromise(deleteTechniqueQuerySpecs, 5);

  if (isError(results)) {
    await undoJsonDelete(success);
    return next(results);
  }

  const successObj = {
    ...successfulResMsg.techniquesControllers.deleteTechnique,
    infoData: {
      insertText1: nameFr,
    },
  };

  return res.status(201).json({ success: true, successObj });
});

module.exports = {
  browse,
  browseWithDetails,
  adminFindOneDetailed,
  createOneTechnique,
  modifyOneTechnique,
  deleteTechnique,
};
