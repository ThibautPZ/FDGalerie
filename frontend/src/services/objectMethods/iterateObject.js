import { isObjectNotEmpty } from "../typesAndValidationChecks";

export default function iterateObj(object, callback) {
  if (!isObjectNotEmpty) {
    return false;
  }
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = object[key];
    callback(key, value, object);
  }
  return true;
}
