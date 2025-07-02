const express = require("express");

const router = express.Router();
const { param } = require("express-validator");
const validateSchema = require("../middlewares/validateSchema");
const usersControllers = require("../controllers/usersControllers");
const errorHandler = require("../middlewares/errorHandler");

const warnUserSchema = require("../Validators/warnUser.validator");
const unwarnUserSchema = require("../Validators/unwarnUser.validator");
const banUserSchema = require("../Validators/banUser.validator");
const modifyUserInfoSchema = require("../Validators/modifyUserInfo.validator");

const checkEmailDoesntExist = require("../middlewares/dbCheckers/checkEmailDoesntExist");
const deleteBanMsgIfExists = require("../middlewares/dbWriters/deleteBanMsgIfExists");
const updateAccountState = require("../middlewares/dbWriters/updateAccountState");
const createWarnMessage = require("../middlewares/dbWriters/createWarnMessage");
const createBanMessage = require("../middlewares/dbWriters/createBanMessage");
const deleteAccountData = require("../middlewares/dbWriters/deleteAccountData");
const addNewUserInfos = require("../middlewares/reqAdders/addNewUserInfos");

router.get(
  "/searchUsersAndContactsByName/:firstname&:lastname",
  validateSchema(param()),
  usersControllers.readByNameWithContacts,
  errorHandler
);

router.post(
  "/warningByAdmin",
  validateSchema(warnUserSchema),
  deleteBanMsgIfExists,
  updateAccountState("warned"),
  createWarnMessage,
  usersControllers.warnAccount,
  errorHandler
);

router.put(
  "/unwarning",
  validateSchema(unwarnUserSchema),
  deleteBanMsgIfExists,
  updateAccountState("active"),
  usersControllers.unwarnAccount,
  errorHandler
);

router.post(
  "/banUser",
  validateSchema(banUserSchema),
  deleteBanMsgIfExists,
  updateAccountState("banned"),
  createBanMessage,
  usersControllers.banAccount,
  errorHandler
);

router.post(
  "/unbanUser",
  validateSchema(banUserSchema),
  deleteBanMsgIfExists,
  updateAccountState("active"),
  createBanMessage,
  usersControllers.unbanAccount,
  errorHandler
);

router.post(
  "/deleteByAdmin",
  validateSchema(banUserSchema),
  deleteBanMsgIfExists,
  deleteAccountData,
  usersControllers.deleteAccount,
  errorHandler
);

// todo: check if update works
router.post(
  "/updateInfo",
  addNewUserInfos,
  checkEmailDoesntExist,
  validateSchema(modifyUserInfoSchema),
  usersControllers.modifyInfo
);

router.get("/", usersControllers.browse);

router.get("/*", errorHandler);

module.exports = router;
