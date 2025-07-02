const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const deleteAccountData = asyncHandler(async (req, res, next) => {
  const { userId, userEmail } = req.body;
  const [result] = await tables.users.deleteData(userEmail, userId, 4);
  if (!result.affectedRows) {
    const err = new Error();
    return next(err);
  }
  return next();
});

module.exports = deleteAccountData;
