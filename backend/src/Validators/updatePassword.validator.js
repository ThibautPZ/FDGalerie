const { checkSchema } = require("express-validator");

const updatePasswordSchema = checkSchema({
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
  formerPassword: {
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

module.exports = updatePasswordSchema;
