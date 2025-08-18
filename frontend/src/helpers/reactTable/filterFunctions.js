import {
  isArrayNotEmpty,
  isNumber,
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

export { filterArrByArr, filterValueByArr, filterByImagePresence };
