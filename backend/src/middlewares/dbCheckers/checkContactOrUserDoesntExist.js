const asyncHandler = require("express-async-handler");
const tables = require("../../tables");

const checkContactOrUserDoesntExist = asyncHandler(async (req, res, next) => {
  const {
    optionalDependantLastname,
    optionalDependantFirstname,
    phoneNumber1,
    phoneNumber2,
    optionalEmail,
    verificationBypass,
  } = req.body;

  if (verificationBypass === "checkContactOrUserDoesntExist") {
    return next();
  }

  const [matchingContacts] = await tables.contacts.findByNamePhoneEmail(
    optionalDependantLastname,
    optionalDependantFirstname,
    phoneNumber1,
    phoneNumber2,
    optionalEmail
  );
  const [matchingUsers] = await tables.users.findByNamePhoneEmail(
    optionalDependantLastname,
    optionalDependantFirstname,
    phoneNumber1,
    phoneNumber2,
    optionalEmail
  );

  const matchingPeople = matchingContacts.concat(matchingUsers);

  if (matchingPeople.length) {
    return res.status(409).json({
      errorObj: {
        type: "confirmation",
        message: "matchingPerson",
        confirmationData: {
          case: "matchingPeople",
          matchingPeople,
          originalReq: req.body,
        },
      },
    });
  }
  return next();
});

module.exports = checkContactOrUserDoesntExist;
