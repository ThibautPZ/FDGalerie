const { checkSchema } = require("express-validator");

const unwarnUserSchema = checkSchema({
  userId: {
    exists: {
      errorMessage: "A user id is required",
      options: {
        checkFalsy: true,
      },
    },
    isNumeric: {
      errorMessage: "Your user Id must be numeric",
    },
  },
  userEmail: {
    exists: {
      errorMessage: "A user email is required",
      options: {
        checkFalsy: true,
      },
    },
    isEmail: {
      errorMessage: "L'adresse email doit avoir un format valide.",
    },
  },
});

module.exports = unwarnUserSchema;
