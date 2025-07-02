const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const checkUserDoesntExist = asyncHandler(async (req, res, next) => {
  const [userByEmail] = await tables.users.findOneByEmail(req.body.email);

  if (userByEmail.length) {
    return res.status(400).json({
      errorObj: { type: "error", title: "signUpError", message: "takenMail" },
    });
  }
  return next();
});

module.exports = checkUserDoesntExist;
