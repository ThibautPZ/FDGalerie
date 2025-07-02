const ServiceUtils = require("../../services/ServiceUtils");

const addNewUserInfos = (req, res, next) => {
  const accountDate = ServiceUtils.giveTodayDate();
  req.body.accountDate = accountDate;
  req.body.userTypesId = 1;
  req.body.accountStateId = 1;
  return next();
};

module.exports = addNewUserInfos;
