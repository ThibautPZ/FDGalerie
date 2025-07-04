const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const checkPasswordResetToken = asyncHandler(async (req, res, next) => {
  const { token, userId } = req.body;
  const [userToken] = await tables.passwordResetTokens.readPasswordResetToken(
    userId
  );

  if (!res || res.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Un problème est survenu. Veuillez réessayer.",
    });
  }
  const currDateTime = new Date();
  const expiresAt = new Date(userToken[0].expires_at);
  if (currDateTime > expiresAt) {
    return res.status(400).json({
      success: false,
      message:
        "Le lien de réinitialisation a dépassé le délai de validité. Veuillez demander à nouveau un lien de réinitialisation du mot de passe.",
    });
  }
  if (userToken[0].token !== token || userToken.length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "Ce lien de réinitialisation est invalide. Veuillez demander à nouveau un lien de réinitialisation du mot de passe.",
    });
  }
  return next();
});

module.exports = checkPasswordResetToken;
