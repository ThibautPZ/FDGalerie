const { isStringNotEmpty } = require("./typesAndValidationChecks");

const uppercaseFirstChar = (str) => {
  if (!isStringNotEmpty(str)) {
    return null;
  }
  const uppercasedChar = str[0].toUpperCase();
  const remainingChars = str.slice(1);
  return `${uppercasedChar}${remainingChars}`;
};

const lowercaseFirstChar = (str) => {
  if (!isStringNotEmpty(str)) {
    return null;
  }
  const lowercasedChar = str[0].toLowerCase();
  const remainingChars = str.slice(1);
  return `${lowercasedChar}${remainingChars}`;
};

const toScreamingSnakeCase = (str) => {
  if (!isStringNotEmpty(str)) {
    return "";
  }
  return str
    .replace(
      /([a-z])(?=[A-Z])|([A-Za-z])(?=\d)|(\d)(?=[A-Za-z])|[\s\-_]+/g,
      (match, lowerToUpper, letterToDigit, digitToLetter) => {
        if (lowerToUpper) return `${lowerToUpper}_`;
        if (letterToDigit) return `${letterToDigit}_`;
        if (digitToLetter) return `${digitToLetter}_`;
        return "_";
      }
    )
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
};
module.exports = {
  uppercaseFirstChar,
  lowercaseFirstChar,
  toScreamingSnakeCase,
};
