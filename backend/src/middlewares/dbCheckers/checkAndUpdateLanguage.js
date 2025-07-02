const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const checkAndUpdateLanguage = asyncHandler(async (req, res, next) => {
  if (req.body.userLang !== req.user.registeredLanguagesId) {
    const [result] = await tables.users.updateLanguage(
      req.body.userLang,
      req.user.users_id
    );
    if (!result.affectedRows) {
      return res.status(401).json("language update fail");
    }
    req.user.registeredLanguagesId = req.body.userLang;
  }
  return next();
});

module.exports = checkAndUpdateLanguage;
