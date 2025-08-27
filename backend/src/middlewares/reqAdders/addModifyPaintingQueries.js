const asyncHandler = require("express-async-handler");

const {
  giveValuesExclusivesBetween2Arrays,
} = require("../../services/arrayFunctions");

const paintingsTableFields = {
  oeuvreTitle: { columnName: "title", detailedPaintingDataKey: "title" },
  oeuvreWidth: { columnName: "width", detailedPaintingDataKey: "width" },
  oeuvreHeight: { columnName: "height", detailedPaintingDataKey: "height" },
  familyMember: {
    columnName: "family_member",
    detailedPaintingDataKey: "familyMember",
  },
  oeuvreFamily: {
    columnName: "families_id",
    detailedPaintingDataKey: "familyId",
  },
  oeuvreFormat: {
    columnName: "painting_sizes_id",
    detailedPaintingDataKey: "formatId",
  },
  oeuvreSupport: {
    columnName: "supports_id",
    detailedPaintingDataKey: "supportId",
  },
  oeuvreVisibility: {
    columnName: "publicly_visible",
    detailedPaintingDataKey: "publiclyVisible",
  },
  oeuvreAvailability: {
    columnName: "paintings_availabilities_id",
    detailedPaintingDataKey: "oeuvreAvailability",
  },
};

const artistCommentTableFields = {
  artistCommentFr: "fr_comment",
  artistCommentEnUS: "en_US_comment",
  artistCommentEnGB: "en_GB_comment",
};

const paintingGiftsTableFields = {
  giftDate: { columnName: "date", detailedPaintingDataKey: "date" },
  giftNote: { columnName: "note", detailedPaintingDataKey: "note" },
  userId: { columnName: "users_id", detailedPaintingDataKey: "userId" },
  contactId: {
    columnName: "contacts_id",
    detailedPaintingDataKey: "contactId",
  },
};

const paintingSalesTableFields = {
  saleDate: { columnName: "date", detailedPaintingDataKey: "date" },
  salePrice: { columnName: "price", detailedPaintingDataKey: "price" },
  userId: { columnName: "users_id", detailedPaintingDataKey: "userId" },
  contactId: {
    columnName: "contacts_id",
    detailedPaintingDataKey: "contactId",
  },
};

const paintingReservationsTableFields = {
  reservationDate: { columnName: "date", detailedPaintingDataKey: "date" },
  reservationPrice: { columnName: "price", detailedPaintingDataKey: "price" },
  userId: { columnName: "users_id", detailedPaintingDataKey: "userId" },
  contactId: {
    columnName: "contacts_id",
    detailedPaintingDataKey: "contactId",
  },
};

const addModifyPaintingQueries = asyncHandler(async (req, res, next) => {
  const { body } = req;

  const {
    oeuvreAvailability,
    oeuvreTechnique,
    familyMember,
    rawFileName,
    rawFileExtension,
    artistCommentFr,
    giftDate,
    giftNote,
    oeuvreGivenToKnownPerson,
    saleDate,
    salePrice,
    saleNote,
    oeuvreSoldToKnownPerson,
    reservationDate,
    reservationPrice,
    reservationNote,
    oeuvreReservedToKnownPerson,
    oeuvreFileDeleteFile,
    detailedPaintingData,
    modifiedFields,
  } = body;

  const {
    techniques,
    artistCommentFr: formerCommentFr,
    artistCommentEnUS: formerCommentEnUS,
    artistCommentEnGB: formerCommentEnGB,
  } = detailedPaintingData;

  const paintingsTableQueryArgs = {};
  const paintingsTableUndoQueryArgs = {};

  for (const [
    fieldName,
    { columnName, detailedPaintingDataKey },
  ] of Object.entries(paintingsTableFields)) {
    if (modifiedFields[fieldName]) {
      paintingsTableQueryArgs[columnName] = body[fieldName];
      paintingsTableUndoQueryArgs[columnName] =
        detailedPaintingData[detailedPaintingDataKey];
    }
  }

  if (modifiedFields.oeuvreFamily) {
    paintingsTableQueryArgs.family_member = familyMember || null;
    paintingsTableUndoQueryArgs.family_member =
      detailedPaintingData.familyMember;
  }

  const paintingsHasTechniquesTableCreateQueriesArgs = [];
  const paintingsHasTechniquesTableDeleteQueriesArgs = [];

  if (modifiedFields.oeuvreTechnique) {
    const previousTechniques = techniques.map((tech) => tech.id);
    const [techniquesToCreate, techniquesToDelete] =
      giveValuesExclusivesBetween2Arrays(oeuvreTechnique, previousTechniques);

    if (techniquesToCreate.length) {
      paintingsHasTechniquesTableCreateQueriesArgs.push(...techniquesToCreate);
    }
    if (techniquesToDelete.length) {
      paintingsHasTechniquesTableDeleteQueriesArgs.push(...techniquesToDelete);
    }
  }

  let paintingStoragesTableOperation = "none";
  const paitingsStoragesTableCreateQueriesArgs = {};
  const paitingsStoragesTableDeleteQueriesArgs = {};

  if (rawFileName && rawFileExtension) {
    paintingStoragesTableOperation = "create";
    paitingsStoragesTableCreateQueriesArgs.fileName = rawFileName;
    paitingsStoragesTableCreateQueriesArgs.fileExtension = rawFileExtension;

    if (detailedPaintingData.fileName && detailedPaintingData.fileExtension) {
      paintingStoragesTableOperation = "modify";
      paitingsStoragesTableDeleteQueriesArgs.fileName =
        detailedPaintingData.fileName;
      paitingsStoragesTableDeleteQueriesArgs.fileExtension =
        detailedPaintingData.fileExtension;
    }
  }

  if (oeuvreFileDeleteFile) {
    paintingStoragesTableOperation = "delete";
    paitingsStoragesTableDeleteQueriesArgs.fileName =
      detailedPaintingData.fileName;
    paitingsStoragesTableDeleteQueriesArgs.fileExtension =
      detailedPaintingData.fileExtension;
  }

  let paintingsArtistCommentsTableOperation =
    !formerCommentFr && artistCommentFr ? "create" : "none";
  const paintingsArtistCommentsTableQueriesArgs = {};
  const paintingsArtistCommentsTableUndoQueriesArgs = {};
  if (!artistCommentFr && formerCommentFr) {
    paintingsArtistCommentsTableOperation = "delete";
    paintingsArtistCommentsTableUndoQueriesArgs.fr_Comment = formerCommentFr;
    paintingsArtistCommentsTableUndoQueriesArgs.en_US_Comment =
      formerCommentEnUS;
    paintingsArtistCommentsTableUndoQueriesArgs.en_GB_Comment =
      formerCommentEnGB;
  }

  for (const [fieldName, columnName] of Object.entries(
    artistCommentTableFields
  )) {
    if (modifiedFields[fieldName]) {
      if (paintingsArtistCommentsTableOperation === "none") {
        paintingsArtistCommentsTableOperation = "modify";
      }
      paintingsArtistCommentsTableQueriesArgs[columnName] = body[fieldName];
      paintingsArtistCommentsTableUndoQueriesArgs[columnName] =
        detailedPaintingData[fieldName];
    }
  }

  const paintingsGiftsTableCreateQueriesArgs = {};
  let paintingsGiftsTableDeleteQuery = false;
  const paintingsGiftsTableDeleteUndoQueriesArgs = {};
  const paintingsGiftsTableModifyQueriesArgs = {};
  const paintingsGiftsTableModifyUndoQueriesArgs = {};
  const paintingsSalesTableCreateQueriesArgs = {};
  let paintingsSalesTableDeleteQuery = false;
  const paintingsSalesTableDeleteUndoQueriesArgs = {};
  const paintingsSalesTableModifyQueriesArgs = {};
  const paintingsSalesTableModifyUndoQueriesArgs = {};
  const paintingsReservationsTableCreateQueriesArgs = {};
  let paintingsReservationsTableDeleteQuery = false;
  const paintingsReservationsTableDeleteUndoQueriesArgs = {};
  const paintingsReservationsTableModifyQueriesArgs = {};
  const paintingsReservationsTableModifyUndoQueriesArgs = {};

  if (modifiedFields.oeuvreAvailability) {
    if (oeuvreAvailability === 1) {
      paintingsGiftsTableCreateQueriesArgs.date = giftDate;
      paintingsGiftsTableCreateQueriesArgs.note = giftNote;
      paintingsGiftsTableCreateQueriesArgs.userId =
        oeuvreGivenToKnownPerson.userId;
      paintingsGiftsTableCreateQueriesArgs.contactId =
        oeuvreGivenToKnownPerson.contactId;
    }
    if (oeuvreAvailability === 2) {
      paintingsSalesTableCreateQueriesArgs.price = salePrice;
      paintingsSalesTableCreateQueriesArgs.date = saleDate;
      paintingsSalesTableCreateQueriesArgs.note = saleNote;
      paintingsSalesTableCreateQueriesArgs.userId =
        oeuvreSoldToKnownPerson.userId;
      paintingsSalesTableCreateQueriesArgs.contactId =
        oeuvreSoldToKnownPerson.contactId;
    }
    if (oeuvreAvailability === 3) {
      paintingsReservationsTableCreateQueriesArgs.price = reservationPrice;
      paintingsReservationsTableCreateQueriesArgs.date = reservationDate;
      paintingsReservationsTableCreateQueriesArgs.note = reservationNote;
      paintingsReservationsTableCreateQueriesArgs.userId =
        oeuvreReservedToKnownPerson.userId;
      paintingsReservationsTableCreateQueriesArgs.contactId =
        oeuvreReservedToKnownPerson.contactId;
    }
    if (detailedPaintingData.oeuvreAvailability === 1) {
      const { date, note, userId, contactId } = detailedPaintingData.gift;
      paintingsGiftsTableDeleteQuery = true;
      paintingsGiftsTableDeleteUndoQueriesArgs.date = date;
      paintingsGiftsTableDeleteUndoQueriesArgs.note = note;
      paintingsGiftsTableDeleteUndoQueriesArgs.userId = userId;
      paintingsGiftsTableDeleteUndoQueriesArgs.contactId = contactId;
    }
    if (detailedPaintingData.oeuvreAvailability === 2) {
      const { price, date, note, userId, contactId } =
        detailedPaintingData.sale;
      paintingsSalesTableDeleteQuery = true;
      paintingsSalesTableDeleteUndoQueriesArgs.price = price;
      paintingsSalesTableDeleteUndoQueriesArgs.date = date;
      paintingsSalesTableDeleteUndoQueriesArgs.note = note;
      paintingsSalesTableDeleteUndoQueriesArgs.userId = userId;
      paintingsSalesTableDeleteUndoQueriesArgs.contactId = contactId;
    }
    if (detailedPaintingData.oeuvreAvailability === 3) {
      const { price, date, note, userId, contactId } =
        detailedPaintingData.reservation;
      paintingsReservationsTableDeleteQuery = true;
      paintingsReservationsTableDeleteUndoQueriesArgs.price = price;
      paintingsReservationsTableDeleteUndoQueriesArgs.date = date;
      paintingsReservationsTableDeleteUndoQueriesArgs.note = note;
      paintingsReservationsTableDeleteUndoQueriesArgs.userId = userId;
      paintingsReservationsTableDeleteUndoQueriesArgs.contactId = contactId;
    }
  } else {
    if (oeuvreAvailability === 1) {
      for (const [
        fieldName,
        { columnName, detailedPaintingDataKey },
      ] of Object.entries(paintingGiftsTableFields)) {
        if (modifiedFields[fieldName]) {
          paintingsGiftsTableModifyQueriesArgs[columnName] = body[fieldName];
          paintingsGiftsTableModifyUndoQueriesArgs[columnName] =
            detailedPaintingData.gift[detailedPaintingDataKey];
        }
      }
    }
    if (oeuvreAvailability === 2) {
      for (const [
        fieldName,
        { columnName, detailedPaintingDataKey },
      ] of Object.entries(paintingSalesTableFields)) {
        if (modifiedFields[fieldName]) {
          paintingsSalesTableModifyQueriesArgs[columnName] = body[fieldName];
          paintingsSalesTableModifyUndoQueriesArgs[columnName] =
            detailedPaintingData.sale[detailedPaintingDataKey];
        }
      }
    }
    if (oeuvreAvailability === 3) {
      for (const [
        fieldName,
        { columnName, detailedPaintingDataKey },
      ] of Object.entries(paintingReservationsTableFields)) {
        if (modifiedFields[fieldName]) {
          paintingsReservationsTableModifyQueriesArgs[columnName] =
            body[fieldName];
          paintingsReservationsTableModifyUndoQueriesArgs[columnName] =
            detailedPaintingData.reservation[detailedPaintingDataKey];
        }
      }
    }
  }

  body.modifyPaintingQueries = {
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
  };

  return next();
});

module.exports = addModifyPaintingQueries;
