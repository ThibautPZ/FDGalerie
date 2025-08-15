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

const isoDateRegExp =
  /^(?:[0-9]{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])T(?:[01][0-9]|2[0-3]):(?:[0-5][0-9]):(?:[0-5][0-9])\.\d{3}Z$/;

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
  isoDateRegExp,
};
