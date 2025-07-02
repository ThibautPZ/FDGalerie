const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const createBanMessage = asyncHandler(async (req, res, next) => {
  const { userId, messageToUser } = req.body;
  const [result] = await tables.ban_messages.createMessage(
    userId,
    messageToUser
  );
  if (!result.affectedRows) {
    const err = new Error();
    return next(err);
  }
  return next();
});

module.exports = createBanMessage;
