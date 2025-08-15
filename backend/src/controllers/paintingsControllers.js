const asyncHandler = require("express-async-handler");

const tables = require("../tables");
const CustomErrorClass = require("../services/ErrorClasses");
const successfulResMsg = require("../../public/json/successfulResMsg.json");
const {
  giveParallelQueriesPromise,
  giveDbQueriesSpecs,
  giveSuccesfulAndFailedQueryNames,
  giveDbQueriesSpecsToUndoSuccess,
  giveQueryPromise,
  giveDbQueryUndoSpecs,
} = require("../helpers/dbAsyncQueriesHelper");
const {
  isObjectNotEmpty,
  isArrayNotEmpty,
} = require("../services/typesAndValidationChecks");

const giveResultWithFilePathname = (resultObj) => {
  const pathname = `${resultObj.filename}.${resultObj.fileExtension}`;
  return { ...resultObj, pathname };
};

const browse = async (req, res, next) => {
  try {
    const [rows] = await tables.paintings.readAll();
    if (rows) {
      res.send(rows);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const readAllPublicMinimalInfos = async (req, res, next) => {
  try {
    const [rows] = await tables.paintings.readAllPublicMinimalInfos();
    if (rows) {
      res.send(rows);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const readAllSizes = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.paintings.readAssociatedSizes();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const readAllTechniques = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.paintings.readAssociatedTechniques();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const readByTechnique = asyncHandler(async (req, res, next) => {
  const technique = req.params.id;

  const [result] = await tables.paintings.readPaintingByTech(technique);
  if (result) {
    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

const readPublicByTechnique = asyncHandler(async (req, res, next) => {
  const { techniqueName } = req.params;

  const [result] = await tables.paintings.readPublicPaintingByTech(
    techniqueName
  );
  if (result) {
    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

const readByFormat = asyncHandler(async (req, res, next) => {
  const format = req.params.id;

  const [result] = await tables.paintings.readPaintingBySize(format);
  if (result) {
    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

const readPublicByFormat = asyncHandler(async (req, res, next) => {
  const { formatName } = req.params;

  const [result] = await tables.paintings.readPublicPaintingBySize(formatName);
  if (result) {
    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

const readByTitle = asyncHandler(async (req, res, next) => {
  const title = req.params.id;

  const [result] = await tables.paintings.readByTitle(title);
  if (result) {
    const paintingId = await result[0].id;
    const [rows] = await tables.techniques.readByPaintingId(paintingId);
    result[0].techniques = await rows;
    if (result.family !== null) {
      const [sisters] = await tables.paintings.findAllFamilyMembers(
        result[0].familyId,
        result[0].id
      );
      result[0].sisters = await sisters;
    }

    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

const readPublicByTitle = asyncHandler(async (req, res, next) => {
  const title = req.params.id;

  const [result] = await tables.paintings.readPublicByTitle(title);
  if (result) {
    const paintingId = await result[0].id;
    const [rows] = await tables.techniques.readByPaintingId(paintingId);
    result[0].techniques = await rows;
    if (result.family !== null) {
      const [sisters] = await tables.paintings.findAllFamilyMembers(
        result[0].familyId,
        result[0].id
      );
      result[0].sisters = await sisters;
    }

    const sentResult = giveResultWithFilePathname(result[0]);

    res.send(sentResult);
  } else {
    res.sendStatus(400);
  }
});

const browseAdminWithDetails = asyncHandler(async (req, res, next) => {
  const [result] = await tables.paintings.readAdminWithDetails();

  if (!result) {
    return next(new CustomErrorClass("00001"));
  }
  return res.status(200).json(result);
});

const readOneAdminWithDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const [result] = await tables.paintings.findOneAdminWithDetails(id);

  if (result.length) {
    const [data] = result;
    const addedQueriesSpecs = [];
    const addedQueriesNames = [];
    if (data.familyId !== null) {
      addedQueriesNames.push("sisters");
      addedQueriesSpecs.push({
        name: "sisters",
        manager: "paintings",
        method: "findAllFamilyMembers",
        queryArgs: [data.familyId, data.id],
      });
    }
    if (data.oeuvreAvailability === 1) {
      addedQueriesNames.push("gift");
      addedQueriesSpecs.push({
        name: "gift",
        manager: "paintingGifts",
        method: "findGiftByPaintingId",
        queryArgs: [data.id],
      });
    }
    if (data.oeuvreAvailability === 2) {
      addedQueriesNames.push("sale");
      addedQueriesSpecs.push({
        name: "sale",
        manager: "paintingSales",
        method: "findSaleByPaintingId",
        queryArgs: [data.id],
      });
    }
    if (data.oeuvreAvailability === 3) {
      addedQueriesNames.push("reservation");
      addedQueriesSpecs.push({
        name: "reservation",
        manager: "paintingReservations",
        method: "findReservationByPaintingId",
        queryArgs: [data.id],
      });
    }

    const results = await giveParallelQueriesPromise(addedQueriesSpecs);

    addedQueriesNames.forEach((name) => {
      if (name === "sisters") {
        data[name] = results[name];
      } else {
        [data[name]] = results[name];
      }
    });
    req.body.detailedPaintingData = data;
    return next();
  }
  return next(new CustomErrorClass("00001"));
});

const createPainting = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const {
    oeuvreTitle,
    artistCommentFr,
    artistCommentEnUS,
    artistCommentEnGB,
    oeuvreTechnique,
    rawFileName,
    rawFileExtension,
    oeuvreAvailability,
    oeuvreGivenToKnownPerson,
    giftDate,
    giftNote,
    oeuvreSoldToKnownPerson,
    salePrice,
    saleDate,
    saleNote,
    oeuvreReservedToKnownPerson,
    reservationPrice,
    reservationDate,
    reservationNote,
  } = body;

  const createNewPaintingQuerySpecsReference = {
    name: "createNewPainting",
    queryArgs: [body],
  };

  const [createNewPaintingQuerySpecs] = giveDbQueriesSpecs([
    createNewPaintingQuerySpecsReference,
  ]);

  const result = await giveQueryPromise(createNewPaintingQuerySpecs, 5);

  if (!result.affectedRows) {
    const err = new CustomErrorClass("06003");
    return next(err);
  }
  const newPaintingId = result.insertId;

  const newPaintingAssociatedQueriesSpecsReference = [
    {
      name: "createPaintingTechniqueRelationsByPaintingId",
      queryArgs: [newPaintingId, oeuvreTechnique],
      undoQueryArgs: [newPaintingId, oeuvreTechnique],
    },
  ];

  if (rawFileName && rawFileExtension) {
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createNewPaintingStorage",
      queryArgs: [newPaintingId, rawFileName, rawFileExtension],
      undoQueryArgs: [newPaintingId],
    });
  }

  if (artistCommentFr) {
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createPaintingComment",
      queryArgs: [
        newPaintingId,
        artistCommentFr,
        artistCommentEnUS,
        artistCommentEnGB,
      ],
      undoQueryArgs: [newPaintingId],
    });
  }

  if (oeuvreAvailability === 1) {
    const { userId = null, contactId = null } = oeuvreGivenToKnownPerson;
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createPaintingGift",
      queryArgs: [newPaintingId, giftDate, giftNote, userId, contactId],
      undoQueryArgs: [newPaintingId],
    });
  }

  if (oeuvreAvailability === 2) {
    const { userId = null, contactId = null } = oeuvreSoldToKnownPerson;
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createPaintingSale",
      queryArgs: [
        salePrice,
        newPaintingId,
        saleDate,
        saleNote,
        userId,
        contactId,
      ],
      undoQueryArgs: [newPaintingId],
    });
  }

  if (oeuvreAvailability === 3) {
    const { userId = null, contactId = null } = oeuvreReservedToKnownPerson;
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createPaintingReservation",
      queryArgs: [
        reservationPrice,
        newPaintingId,
        reservationDate,
        reservationNote,
        userId,
        contactId,
      ],
      undoQueryArgs: [newPaintingId],
    });
  }

  const newPaintingAssociatedQueriesSpecs = giveDbQueriesSpecs(
    newPaintingAssociatedQueriesSpecsReference
  );

  const results = await giveParallelQueriesPromise(
    newPaintingAssociatedQueriesSpecs,
    5
  );

  const { success, failures } = giveSuccesfulAndFailedQueryNames(
    results,
    true,
    true
  );

  if (failures.length) {
    const newPaintingUndoAssociatedQueriesSpecs =
      giveDbQueriesSpecsToUndoSuccess(
        newPaintingAssociatedQueriesSpecsReference,
        success
      );

    await giveParallelQueriesPromise(newPaintingUndoAssociatedQueriesSpecs);

    Object.assign(createNewPaintingQuerySpecsReference, {
      undoQueryArgs: [newPaintingId],
    });
    const undoNewPaintingQuerySpecs = giveDbQueryUndoSpecs(
      createNewPaintingQuerySpecsReference
    );

    await giveQueryPromise(undoNewPaintingQuerySpecs);
    const err = await new CustomErrorClass("06004", failures);
    return next(err);
  }

  const successObj = {
    ...successfulResMsg.paintingsControllers.createPainting,
    infoData: {
      insertText1: oeuvreTitle,
    },
  };
  return res.status(201).json({
    success: true,
    successObj,
  });
});

const modifyPainting = asyncHandler(async (req, res, next) => {
  const { id: paintingId } = req.params;
  const {
    oeuvreTitle,
    modifyPaintingQueries,
    modifiedFields,
    detailedPaintingData,
  } = req.body;

  const {
    paintingsTableQueryArgs,
    paintingsTableUndoQueryArgs,
    paintingsHasTechniquesTableCreateQueriesArgs,
    paintingsHasTechniquesTableDeleteQueriesArgs,
    paintingStoragesTableOperation,
    paitingsStoragesTableCreateQueriesArgs,
    paitingsStoragesTableDeleteQueriesArgs,
    paintingsArtistCommentsTableOperation,
    paintingsArtistCommentsTableQueriesArgs,
    paintingsArtistCommentsTableUndoQueriesArgs,
    paintingsGiftsTableCreateQueriesArgs,
    paintingsGiftsTableDeleteQuery,
    paintingsGiftsTableDeleteUndoQueriesArgs,
    paintingsGiftsTableModifyQueriesArgs,
    paintingsGiftsTableModifyUndoQueriesArgs,
    paintingsSalesTableCreateQueriesArgs,
    paintingsSalesTableDeleteQuery,
    paintingsSalesTableDeleteUndoQueriesArgs,
    paintingsSalesTableModifyQueriesArgs,
    paintingsSalesTableModifyUndoQueriesArgs,
    paintingsReservationsTableCreateQueriesArgs,
    paintingsReservationsTableDeleteQuery,
    paintingsReservationsTableDeleteUndoQueriesArgs,
    paintingsReservationsTableModifyQueriesArgs,
    paintingsReservationsTableModifyUndoQueriesArgs,
  } = modifyPaintingQueries;

  const modifyPaintingQueriesReference = [];

  if (isObjectNotEmpty(paintingsTableQueryArgs)) {
    modifyPaintingQueriesReference.push({
      name: "modifyPainting",
      queryArgs: [paintingsTableQueryArgs, paintingId],
      undoQueryArgs: [paintingsTableUndoQueryArgs, paintingId],
    });
  }

  if (isArrayNotEmpty(paintingsHasTechniquesTableCreateQueriesArgs)) {
    modifyPaintingQueriesReference.push({
      name: "createPaintingTechniqueRelationsByPaintingId",
      queryArgs: [paintingId, paintingsHasTechniquesTableCreateQueriesArgs],
      undoQueryArgs: [paintingId, paintingsHasTechniquesTableCreateQueriesArgs],
    });
  }

  if (isArrayNotEmpty(paintingsHasTechniquesTableDeleteQueriesArgs)) {
    modifyPaintingQueriesReference.push({
      name: "deletePaintingTechniqueRelationsByPaintingIdAndTechniqueIds",
      queryArgs: [paintingId, paintingsHasTechniquesTableDeleteQueriesArgs],
      undoQueryArgs: [paintingId, paintingsHasTechniquesTableDeleteQueriesArgs],
    });
  }

  if (paintingStoragesTableOperation === "create") {
    modifyPaintingQueriesReference.push({
      name: "createNewPaintingStorage",
      queryArgs: [
        paintingId,
        paitingsStoragesTableCreateQueriesArgs.fileName,
        paitingsStoragesTableCreateQueriesArgs.fileExtension,
      ],
      undoQueryArgs: [paintingId],
    });
  }

  if (paintingStoragesTableOperation === "modify") {
    modifyPaintingQueriesReference.push({
      name: "modifyPaintingStorage",
      queryArgs: [
        paintingId,
        paitingsStoragesTableCreateQueriesArgs.fileName,
        paitingsStoragesTableCreateQueriesArgs.fileExtension,
      ],
      undoQueryArgs: [
        paintingId,
        paitingsStoragesTableDeleteQueriesArgs.fileName,
        paitingsStoragesTableDeleteQueriesArgs.fileExtension,
      ],
    });
  }

  if (paintingStoragesTableOperation === "delete") {
    modifyPaintingQueriesReference.push({
      name: "deletePaintingStorage",
      queryArgs: [paintingId],
      undoQueryArgs: [
        paintingId,
        paitingsStoragesTableDeleteQueriesArgs.fileName,
        paitingsStoragesTableDeleteQueriesArgs.fileExtension,
      ],
    });
  }

  if (paintingsArtistCommentsTableOperation === "create") {
    modifyPaintingQueriesReference.push({
      name: "createPaintingArtistComment",
      queryArgs: [
        paintingId,
        paintingsArtistCommentsTableQueriesArgs.fr_Comment,
        paintingsArtistCommentsTableQueriesArgs.en_US_Comment,
        paintingsArtistCommentsTableQueriesArgs.en_GB_Comment,
      ],
      undoQueryArgs: [paintingId],
    });
  }

  if (paintingsArtistCommentsTableOperation === "modify") {
    modifyPaintingQueriesReference.push({
      name: "modifyPaintingArtistComment",
      queryArgs: [paintingId, paintingsArtistCommentsTableQueriesArgs],
      undoQueryArgs: [paintingId, paintingsArtistCommentsTableUndoQueriesArgs],
    });
  }

  if (paintingsArtistCommentsTableOperation === "delete") {
    modifyPaintingQueriesReference.push({
      name: "deletePaintingArtistComment",
      queryArgs: [paintingId],
      undoQueryArgs: [
        paintingId,
        paintingsArtistCommentsTableUndoQueriesArgs.fr_Comment,
        paintingsArtistCommentsTableUndoQueriesArgs.en_US_Comment,
        paintingsArtistCommentsTableUndoQueriesArgs.en_GB_Comment,
      ],
    });
  }

  if (isObjectNotEmpty(paintingsGiftsTableCreateQueriesArgs)) {
    const { date, note, userId, contactId } =
      paintingsGiftsTableCreateQueriesArgs;
    modifyPaintingQueriesReference.push({
      name: "createPaintingGift",
      queryArgs: [paintingId, date, note, userId, contactId],
      undoQueryArgs: [paintingId],
    });
  }

  if (paintingsGiftsTableDeleteQuery) {
    const { date, note, userId, contactId } =
      paintingsGiftsTableDeleteUndoQueriesArgs;
    modifyPaintingQueriesReference.push({
      name: "deletePaintingGiftByPaintingId",
      queryArgs: [paintingId],
      undoQueryArgs: [paintingId, date, note, userId, contactId],
    });
  }

  if (isObjectNotEmpty(paintingsGiftsTableModifyQueriesArgs)) {
    modifyPaintingQueriesReference.push({
      name: "modifyPaintingGift",
      queryArgs: [paintingId, paintingsGiftsTableModifyQueriesArgs],
      undoQueryArgs: [paintingId, paintingsGiftsTableModifyUndoQueriesArgs],
    });
  }

  if (isObjectNotEmpty(paintingsSalesTableCreateQueriesArgs)) {
    const { price, date, note, userId, contactId } =
      paintingsSalesTableCreateQueriesArgs;
    modifyPaintingQueriesReference.push({
      name: "createPaintingSale",
      queryArgs: [price, paintingId, date, note, userId, contactId],
      undoQueryArgs: [paintingId],
    });
  }

  if (paintingsSalesTableDeleteQuery) {
    const { price, date, note, userId, contactId } =
      paintingsSalesTableDeleteUndoQueriesArgs;
    modifyPaintingQueriesReference.push({
      name: "deletePaintingSaleByPaintingId",
      queryArgs: [paintingId],
      undoQueryArgs: [price, paintingId, date, note, userId, contactId],
    });
  }

  if (isObjectNotEmpty(paintingsSalesTableModifyQueriesArgs)) {
    modifyPaintingQueriesReference.push({
      name: "modifyPaintingSale",
      queryArgs: [paintingId, paintingsSalesTableModifyQueriesArgs],
      undoQueryArgs: [paintingId, paintingsSalesTableModifyUndoQueriesArgs],
    });
  }

  if (isObjectNotEmpty(paintingsReservationsTableCreateQueriesArgs)) {
    const { price, date, note, userId, contactId } =
      paintingsReservationsTableCreateQueriesArgs;
    modifyPaintingQueriesReference.push({
      name: "createPaintingReservation",
      queryArgs: [price, paintingId, date, note, userId, contactId],
      undoQueryArgs: [paintingId],
    });
  }

  if (paintingsReservationsTableDeleteQuery) {
    const { price, date, note, userId, contactId } =
      paintingsReservationsTableDeleteUndoQueriesArgs;
    modifyPaintingQueriesReference.push({
      name: "deletePaintingReservationByPaintingId",
      queryArgs: [paintingId],
      undoQueryArgs: [price, paintingId, date, note, userId, contactId],
    });
  }

  if (isObjectNotEmpty(paintingsReservationsTableModifyQueriesArgs)) {
    modifyPaintingQueriesReference.push({
      name: "modifyPaintingReservation",
      queryArgs: [paintingId, paintingsReservationsTableModifyQueriesArgs],
      undoQueryArgs: [
        paintingId,
        paintingsReservationsTableModifyUndoQueriesArgs,
      ],
    });
  }

  if (!modifyPaintingQueriesReference.length) {
    return next(new CustomErrorClass("06010"));
  }

  const modifyPaintingQueriesSpecs = giveDbQueriesSpecs(
    modifyPaintingQueriesReference
  );

  const results = await giveParallelQueriesPromise(
    modifyPaintingQueriesSpecs,
    5
  );

  const { success, failures } = giveSuccesfulAndFailedQueryNames(
    results,
    true,
    true
  );

  if (failures.length) {
    const modifyPaintingUndoQueriesSpecs = giveDbQueriesSpecsToUndoSuccess(
      modifyPaintingQueriesReference,
      success
    );

    const undoResults = await giveParallelQueriesPromise(
      modifyPaintingUndoQueriesSpecs,
      5
    );
    const { failures: undoFailures } = giveSuccesfulAndFailedQueryNames(
      undoResults,
      true,
      true
    );

    if (undoFailures.length) {
      return next(new CustomErrorClass("06010", undoFailures));
    }

    return next(
      new CustomErrorClass("06010", [...failures, results[failures[0]]])
    );
  }

  const successObj = modifiedFields.oeuvreTitle
    ? {
        ...successfulResMsg.paintingsControllers.modifyPaintingTitle,
        infoData: {
          insertText1: oeuvreTitle,
          insertText2: detailedPaintingData.title,
        },
      }
    : {
        ...successfulResMsg.paintingsControllers.modifyPainting,
        infoData: {
          insertText1: oeuvreTitle,
        },
      };

  return res.status(201).json({
    success: true,
    successObj,
  });
});

const deletePainting = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body.detailedPaintingData;
  const {
    paintingsTableUndoQueryArgs,
    paintingsHasTechniquesTableUndoQueriesArgs,
    isPaintingStoragesTableOperation,
    paitingsStoragesTableUndoQueriesArgs,
    isArtistCommentTableOperation,
    artistCommentTableUndoQueriesArgs,
    isPaintingGiftsTableOperation,
    paintingsGiftsTableDeleteUndoQueriesArgs,
    isPaintingSalesTableOperation,
    paintingsSalesTableDeleteUndoQueriesArgs,
    isPaintingReservationsTableOperation,
    paintingsReservationsTableDeleteUndoQueriesArgs,
  } = req.body.deletePaintingQueries;

  const deletePaintingQuerySpecsReference = [
    {
      name: "deletePainting",
      queryArgs: [id],
      undoQueryArgs: [paintingsTableUndoQueryArgs],
    },
  ];

  const deletePaintingRelatedDataQuerySpecsReference = [
    {
      name: "deletePaintingTechniqueRelationsByPaintingIdAndTechniqueIds",
      queryArgs: [id, paintingsHasTechniquesTableUndoQueriesArgs],
      undoQueryArgs: [id, paintingsHasTechniquesTableUndoQueriesArgs],
    },
  ];

  if (isPaintingStoragesTableOperation) {
    deletePaintingRelatedDataQuerySpecsReference.push({
      name: "deletePaintingStorage",
      queryArgs: [id],
      undoQueryArgs: [paitingsStoragesTableUndoQueriesArgs],
    });
  }

  if (isArtistCommentTableOperation) {
    deletePaintingRelatedDataQuerySpecsReference.push({
      name: "deletePaintingArtistComment",
      queryArgs: [id],
      undoQueryArgs: [artistCommentTableUndoQueriesArgs],
    });
  }

  if (isPaintingGiftsTableOperation) {
    const { date, note, userId, contactId } =
      paintingsGiftsTableDeleteUndoQueriesArgs;
    deletePaintingRelatedDataQuerySpecsReference.push({
      name: "deletePaintingGiftByPaintingId",
      queryArgs: [id],
      undoQueryArgs: [id, date, note, userId, contactId],
    });
  }

  if (isPaintingSalesTableOperation) {
    const { price, date, note, userId, contactId } =
      paintingsSalesTableDeleteUndoQueriesArgs;
    deletePaintingRelatedDataQuerySpecsReference.push({
      name: "deletePaintingSaleByPaintingId",
      queryArgs: [id],
      undoQueryArgs: [price, id, date, note, userId, contactId],
    });
  }

  if (isPaintingReservationsTableOperation) {
    const { price, date, note, userId, contactId } =
      paintingsReservationsTableDeleteUndoQueriesArgs;
    deletePaintingRelatedDataQuerySpecsReference.push({
      name: "deletePaintingReservationByPaintingId",
      queryArgs: [id],
      undoQueryArgs: [price, id, date, note, userId, contactId],
    });
  }

  const deletePaintingRelatedDataQuerySpecs = giveDbQueriesSpecs(
    deletePaintingRelatedDataQuerySpecsReference
  );

  const relatedDataResults = await giveParallelQueriesPromise(
    deletePaintingRelatedDataQuerySpecs,
    5
  );

  const { success, failures } = giveSuccesfulAndFailedQueryNames(
    relatedDataResults,
    true,
    true
  );

  if (failures.length) {
    const deletePaintingUndoQuerySpecs = giveDbQueriesSpecsToUndoSuccess(
      deletePaintingQuerySpecsReference,
      success
    );

    await giveParallelQueriesPromise(deletePaintingUndoQuerySpecs);
    const err = await new CustomErrorClass("06004", failures);
    return next(err);
  }

  const [deletePaintingQuerySpecs] = giveDbQueriesSpecs(
    deletePaintingQuerySpecsReference
  );

  const results = await giveQueryPromise(deletePaintingQuerySpecs, 5);

  if (!results.affectedRows) {
    const deletePaintingUndoQuerySpecs = giveDbQueriesSpecsToUndoSuccess(
      deletePaintingRelatedDataQuerySpecsReference,
      success
    );

    await giveParallelQueriesPromise(deletePaintingUndoQuerySpecs, 5);
    const err = await new CustomErrorClass("06004", results);
    return next(err);
  }

  const successObj = {
    ...successfulResMsg.paintingsControllers.deletePainting,
    infoData: {
      insertText1: title,
    },
  };
  return res.status(201).json({
    success: true,
    successObj,
  });
});

module.exports = {
  browse,
  readAllPublicMinimalInfos,
  readAllSizes,
  readAllTechniques,
  readByTechnique,
  readPublicByTechnique,
  readByFormat,
  readPublicByFormat,
  readByTitle,
  readPublicByTitle,
  browseAdminWithDetails,
  readOneAdminWithDetails,
  createPainting,
  modifyPainting,
  deletePainting,
};
