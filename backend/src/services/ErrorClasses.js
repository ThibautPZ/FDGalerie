const errorsList = require("../../public/json/errors.json");
const { isNotUndefined } = require("./typesAndValidationChecks");

class CustomErrorClass extends Error {
  constructor(code, errors, content) {
    super(content, { cause: errors });
    this.code = code;
    this.errors = errors || null;
    this.content = content || null;
    this.type = this.giveType();
    this.name = this.giveName();
    this.statusCode = this.giveStatusCode();
    this.publicCode = this.givePublicCode();
  }

  giveErrorInfo(field) {
    const key = this.code || "00000";
    const infos = errorsList[key];
    if (!isNotUndefined(infos)) {
      return null;
    }
    return infos[field];
  }

  giveType() {
    const returnedType = this.giveErrorInfo("type");
    if (!returnedType) {
      return "error";
    }
    return returnedType;
  }

  giveName() {
    const returnedName = this.giveErrorInfo("name");
    if (!returnedName) {
      return "unexpected error";
    }
    return returnedName;
  }

  giveStatusCode() {
    const returnedStatusCode = this.giveErrorInfo("statusCode");
    if (!returnedStatusCode) {
      return 400;
    }
    return returnedStatusCode;
  }

  givePublicCode() {
    const returnedPublicCode = this.giveErrorInfo("publicCode");
    if (!returnedPublicCode) {
      return this.code;
    }
    return returnedPublicCode;
  }
}

module.exports = CustomErrorClass;
