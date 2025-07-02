const asyncHandler = require("express-async-handler");
const CustomErrorClass = require("../../services/ErrorClasses");
const { verifyPassword } = require("../../helpers/argon2Helper");

const checkUserPassword = asyncHandler(async (req, res, next) => {
  const isVerified = await verifyPassword(
    req.user.hashedPassword,
    req.body.password
  );

  delete req.user.hashedPassword;
  if (!isVerified) {
    const wrongUserPasswordErr = new CustomErrorClass("00200");
    return next(wrongUserPasswordErr);
  }

  return next();
});

module.exports = checkUserPassword;
