const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const deletePasswordResetTokens = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const [deleted] =
    await tables.password_reset_tokens.deletePasswordResetTokens(userId);

  if (deleted.affectedRows) {
    const err = new Error();
    return next(err);
  }
  return next();
});

module.exports = deletePasswordResetTokens;
