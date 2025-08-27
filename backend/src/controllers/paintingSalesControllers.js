const asyncHandler = require("express-async-handler");

const { giveQueryPromise } = require("../helpers/dbAsyncQueriesHelper");
const { isError } = require("../services/typesAndValidationChecks");

const browseWithDetails = asyncHandler(async (req, res, next) => {
  const result = await giveQueryPromise(
    {
      manager: "paintingSales",
      method: "findAllSalesWithDetails",
    },
    5
  );

  if (isError(result)) {
    return next(result);
  }
  req.body.detailedSalesData = result;
  return next();
});

module.exports = {
  browseWithDetails,
};
