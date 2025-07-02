const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const updateAccountStateToBanned = asyncHandler(async (req, res, next) => {
  const { userId, userEmail } = req.body;
  const [result] = await tables.users.updateAccountState(userEmail, userId, 3);
  if (!result.affectedRows) {
    const err = new Error();
    return next(err);
  }
  return next();
});

module.exports = updateAccountStateToBanned;
