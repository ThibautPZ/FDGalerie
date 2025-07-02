const { checkSchema } = require("express-validator");

const banUserSchema = checkSchema({
  userEmail: {
    exists: {
      errorMessage:
        "Vous devez renseigner l' adresse email correspondant au compte",
      options: {
        checkFalsy: true,
      },
    },
    isEmail: {
      errorMessage: "L'adresse adresse email doit être valide.",
    },
  },
  userId: {
    exists: {
      errorMessage: "Un id est requis",
      options: {
        checkFalsy: true,
      },
    },
    isNumeric: {
      errorMessage:
        "Votre mot de passe doit contenir entre 8 et 64 caractères.",
    },
  },
  messageToUser: {
    isLength: {
      options: { min: 2, max: 254 },
      errorMessage: "Le message est incorrect.",
    },
  },
});

module.exports = banUserSchema;
