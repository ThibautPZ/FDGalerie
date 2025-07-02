const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const tables = require("../tables");
const { encodeJWT } = require("../helpers/jwtHelper");
const ServiceUtils = require("../services/ServiceUtils");
const MailTemplates = require("../services/MailTemplates");
const CustomErrorClass = require("../services/ErrorClasses");
const successfulResMsg = require("../../public/json/successfulResMsg.json");

const browse = async (req, res, next) => {
  try {
    const [rows] = await tables.users.readAll();
    if (rows) {
      res.send(rows);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const login = asyncHandler(async (req, res, next) => {
  const token = await encodeJWT(req.user);
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: false,
  });
  res.status(200).json(req.user);
});

const signUp = asyncHandler(async (req, res, next) => {
  req.body.gender = parseInt(req.body.gender, 10);
  if (Number.isNaN(req.body.gender)) {
    // signupFormData.gender = null;
    Object.assign(req.body, { gender: 4 });
  }

  const [result] = await tables.users.insert(req.body);
  if (result.affectedRows) {
    delete req.body.passwordconfirmation;
    delete req.body.hashedPassword;
    res.status(201).json({ id: result.insertId, ...req.body });
  } else {
    const err = new Error();
    next(err);
  }
});

const signUp2 = asyncHandler(async (req, res, next) => {
  req.body.gender = parseInt(req.body.gender, 10);
  if (Number.isNaN(req.body.gender)) {
    // signupFormData.gender = null;
    Object.assign(req.body, { gender: 4 });
  }

  const [result] = await tables.users.insert(req.body);
  if (result.affectedRows) {
    delete req.body.passwordconfirmation;
    delete req.body.hashedPassword;
    res.status(201).json({
      newUser: { id: result.insertId, ...req.body },
      success: true,
      successObj: { type: "info", message: "createdUser" },
    });
  } else {
    const err = new Error();
    next(err);
  }
});
const logout = (req, res) => {
  res.clearCookie("auth_token").sendStatus(200);
};

const modifyPassword = asyncHandler(async (req, res, next) => {
  // const isVerified = await verifyPassword(
  //   req.user.hashedPassword,
  //   req.body.formerPassword
  // );
  delete req.body.formerPassword;
  const [result] = await tables.users.updatePassword(
    req.body.hashedPassword,
    req.user.id
  );
  if (result.affectedRows) {
    res.status(200).json(req.user);
  } else {
    const err = new Error();
    next(err);
  }
});

const sendPasswordResetLink = asyncHandler(async (req, res, next) => {
  if (req.body.userId) {
    const token = crypto.randomBytes(20).toString("hex");
    const resetToken = crypto.createHash("sha256").update(token).digest("hex");
    const [result] = await tables.password_reset_tokens.createToken(
      req.body.userId,
      resetToken
    );

    if (result.affectedRows) {
      const mailOption = {
        email: req.body.email,
        subject:
          "Votre demande de réinitialisation du mot de passe de votre compte FannyDeglave",
        message: ServiceUtils.resetPasswordLinkMailTemplate(
          `Nous avons reçu une demande de réinitialisation du mot de passe de votre compte sur le site ${process.env.FRONTEND_URL}. Vous pouvez réinitialiser votre mot de passe en cliquant sur le bouton ci-dessous.`,
          `${process.env.FRONTEND_URL}/reinitialisationMDP?id=${req.body.userId}&token=${resetToken}`,
          "Réinitialiser le mot de passe"
        ),
      };
      await ServiceUtils.sendEmail(mailOption);
      res.status(200).json({
        success: true,
        message:
          "Un lien permettant de réinitialiser votre mot de passe a été envoyé sur votre boîte mail.",
      });
    } else {
      res.sendStatus(500).json({
        success: false,
        message:
          "Une erreur s'est produite, le processus de récupération du mot de passe n'a pas abouti. Veuillez réessayer.",
      });
    }
  } else {
    const mailOption = {
      email: req.body.email,
      subject: `Tentative de réinitialisation du mot de passe sur le site ${process.env.FRONTEND_URL}`,
      message: MailTemplates.notRegisteredMailTemplate(req.body.email),
    };
    await ServiceUtils.sendEmail(mailOption);
    res.status(200).json({
      success: true,
      message:
        "Un lien permettant de réinitialiser votre mot de passe a été envoyé sur votre boîte mail.",
    });
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { hashedPassword, userId } = req.body;

  await tables.users.updatePassword(hashedPassword, userId);
  res.status(200).json({
    success: true,
    message: "Your password reset was successful!",
  });
});

const updateContact = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const [result] = await tables.contacts.modifyContact(
    req.body.convertedEntries,
    id
  );

  if (!result.affectedRows) {
    const error = new CustomErrorClass("06001");
    next(error);
  }

  const successObj = successfulResMsg.authController.updateContact;

  res.status(200).json({
    success: true,
    successObj,
  });
});

const createOneContact = asyncHandler(async (req, res, next) => {
  const {
    optionalDependantLastname,
    optionalDependantFirstname,
    phoneNumber1,
    phoneNumber2,
    optionalEmail,
    optionalAddress,
    optionalPostalCode,
    optionalCity,
    spokenLanguage,
    contactDate,
  } = req.body;

  const [result] = await tables.contacts.insertOneContact(
    optionalDependantLastname,
    optionalDependantFirstname,
    phoneNumber1,
    phoneNumber2,
    optionalEmail,
    optionalAddress,
    optionalPostalCode,
    optionalCity,
    spokenLanguage,
    contactDate
  );
  if (result.affectedRows) {
    const successObj = {
      ...successfulResMsg.authController.createOneContact,
      infoData: {
        insertText1: `${optionalDependantFirstname} ${optionalDependantLastname}`,
      },
    };
    res.status(201).json({
      success: true,
      successObj,
    });
  } else {
    const cannotWriteContactError = new CustomErrorClass("06001");
    next(cannotWriteContactError);
  }
});

module.exports = {
  login,
  signUp,
  signUp2,
  logout,
  browse,
  modifyPassword,
  sendPasswordResetLink,
  resetPassword,
  createOneContact,
  updateContact,
};
