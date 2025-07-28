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

const createPainting = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const {
    oeuvreTitle,
    artistComment,
    oeuvreTechnique,
    rawFileName,
    rawFileExtension,
    oeuvreAvailability,
    oeuvreGivenToKnownPerson,
    giftDate,
    oeuvreSoldToKnownPerson,
    salePrice,
    saleDate,
    oeuvreReservedToKnownPerson,
    reservationPrice,
    reservationDate,
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
      name: "createNewPaintingTechniques",
      queryArgs: [newPaintingId, oeuvreTechnique],
      undoQueryArgs: [newPaintingId],
    },
  ];

  if (rawFileName && rawFileExtension) {
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createNewPaintingStorage",
      queryArgs: [newPaintingId, rawFileName, rawFileExtension],
      undoQueryArgs: [newPaintingId],
    });
  }

  if (artistComment) {
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createPaintingComment",
      queryArgs: [newPaintingId, artistComment],
      undoQueryArgs: [newPaintingId],
    });
  }

  if (oeuvreAvailability === 1) {
    const { userId = null, contactId = null } = oeuvreGivenToKnownPerson;
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createPaintingGift",
      queryArgs: [newPaintingId, giftDate, userId, contactId],
      undoQueryArgs: [newPaintingId],
    });
  }

  if (oeuvreAvailability === 2) {
    const { userId = null, contactId = null } = oeuvreSoldToKnownPerson;
    newPaintingAssociatedQueriesSpecsReference.push({
      name: "createPaintingSale",
      queryArgs: [salePrice, newPaintingId, saleDate, userId, contactId],
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
  createPainting,
};
