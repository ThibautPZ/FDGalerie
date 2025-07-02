const asyncHandler = require("express-async-handler");
const tables = require("../../tables");
const CustomErrorClass = require("../../services/ErrorClasses");

const checkBanMessageDoesntExist = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const [result] = await tables.ban_messages.findOneById(userId);

  if (result.length) {
    return next(new CustomErrorClass("00002"));
  }
  return next();
});

module.exports = checkBanMessageDoesntExist;
