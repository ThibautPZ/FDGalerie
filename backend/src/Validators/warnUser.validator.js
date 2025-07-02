const { checkSchema } = require("express-validator");

const warnUserSchema = checkSchema({
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
  notificationToUser: {
    isLength: {
      options: { min: 2, max: 254 },
      errorMessage: "Le message est incorrect.",
    },
  },
});

module.exports = warnUserSchema;
