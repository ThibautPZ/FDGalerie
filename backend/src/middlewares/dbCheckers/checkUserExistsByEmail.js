const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const checkUserExistsByEmail = asyncHandler(async (req, res, next) => {
  const [users] = await tables.users.findOneByEmail(req.body.email);

  if (users.length) {
    req.body.userId = users[0].id;
  }
  return next();
});

module.exports = checkUserExistsByEmail;
