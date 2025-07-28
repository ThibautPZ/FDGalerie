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
      const matchType = prevMatchType;
      const matchIndex = prevMatchIndex;
      prevMatchType = "punctuation";
      prevMatchIndex = i;
      if (
        i !== 0 &&
        (matchIndex !== i - 1 ||
          (matchType !== "punctuation" && matchIndex === i - 1))
      ) {
        returnedStr = `${returnedStr}_`;
      }
    } else if (digitRegExp.test(char)) {
      const matchType = prevMatchType;
      const matchIndex = prevMatchIndex;
      prevMatchIndex = i;
      prevMatchType = "number";

      if (
        i !== 0 &&
        (matchIndex !== i - 1 ||
          (matchType !== "number" && matchIndex === i - 1))
      ) {
        returnedStr = `${returnedStr}_${char}`;
      } else {
        returnedStr = `${returnedStr}${char}`;
      }
    } else if (characterNotLowerCharRegExp.test(char)) {
      const matchType = prevMatchType;
      const matchIndex = prevMatchIndex;
      prevMatchIndex = i;
      prevMatchType = "other";
      if (
        i !== 0 &&
        (matchIndex !== i - 1 ||
          (matchType !== "other" && matchIndex === i - 1))
      ) {
        returnedStr = `${returnedStr}_${char}`;
      } else {
        returnedStr = `${returnedStr}${char}`;
      }
    } else {
      returnedStr = `${returnedStr}${char}`;
    }
  }

  return returnedStr.toLocaleUpperCase();
};

module.exports = { uppercaseFirstChar, caseToUpperCase };
