const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const checkEmailDoesntExist = asyncHandler(async (req, res, next) => {
  const [userByEmail] = await tables.users.findOneByEmailExcludingId(
    req.body.email,
    req.body.user.id
  );

  if (userByEmail.length) {
    return res.status(400).json({
      message: "Un utilisateur possédant cette adresse email existe déjà.",
    });
  }
  return next();
});

module.exports = checkEmailDoesntExist;
