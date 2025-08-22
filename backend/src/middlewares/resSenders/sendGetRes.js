const asyncHandler = require("express-async-handler");
const CustomErrorClass = require("../../services/ErrorClasses");

const sendGetRes = (...fieldsToSend) => {
  return asyncHandler(async (req, res, next) => {
    if (!fieldsToSend.length) {
      return next(new CustomErrorClass("00001"));
    }
    if (fieldsToSend.length === 1) {
      const fieldToSend = fieldsToSend[0];
      const sent = req.body[fieldToSend];
      return res.status(200).json(sent);
    }

    const sent = {};
    fieldsToSend.forEach((field) => {
      const sentField = req.body[field];
      if (sentField) {
        sent[field] = sentField;
      }
    });
    return res.status(200).json(sent);
  });
};

module.exports = sendGetRes;
