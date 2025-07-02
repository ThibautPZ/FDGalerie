const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const checkUserExistsByEmailWithPassword = asyncHandler(
  async (req, res, next) => {
    const [users] = await tables.users.findOneByEmail(req.body.email);

    if (!users.length) {
      return res.status(401).json("Informations erronnées");
    }
    req.user = users.shift();
    return next();
  }
);

module.exports = checkUserExistsByEmailWithPassword;
