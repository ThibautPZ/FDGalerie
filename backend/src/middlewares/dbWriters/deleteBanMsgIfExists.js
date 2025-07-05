const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const deleteBanMsgIfExists = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const [result] = await tables.banMessages.findOneById(userId);

  if (result.length) {
    const [result2] = await tables.banMessages.deleteOneById(userId);
    if (!result2.affectedRows) {
      const err = new Error();
      return next(err);
    }
  }
  return next();
});

module.exports = deleteBanMsgIfExists;
