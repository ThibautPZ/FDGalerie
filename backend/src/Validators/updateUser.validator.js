const { checkSchema } = require("express-validator");

const updateUserSchema = checkSchema({
  username: {
    exists: {
      errorMessage: "A username is required",
      options: {
        checkFalsy: true,
      },
    },
    isLength: {
      options: { min: 3, max: 64 },
      errorMessage: "Your user name must have between 3 and 64 characters",
    },
  },
  firstname: {
    exists: {
      errorMessage: "A first name is required",
      options: {
        checkFalsy: true,
      },
    },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: "Your first name must have between 2 and 64 characters",
    },
  },
  lastname: {
    exists: {
      errorMessage: "A last name is required",
      options: {
        checkFalsy: true,
      },
    },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: "Your first name must have between 2 and 64 characters",
    },
  },
  email: {
    exists: {
      errorMessage: "An email is required",
      options: {
        checkFalsy: true,
      },
    },
    isEmail: {
      errorMessage: "Your must enter a valid email address",
    },
  },
  password: {
    exists: {
      errorMessage: "A password is required",
      options: {
        checkFalsy: true,
      },
    },
    isLength: {
      options: { min: 8, max: 64 },
      errorMessage: "Your password must contain between 8 and 64 characters",
    },
  },
  usertype_id: {
    exists: {
      errorMessage: "A usertype id is required",
      options: {
        checkFalsy: true,
      },
    },
    isNumeric: {
      errorMessage: "Your user type Id must be numeric",
    },
  },
  id: {
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
});

module.exports = updateUserSchema;
