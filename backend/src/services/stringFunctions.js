const { isStringNotEmpty } = require("./typesAndValidationChecks");

const uppercaseFirstChar = (str) => {
  if (!isStringNotEmpty(str)) {
    return null;
  }
  const uppercasedChar = str[0].toUpperCase();
  const remainingChars = str.slice(1);
  return `${uppercasedChar}${remainingChars}`;
};

module.exports = { uppercaseFirstChar };
