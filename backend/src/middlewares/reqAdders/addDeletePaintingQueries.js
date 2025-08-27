const asyncHandler = require("express-async-handler");

const addDeletePaintingQueries = asyncHandler(async (req, res, next) => {
  const { body } = req;

  const {
    title: oeuvreTitle,
    width: oeuvreWidth,
    height: oeuvreHeight,
    oeuvreAvailability,
    publiclyVisible,
    familyMember,
    familyId: oeuvreFamily,
    techniques,
    formatId: oeuvreFormat,
    supportId: oeuvreSupport,
    fileName,
    fileExtension,
    artistCommentFr,
    artistCommentEnUS,
    artistCommentEnGB,
    gift = null,
    sale = null,
    reservation = null,
  } = body.detailedPaintingData;

  const paintingsTableUndoQueryArgs = {
    oeuvreTitle,
    oeuvreWidth,
    oeuvreHeight,
    familyMember,
    oeuvreFamily,
    oeuvreFormat,
    oeuvreSupport,
    oeuvreVisibility: !!publiclyVisible,
    oeuvreAvailability,
  };

  const paintingsHasTechniquesTableUndoQueriesArgs = techniques.map(
    (tech) => tech.id
  );

  const isPaintingStoragesTableOperation = !!(fileName && fileExtension);

  const paitingsStoragesTableUndoQueriesArgs = { fileName, fileExtension };

  const isArtistCommentTableOperation = !!artistCommentFr;

  const artistCommentTableUndoQueriesArgs = {
    fr_Comment: artistCommentFr,
    en_US_Comment: artistCommentEnUS,
    en_GB_Comment: artistCommentEnGB,
  };

  const isPaintingGiftsTableOperation = oeuvreAvailability === 1;
  const paintingsGiftsTableDeleteUndoQueriesArgs = gift;

  const isPaintingSalesTableOperation = oeuvreAvailability === 2;
  const paintingsSalesTableDeleteUndoQueriesArgs = sale;

  const isPaintingReservationsTableOperation = oeuvreAvailability === 3;
  const paintingsReservationsTableDeleteUndoQueriesArgs = reservation;

  body.deletePaintingQueries = {
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
  };

  return next();
});

module.exports = addDeletePaintingQueries;
