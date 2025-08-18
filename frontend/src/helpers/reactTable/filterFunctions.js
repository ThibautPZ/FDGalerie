import { isArrayNotEmpty } from "../../services/typesAndValidationChecks";

const filterArrByArr = (row, columnId, filterValue) => {
  if (!isArrayNotEmpty(filterValue)) {
    return true;
  }
  return row.original[columnId].some((value) => filterValue.includes(value));
};

export default filterArrByArr;
