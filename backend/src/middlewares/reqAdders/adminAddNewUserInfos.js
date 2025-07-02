const ServiceUtils = require("../../services/ServiceUtils");

const adminAddNewUserInfos = (req, res, next) => {
  const accountDate = ServiceUtils.giveTodayDate();
  req.body.accountDate = accountDate;
  req.body.accountStatesId = 1;

  return next();
};

module.exports = adminAddNewUserInfos;
