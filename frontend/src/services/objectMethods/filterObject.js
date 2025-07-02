import { isObjectNotEmpty } from "../typesAndValidationChecks";

export default function filterObject(filteredObj, testingCb, options = []) {
  const { filteredOutWhenTestTrue = false } = options;

  const selectedEntries = {};
  const filteredEntries = {};
  if (!isObjectNotEmpty(filteredObj)) {
    return [selectedEntries, filteredEntries];
  }

  for (const [key, value] of Object.entries(filteredObj)) {
    if (testingCb(key, value) === filteredOutWhenTestTrue) {
      Object.assign(filteredEntries, { [key]: value });
    } else {
      Object.assign(selectedEntries, { [key]: value });
    }
  }
  return [selectedEntries, filteredEntries];
}
