import giveDateFromYMD from "../dateTimeMethods/giveDateFromYMD";
import { isArrayNotEmpty, isObjectNotEmpty } from "../typesAndValidationChecks";

/**
 * The numberFormatter function takes in formatParams and returns a formatter function that formats
 * numbers based on the provided parameters.
 * @param {object} formatParams
 * @param {String} formatParams.style
 * @param {String} formatParams.unit
 * @param {Number} [formatParams.minimumFractionDigits]

 */
const numberFormatter = (formatParams) => {
  const values = {};
  const params = {};
  /**
   * @param {...number } number
   * @returns {{ formatParams: object, values: object}}
   */
  const formatter = (...number) => {
    for (let i = 0; i < number.length; i += 1) {
      const keyName = `val${i > 0 ? i + 1 : ""}`;
      Object.assign(values, { [keyName]: number[i] });
      if (isObjectNotEmpty(formatParams)) {
        Object.assign(params, { [keyName]: formatParams });
      }
      if (isArrayNotEmpty(formatParams)) {
        Object.assign(params, { [keyName]: formatParams[i] });
      }
    }
    return { ...values, formatParams: params };
  };
  return formatter;
};

/**
 * The `currencyFormatter` function allows for formatting currency values with specified
 * parameters.
 * @param {Object} [formatParams] - The `formatParams` parameter in the `currencyFormatter` function is an
 * object with two properties: `currency` and `locale`. The default values for these properties are set
 * to `"EUR"` for currency and `"fr-FR"` for locale.
 * @param {String} formatParams.currency
 * @param {String} formatParams.locale
 */
const currencyFormatter = (
  formatParams = { currency: "EUR", locale: "fr-FR" }
) => {
  const values = {};
  const params = {};
  /**
   * @param {...number } price
   * @returns {{ formatParams: object, values: object}}
   */
  const formatter = (...price) => {
    for (let i = 0; i < price.length; i += 1) {
      const keyName = `val${i > 0 ? i + 1 : ""}`;
      Object.assign(values, { [keyName]: price[i] });
      if (isObjectNotEmpty(formatParams)) {
        Object.assign(params, { [keyName]: formatParams });
      }
      if (isArrayNotEmpty(formatParams)) {
        Object.assign(params, { [keyName]: formatParams[i] });
      }
    }
    return { ...values, formatParams: params };
  };
  return formatter;
};

/**
 * The `dateFormatter` function formats a date based on the specified format and parameters.
 * @param {String} dateFormat - The `dateFormat` parameter specifies the format in which the date is supplied.
 *  For example, "YYYY-MM-DD" indicates that the date formatted is year-month-day format.
 * @param {{year: string, month:string, day:string, weekday: string}} formatParams - The `formatParams` parameter is expected to be an object
 * containing formatting parameters for the date. These parameters can be used to customize the
 * formatting of the date according to the specified format.
 * ie: month:"numeric"
 */
const dateFormatter = (dateFormat, formatParams) => {
  /**
   * @param {Date | string} date
   * @returns {{val: Date, formatParams: object}}
   */
  const formatter = (date) => {
    let formatedDate = date;
    if (dateFormat === "YYYY-MM-DD") {
      formatedDate = giveDateFromYMD(date);
    }
    const returnedObj = { val: formatedDate };
    if (isObjectNotEmpty(formatParams)) {
      const params = { formatParams: { val: formatParams } };
      Object.assign(returnedObj, params);
    }
    return returnedObj;
  };
  return formatter;
};

/**
 * The function `relativeTimeFormatter` takes in format parameters and returns a formatter function
 * that includes the parameters and the time value.
 * @param {object} formatParams
 * @param {String} formatParams.range
 * @param {String} formatParams.style
 * @param {String} formatParams.other
 */
const relativeTimeFormatter = (formatParams) => {
  const { range, style, other } = formatParams;
  /**
   * @param {string} time
   * @returns {{val: string, formatParams: object, other:string}}
   */
  const formatter = (time) => {
    const returnedObj = {};
    const value = { val: time };
    Object.assign(returnedObj, value);

    if (isObjectNotEmpty(formatParams)) {
      const params = { formatParams: { val: { range, style } }, other };
      Object.assign(returnedObj, params);
    }
    return returnedObj;
  };
  return formatter;
};

export {
  numberFormatter,
  currencyFormatter,
  dateFormatter,
  relativeTimeFormatter,
};
