const asyncHandler = require("express-async-handler");
const { verifyPassword } = require("../helpers/argon2Helper");

const verifyFormerPassword = asyncHandler(async (req, res, next) => {
  const isVerified = await verifyPassword(
    req.user.hashedPassword,
    req.body.formerPassword
  );
  if (!isVerified) {
    const err = new Error();
    return next(err);
  }

  delete req.user.hashedPassword;
  delete req.formerPassword;
  return next();
});

module.exports = verifyFormerPassword;
