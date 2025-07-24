const civilNameRegExp =
  /^[\p{L}'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/u;

const priceEurRegExp = /(\d*(?:[.,]\d{0,2})|\d+)/g;
// /\d*(?:[.,]\d{1,2})?/g;
//   /(\d{1,}(?:[.,]*\d{3})*(?:[.,]*\d*))|(\d{1,3}(?:[.,]*\d*)*(?:[.,]*\d*)?)/g;

const integerRegExp = /([+-]?\d*)/g;

const positiveIntegerRegExp = /([+]?\d+)/g;

const floatPrec2RegExp = /([+-]?\d*(?:[.,]\d{0,2}))|([+-]?\d+)/g;

const floatPrec3RegExp = /([+-]?\d*(?:[.,]\d{0,3}))|([+-]?\d+)/g;

const exponentialRegExp = /[+-]?(\d*\.)?\d+([eE][-+]?\d+)?/;

export {
  civilNameRegExp,
  priceEurRegExp,
  integerRegExp,
  positiveIntegerRegExp,
  floatPrec2RegExp,
  floatPrec3RegExp,
  exponentialRegExp,
};
