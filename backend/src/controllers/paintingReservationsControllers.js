const asyncHandler = require("express-async-handler");

const { giveQueryPromise } = require("../helpers/dbAsyncQueriesHelper");
const { isError } = require("../services/typesAndValidationChecks");

const browseWithDetails = asyncHandler(async (req, res, next) => {
  const result = await giveQueryPromise(
    {
      manager: "paintingReservations",
      method: "findAllReservationsWithDetails",
    },
    5
  );

  if (isError(result)) {
    return next(result);
  }
  req.body.detailedReservationsData = result;
  return next();
});

module.exports = {
  browseWithDetails,
};
