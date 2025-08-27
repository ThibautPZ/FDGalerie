const CustomErrorClass = require("../ErrorClasses");
const { isArray } = require("../typesAndValidationChecks");

const checkBodyFieldEqualitytoValue = (field, checkedValue) => {
  if (isArray(field)) {
    return field.some((fieldValue) => fieldValue === checkedValue);
  }
  return field === checkedValue;
};

const checkBodyKeyValuesFuncProvider = (
  checkOptionsArr,
  funcErrorNum = "00000"
) => {
  const checkBodyKeyValues = async (req) => {
    const { body } = req;
    const errors = [];
    checkOptionsArr.forEach((option) => {
      const { fieldName, values, errorNum, isMatchInvalid = false } = option;
      const isMatching = values.some((value) =>
        checkBodyFieldEqualitytoValue(body[fieldName], value)
      );

      if (isMatching === isMatchInvalid) {
        const error = new CustomErrorClass(errorNum);
        errors.push(error);
      }
    });

    if (errors.length === 1) {
      return errors[0];
    }

    if (errors.length > 1) {
      const error = new CustomErrorClass(funcErrorNum, errors);
      return error;
    }

    return null;
  };
  return checkBodyKeyValues;
};
module.exports = checkBodyKeyValuesFuncProvider;
