const ServiceUtils = require("../../services/ServiceUtils");

const adminAddNewContactInfos = (req, res, next) => {
  const contactDate = ServiceUtils.giveTodayDate();
  req.body.contactDate = contactDate;

  return next();
};

module.exports = adminAddNewContactInfos;
