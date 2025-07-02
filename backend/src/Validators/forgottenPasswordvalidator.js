const { checkSchema } = require("express-validator");

const forgottenPasswordSchema = checkSchema({
  email: {
    exists: {
      errorMessage: "Vous devez renseigner une adresse email.",
      options: {
        checkFalsy: true,
      },
    },
    isEmail: {
      errorMessage: "L'adresse email doit avoir un format valide.",
    },
  },
});

// TODO: missing validations

module.exports = forgottenPasswordSchema;
