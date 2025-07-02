const { checkSchema, body } = require("express-validator");

const modifyUserInfoSchema = checkSchema({
  lastname: {
    exists: { if: body("lastname").notEmpty() },

    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: "Le nom doit avoir entre 2 et 64 caractères.",
    },
  },
  firstname: {
    exists: { if: body("firstname").notEmpty() },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: "Le prénom doit avoir entre 2 et 64 caractères.",
    },
  },

  email: {
    exists: {
      if: body("email").notEmpty(),
    },
    isEmail: {
      errorMessage: "L'adresse email doit avoir un format valide.",
    },
  },

  "user.userTypesId": {
    exists: {
      errorMessage: "Le type d'utilisateur est manquant.",
      options: {
        checkFalsy: true,
      },
    },
  },
});

module.exports = modifyUserInfoSchema;
