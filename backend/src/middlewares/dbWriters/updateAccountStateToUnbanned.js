const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const updateAccountStateToUnbanned = asyncHandler(async (req, res, next) => {
  const { userId, userEmail } = req.body;
  const [result] = await tables.users.updateAccountState(userEmail, userId, 1);
  if (!result.affectedRows) {
    const err = new Error();
    return next(err);
  }
  return next();
});

module.exports = updateAccountStateToUnbanned;
