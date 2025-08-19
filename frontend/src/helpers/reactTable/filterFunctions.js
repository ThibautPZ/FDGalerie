import {
  isArrayNotEmpty,
  isNumber,
  isDate,
} from "../../services/typesAndValidationChecks";

const filterArrByArr = (row, columnId, filterValue) => {
  if (!isArrayNotEmpty(filterValue)) {
    return true;
  }
  return row.original[columnId].some((value) => filterValue.includes(value));
};

const filterValueByArr = (row, columnId, filterValue) => {
  if (!isArrayNotEmpty(filterValue)) {
    return true;
  }
  return filterValue.includes(row.original[columnId]);
};

const filterByImagePresence = (row, columnId, filterValue) => {
  if (!isNumber(filterValue)) {
    return true;
  }
  const { fileName, fileExtension } = row.original;

  const imagePresence = !!(fileName && fileExtension);
  return !!filterValue === imagePresence;
};

const filterByNumberRange = (row, columnId, filterValue) => {
  if (!isArrayNotEmpty(filterValue) || (!filterValue[0] && !filterValue[1])) {
    return true;
  }
  const evaluatedValue = Number(row.original[columnId]);

  if (!isNumber(evaluatedValue)) {
    return false;
  }
  const [min, max] = filterValue.map((value) => Number(value));

  if (!isNumber(min) || !isNumber(max)) {
    return true;
  }
  return evaluatedValue >= min && evaluatedValue <= max;
};

const filterByDateRange = (row, columnId, filterValue) => {
  if (!isArrayNotEmpty(filterValue) || (!filterValue[0] && !filterValue[1])) {
    return true;
  }
  const evaluatedValue = new Date(row.original[columnId]);

  if (!isDate(evaluatedValue)) {
    return false;
  }
  const [min, max] = filterValue;

  if (!isDate(min) || !isDate(max)) {
    return true;
  }
  return evaluatedValue >= min && evaluatedValue <= max;
};

export {
  filterArrByArr,
  filterValueByArr,
  filterByImagePresence,
  filterByNumberRange,
  filterByDateRange,
};
