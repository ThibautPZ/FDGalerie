const fieldDefaultValues = {
  text: "",
  radio: "",
  select: null,
  multiSelect: [],
  checkbox: false,
  date: null,
  file: [],
};

const giveFieldRegisterOptions = (fieldObj, registerOptionsObj) => {
  if (fieldObj.registerOptionsKey) {
    return registerOptionsObj[fieldObj.registerOptionsKey];
  }
  return registerOptionsObj[fieldObj.name];
};

const giveEmptyValue = (fieldType, isMultiSelect) => {
  if (fieldType === "select" && isMultiSelect) {
    return fieldDefaultValues.multiSelect;
  }
  return fieldDefaultValues[fieldType];
};

export { giveFieldRegisterOptions, giveEmptyValue };
