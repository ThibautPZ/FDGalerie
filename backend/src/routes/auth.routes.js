const express = require("express");

const router = express.Router();

const authControllers = require("../controllers/authControllers");

const { hashPassword } = require("../middlewares/hashPassword");
const validateSchema = require("../middlewares/validateSchema");
const loginSchema = require("../Validators/login.validator");
const createUserSchema = require("../Validators/createUser.validator");
const createContactSchema = require("../Validators/createContact.validator");
const updatePasswordSchema = require("../Validators/updatePassword.validator");
const forgottenPasswordSchema = require("../Validators/forgottenPasswordvalidator");
const resetPasswordSchema = require("../Validators/resetPassword.validator");
const updateContactSchema = require("../Validators/updateContact.validator");

const {
  checkContactExists,
} = require("../middlewares/dbCheckers/existInDbCheckers");

const checkAndUpdateLanguage = require("../middlewares/dbCheckers/checkAndUpdateLanguage");
const checkContactOrUserDoesntExist = require("../middlewares/dbCheckers/checkContactOrUserDoesntExist");
const checkUserDoesntExist = require("../middlewares/dbCheckers/checkUserDoesntExist");
const checkUserExistsByEmail = require("../middlewares/dbCheckers/checkUserExistsByEmail");
const checkPasswordResetToken = require("../middlewares/dbCheckers/checkPasswordResetToken");

const deletePasswordResetTokens = require("../middlewares/dbWriters/deletePasswordResetTokens");

const addNewUserInfos = require("../middlewares/reqAdders/addNewUserInfos");
const adminAddNewUserInfos = require("../middlewares/reqAdders/adminAddNewUserInfos");
const adminAddNewContactInfos = require("../middlewares/reqAdders/adminAddNewContactInfos");

const checkUserPassword = require("../middlewares/reqCheckers/checkUserPassword");
const checkOneOfBodyKeysExists = require("../middlewares/reqCheckers/checkOneOfBodyKeysExists");

const convertKeysToColumns = require("../reqBodyKeysConverters/convertKeysToColumns");
const updateContactConversionSchema = require("../reqBodyKeysConverters/updateContactConversionSchema");
const verifyFormerPassword = require("../middlewares/verifyFormerPassword");
const checkUserExistsByEmailWithPassword = require("../middlewares/dbCheckers/checkUserExistsByEmailWithPassword");

router.post(
  "/login",
  validateSchema(loginSchema),
  checkUserExistsByEmailWithPassword,
  checkUserPassword,
  checkAndUpdateLanguage,
  authControllers.login
);

router.post(
  "/signup",
  addNewUserInfos,
  validateSchema(createUserSchema),
  checkUserDoesntExist,
  hashPassword,
  authControllers.signUp
);

router.post(
  "/createUser",
  adminAddNewUserInfos,
  validateSchema(createUserSchema),
  checkUserDoesntExist,
  hashPassword,
  authControllers.signUp2
);

router.post(
  "/createContact",
  adminAddNewContactInfos,
  validateSchema(createContactSchema),
  checkOneOfBodyKeysExists([
    "optionalDependantFirstname",
    "optionalDependantLastname",
  ]),
  checkContactOrUserDoesntExist,
  authControllers.createOneContact
);

router.post(
  "/passwordUpdate",
  validateSchema(updatePasswordSchema),
  hashPassword,
  checkUserExistsByEmailWithPassword,
  verifyFormerPassword,
  authControllers.modifyPassword
);

router.post(
  "/forgottenPassword",
  validateSchema(forgottenPasswordSchema),
  checkUserExistsByEmail,
  authControllers.sendPasswordResetLink
);

router.post(
  "/resetPassword",
  validateSchema(resetPasswordSchema),
  hashPassword,
  checkPasswordResetToken,
  deletePasswordResetTokens,
  authControllers.resetPassword
);
router.get("/logout", authControllers.logout);

router.put(
  "/updateContact/:id",
  validateSchema(updateContactSchema),
  checkContactExists({
    location: "params",
    key: "id",
    columnName: "contacts_id",
  }),
  convertKeysToColumns(updateContactConversionSchema, true),
  authControllers.updateContact
);

router.get("/", authControllers.browse);

module.exports = router;
