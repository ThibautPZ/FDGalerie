const asyncHandler = require("express-async-handler");

const CustomErrorClass = require("../../services/ErrorClasses");
const { giveQueryPromise } = require("../../helpers/dbAsyncQueriesHelper");

const giveOwnerId = (reqBody) => {
  const {
    oeuvreAvailability,
    oeuvreGivenToKnownPerson,
    oeuvreSoldToKnownPerson,
    oeuvreReservedToKnownPerson,
  } = reqBody;
  if (oeuvreAvailability === 1) {
    return {
      userId: oeuvreGivenToKnownPerson.userId,
      contactId: oeuvreGivenToKnownPerson.contactId,
    };
  }
  if (oeuvreAvailability === 2) {
    return {
      userId: oeuvreSoldToKnownPerson.userId,
      contactId: oeuvreSoldToKnownPerson.contactId,
    };
  }
  if (oeuvreAvailability === 3) {
    return {
      userId: oeuvreReservedToKnownPerson.userId,
      contactId: oeuvreReservedToKnownPerson.contactId,
    };
  }
  return null;
};

const checkPaintingOwnerId = asyncHandler(async (req, res, next) => {
  const { oeuvreAvailability } = req.body;

  if (oeuvreAvailability === 4 || oeuvreAvailability === 5) {
    return next();
  }

  const { userId, contactId } = giveOwnerId(req.body);
  if (!userId && !contactId) {
    const err = new CustomErrorClass("05013");
    return next(err);
  }
  const manager = userId ? "users" : "contacts";
  const method = "findNameById";
  const queryArgs = [userId || contactId];

  const result = await giveQueryPromise(
    { name: `${manager}${method}`, manager, method, queryArgs },
    5
  );

  if (!result.length) {
    const err = new CustomErrorClass("05013");
    return next(err);
  }
  return next();
});

module.exports = checkPaintingOwnerId;
