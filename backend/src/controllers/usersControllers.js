const asyncHandler = require("express-async-handler");
const async = require("async");
const tables = require("../tables");
const ServiceUtils = require("../services/ServiceUtils");
const mailTextFr = require("../../public/locales/fr/mailText.json");
const mailTextEn = require("../../public/locales/en/mailText.json");
const MailTemplates = require("../services/MailTemplates");

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.users.read();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const modifyInfo = asyncHandler(async (req, res, next) => {
  const oldInfos = { ...req.body.user };
  const newInfos = { ...req.body };
  delete newInfos.user;

  const [result] = await tables.users.updateInfo(newInfos, oldInfos.id);

  if (result.affectedRows) {
    res.status(201).json({ ...oldInfos, ...newInfos });
  } else {
    res.sendStatus(500);
  }
});

const banAccount = asyncHandler(async (req, res, next) => {
  const { userEmail, userLang, messageToUser } = req.body;
  const mailText = ServiceUtils.pickMailText(userLang, mailTextFr, mailTextEn);
  const mailOption = {
    email: userEmail,
    subject: mailText.banMail.subject,
    message: ServiceUtils.bannedAccountNotificationMailTemplate(
      messageToUser || mailText.banMail.message[1],
      mailText.banMail.message[2],
      `${process.env.FRONTEND_URL}/contact`,
      mailText.banMail.button.moderationLink,
      mailText.common.signature,
      mailText.common.dontAnswer
    ),
  };
  await ServiceUtils.sendEmail(mailOption);
  res.status(200).json({
    success: true,
    successObj: { type: "info", message: "banWithMessage" },
  });
});

const unbanAccount = asyncHandler(async (req, res, next) => {
  const { userEmail, userLang, messageToUser } = req.body;
  const mailText = ServiceUtils.pickMailText(userLang, mailTextFr, mailTextEn);

  const mailOption = {
    email: userEmail,
    subject: mailText.unbanMail.subject,
    message: ServiceUtils.bannedAccountNotificationMailTemplate(
      messageToUser || mailText.unbanMail.message[1],
      mailText.unbanMail.message[2],
      `${process.env.FRONTEND_URL}/Connexion`,
      mailText.unbanMail.button.connexionLink,
      mailText.common.signature,
      mailText.common.dontAnswer
    ),
  };
  await ServiceUtils.sendEmail(mailOption);
  res.status(200).json({
    success: true,
    successObj: { type: "info", message: "unbanWithMessage" },
  });
});

const deleteAccount = asyncHandler(async (req, res, next) => {
  const { userEmail, userLang, messageToUser } = req.body;
  const mailText = ServiceUtils.pickMailText(userLang, mailTextFr, mailTextEn);

  const mailOption = {
    email: userEmail,
    subject: mailText.deleteAccountMail.subject,
    message: MailTemplates.deletedAccountNotificationMailTemplate(
      messageToUser || mailText.deleteAccountMail.message,
      mailText.common.signature,
      mailText.common.dontAnswer
    ),
  };
  await ServiceUtils.sendEmail(mailOption);
  res.status(200).json({
    success: true,
    successObj: { type: "info", message: "deleteWithMessage" },
  });
});

const warnAccount = asyncHandler(async (req, res, next) => {
  const { userEmail, userLang, notificationToUser } = req.body;
  const mailText = ServiceUtils.pickMailText(userLang, mailTextFr, mailTextEn);

  const mailOption = {
    email: userEmail,
    subject: mailText.warnMail.subject,
    message: MailTemplates.warnedAccountNotificationMailTemplate(
      mailText.warnMail.message,
      notificationToUser,
      `${process.env.FRONTEND_URL}/Connexion`,
      mailText.warnMail.button.connexionLink,
      mailText.common.signature,
      mailText.common.dontAnswer
    ),
  };
  await ServiceUtils.sendEmail(mailOption);
  res.status(200).json({
    success: true,
    successObj: { type: "info", message: "warnWithMessage" },
  });
});

const unwarnAccount = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    successObj: { type: "info", message: "unwarned" },
  });
});

const readByNameWithContacts = asyncHandler(async (req, res, next) => {
  const { firstname, lastname } = req.params;

  const firstnameParam = firstname === "!null" ? null : `%${firstname}%`;
  const lastnameParam = lastname === "!null" ? null : `%${lastname}%`;
  if (!firstnameParam && !lastnameParam) {
    next(Error);
  }

  const results = await async.parallel({
    users: async () => {
      const [result] = await tables.users.findByName(
        firstnameParam,
        lastnameParam
      );
      return result;
    },
    contacts: async () => {
      const [result] = await tables.contacts.findByName(
        firstnameParam,
        lastnameParam
      );
      return result;
    },
  });

  if (results) {
    const resultArray = [...results.users, ...results.contacts];
    const searchedParams = {
      firstname: firstname === "!null" ? null : firstname,
      lastname: lastname === "!null" ? null : lastname,
    };
    res.status(200).json({
      success: true,
      searchResults: resultArray,
      searchedParams,
    });
  }
});

module.exports = {
  browse,
  modifyInfo,
  banAccount,
  unbanAccount,
  deleteAccount,
  warnAccount,
  unwarnAccount,
  readByNameWithContacts,
};
