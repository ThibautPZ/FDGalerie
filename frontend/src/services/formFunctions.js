const giveFieldRegisterOptions = (fieldObj, registerOptionsObj) => {
  if (fieldObj.registerOptionsKey) {
    return registerOptionsObj[fieldObj.registerOptionsKey];
  }
  return registerOptionsObj[fieldObj.name];
};
export { giveFieldRegisterOptions };
