const { isStringNotEmpty } = require("./typesAndValidationChecks");
const {
  characterNotLowerCharRegExp,
  punctuationRegExp,
  digitRegExp,
} = require("./regularExpressions");

const uppercaseFirstChar = (str) => {
  if (!isStringNotEmpty(str)) {
    return null;
  }
  const uppercasedChar = str[0].toUpperCase();
  const remainingChars = str.slice(1);
  return `${uppercasedChar}${remainingChars}`;
};

const caseToUpperCase = (str) => {
  if (!isStringNotEmpty(str)) {
    return "";
  }
  const trimmedStr = str.trim();
  let returnedStr = "";
  let prevMatchIndex = -1;
  let prevMatchType = "";

  for (let i = 0; i < trimmedStr.length; i += 1) {
    const char = trimmedStr[i];
    if (punctuationRegExp.test(char)) {
      if (
        i !== 0 &&
        (prevMatchIndex !== i - 1 ||
          (prevMatchType !== "punctuation" && prevMatchIndex === i - 1))
      ) {
        returnedStr = `${returnedStr}_`;
      }
      prevMatchIndex = i;
      prevMatchType = "punctuation";
    } else if (digitRegExp.test(char)) {
      if (
        i !== 0 &&
        (prevMatchIndex !== i - 1 ||
          (prevMatchType !== "number" && prevMatchIndex === i - 1))
      ) {
        returnedStr = `${returnedStr}_${char}`;
      } else {
        returnedStr = `${returnedStr}${char}`;
      }
      prevMatchIndex = i;
      prevMatchType = "number";
    } else if (characterNotLowerCharRegExp.test(char)) {
      if (
        i !== 0 &&
        (prevMatchIndex !== i - 1 ||
          (prevMatchType !== "other" && prevMatchIndex === i - 1))
      ) {
        returnedStr = `${returnedStr}_${char}`;
      } else {
        returnedStr = `${returnedStr}${char}`;
      }
      prevMatchIndex = i;
      prevMatchType = "other";
    } else {
      returnedStr = `${returnedStr}${char}`;
    }
  }

  return returnedStr.toLocaleUpperCase();
};

module.exports = { uppercaseFirstChar, caseToUpperCase };
