const { checkSchema } = require("express-validator");

const loginSchema = checkSchema({
  email: {
    exists: {
      errorMessage:
        "Vous devez renseigner l' adresse email correspondant à votre compte.",
      options: {
        checkFalsy: true,
      },
    },
    isEmail: {
      errorMessage: "Votre adresse email doit être valide.",
    },
  },
  password: {
    exists: {
      errorMessage: "Un mot de passe est requis",
      options: {
        checkFalsy: true,
      },
    },
    isLength: {
      options: { min: 8, max: 64 },
      errorMessage:
        "Votre mot de passe doit contenir entre 8 et 64 caractères.",
    },
  },
  userLang: {
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: "Le code langage est incorrect.",
    },
  },
});

module.exports = loginSchema;
