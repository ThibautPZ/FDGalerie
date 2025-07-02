const asyncHandler = require("express-async-handler");
const CustomErrorClass = require("../../services/ErrorClasses");
const tables = require("../../tables");

const updateAccountState = (newState) => {
  return asyncHandler(async (req, res, next) => {
    const references = { active: 1, warned: 2, banned: 3, deleted: 4 };
    if (!references[newState]) {
      return next(new CustomErrorClass("00001"));
    }
    const { userId, userEmail } = req.body;
    const [result] = await tables.users.updateAccountState(
      userEmail,
      userId,
      references[newState]
    );
    if (!result.affectedRows) {
      return next(new CustomErrorClass("00001"));
    }
    return next();
  });
};

module.exports = updateAccountState;
