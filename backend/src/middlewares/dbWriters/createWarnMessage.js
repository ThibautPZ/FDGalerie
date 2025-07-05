const asyncHandler = require("express-async-handler");
const tables = require("../../tables");
const CustomErrorClass = require("../../services/ErrorClasses");

const createWarnMessage = asyncHandler(async (req, res, next) => {
  const { userId, notificationToUser } = req.body;
  const [result] = await tables.banMessages.createMessage(
    userId,
    notificationToUser
  );
  if (!result.affectedRows) {
    return next(new CustomErrorClass("00001"));
  }

  return next();
});

module.exports = createWarnMessage;
