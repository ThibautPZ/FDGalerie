import {
  isArrayNotEmpty,
  isObjectNotEmpty,
  isString,
  isStringNotEmpty,
} from "./typesAndValidationChecks";

const giveTransformationObject = (fieldTransformationsObj) => {
  if (!isObjectNotEmpty(fieldTransformationsObj)) {
    return null;
  }
  const returnedObj = {};

  const assignFieldToReturnedObj = (transformation, fieldName) => {
    if (!isStringNotEmpty(fieldName)) {
      return null;
    }
    return Object.assign(returnedObj, { [fieldName]: transformation });
  };

  for (const [key, value] of Object.entries(fieldTransformationsObj)) {
    if (isStringNotEmpty(value)) {
      assignFieldToReturnedObj(key, value);
    }
    if (isArrayNotEmpty(value)) {
      value.forEach((fieldName) => assignFieldToReturnedObj(key, fieldName));
    }
  }

  return returnedObj;
};

/**
 * Returns an array containing all inputed object values whose key match inputed array string elements
 * @param {Object< string, (number|string|Object|Array) >} initialData - Submited form fields data
 * @param {Object.< string, function >} [fieldTransformations] - Object containing callback functions to be called on fields whose name match object key
 * @param {Array.<string>}  [filteredKeys] - Array listing fieldnames to exclude from form data
 * @returns {{formData: Object, fileFields: string, files: Object}}  Object containing two arrays
 * @function
 */
function giveSanitizedFormData(
  initialData,
  fieldTransformations,
  filteredKeys
) {
  if (!isObjectNotEmpty(initialData)) {
    return null;
  }
  const fileTracker = [];

  const initialDataArray = Object.entries(initialData);

  const transformations = giveTransformationObject(fieldTransformations);

  const updateFileTracker = (fileListContent, fieldName) => {
    const fileTrackerObj = { type: fileListContent, name: fieldName };
    return fileTracker.push(fileTrackerObj);
  };

  const isKeyFiltered = (keyStr) => {
    if (!isArrayNotEmpty(filteredKeys)) {
      return false;
    }
    for (let i = 0; i < filteredKeys.length; i += 1) {
      if (filteredKeys[i] === keyStr) {
        return true;
      }
    }
    return false;
  };

  const isObjectWithValueAndLabelKeys = (supposedObj) => {
    if (!isObjectNotEmpty(supposedObj)) {
      return false;
    }

    const keysArr = Object.keys(supposedObj);
    if (
      keysArr.length === 2 &&
      "label" in supposedObj &&
      "value" in supposedObj
    ) {
      return true;
    }
    return false;
  };

  const giveSanitizedData = (initialValue, key) => {
    const giveTransformedValue = (value) => {
      if (!isObjectNotEmpty(transformations)) {
        return value;
      }
      if (transformations[key] === "toInteger") {
        return parseInt(value, 10);
      }
      if (transformations[key] === "toFloat") {
        return parseFloat(value);
      }
      return value;
    };

    const giveKeyValueWithInfo = (value, isFileField = false) => {
      const transformedValue = giveTransformedValue(value);

      const returnedObj = {
        sanitizedValue: { [key]: transformedValue },
        isFileField,
      };
      return returnedObj;
    };

    const giveValuesOfArray = (arr) => {
      const returnedArr = arr.map((item) => item.value);
      return returnedArr;
    };

    const updateFileTrackerThenGiveFile = (fileValue) => {
      if (fileValue.length > 1) {
        updateFileTracker("array", key);
        return fileValue;
      }
      if (initialValue.length === 1) {
        updateFileTracker("single", key);
        return fileValue[0];
      }
      return null;
    };

    if (isObjectWithValueAndLabelKeys(initialValue)) {
      return giveKeyValueWithInfo(initialValue.value);
    }

    if (
      isArrayNotEmpty(initialValue) &&
      isObjectWithValueAndLabelKeys(initialValue[0])
    ) {
      const values = giveValuesOfArray(initialValue);
      return giveKeyValueWithInfo(values);
    }

    if (initialValue instanceof FileList) {
      const fileValue = updateFileTrackerThenGiveFile(initialValue);

      return giveKeyValueWithInfo(fileValue, true);
    }

    if (isString(initialValue)) {
      const value = initialValue.trim();
      return giveKeyValueWithInfo(value);
    }

    return giveKeyValueWithInfo(initialValue);
  };

  const populateReturnedData = () => {
    const notFileFieldsObj = {};
    const fileFieldsObj = {};

    for (const [key, value] of initialDataArray) {
      if (!isKeyFiltered(key)) {
        const { sanitizedValue, isFileField } = giveSanitizedData(value, key);

        if (isFileField) {
          Object.assign(fileFieldsObj, sanitizedValue);
        } else {
          Object.assign(notFileFieldsObj, sanitizedValue);
        }
      }
    }

    return { ...notFileFieldsObj, ...fileFieldsObj };
  };

  const giveFileUploadStrategy = () => {
    if (!fileTracker.length) {
      return { fileFields: "none", files: { name: null } };
    }
    if (fileTracker.length === 1) {
      return {
        fileFields: fileTracker[0].type,
        files: { name: fileTracker[0].name },
      };
    }
    const filesArray = fileTracker.map((file) => {
      return { name: file.name, maxCount: file.type === "single" ? 1 : null };
    });
    return { fileFields: "fields", files: { fields: filesArray } };
  };

  const returnedFormData = populateReturnedData();
  const { fileFields, files } = giveFileUploadStrategy();
  return { formData: returnedFormData, fileFields, files };
}
export default giveSanitizedFormData;
