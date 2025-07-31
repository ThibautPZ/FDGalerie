const civilNameRegExp =
  /^[\p{L}'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/u;

const priceEurRegExp = /(\d*(?:[.,]\d{0,2})|\d+)/g;

const integerRegExp = /([+-]?\d*)/g;

const positiveIntegerRegExp = /([+]?\d+)/g;

const floatPrec2RegExp = /([+-]?\d*(?:[.,]\d{0,2}))|([+-]?\d+)/g;

const floatPrec3RegExp = /([+-]?\d*(?:[.,]\d{0,3}))|([+-]?\d+)/g;

const exponentialRegExp = /[+-]?(\d*\.)?\d+([eE][-+]?\d+)?/;

const characterNotLowerCharRegExp = /[^a-zß-öø-ÿ]/g;

const punctuationRegExp = /[.,;:!?\-_'"`~\t\n\r ]/g;

const digitRegExp = /\d/g;

const minOneNonSpaceCharRegExp = /.*\S.*/gi;

const emptyOrMinOneNonSpaceCharRegExp = /(^$)|(.*\S.*)/gi;

export {
  civilNameRegExp,
  priceEurRegExp,
  integerRegExp,
  positiveIntegerRegExp,
  floatPrec2RegExp,
  floatPrec3RegExp,
  exponentialRegExp,
  characterNotLowerCharRegExp,
  punctuationRegExp,
  digitRegExp,
  minOneNonSpaceCharRegExp,
  emptyOrMinOneNonSpaceCharRegExp,
};
