const { checkSchema } = require("express-validator");

const resetPasswordSchema = checkSchema({
  password: {
    exists: {
      errorMessage: "Vous devez renseigner un mot de passe.",
      options: {
        checkFalsy: true,
      },
    },
    isLength: {
      options: { min: 8, max: 64 },
      errorMessage: "Le mot de passe doit avoir entre 8 et 64 caractères. ",
    },
  },
});

// TODO: missing validations

module.exports = resetPasswordSchema;
