import { useTranslation } from "react-i18next";
import {
  isArrayNotEmpty,
  isNumber,
  isObjectNotEmpty,
  isStringNotEmpty,
} from "./typesAndValidationChecks";

export default function tranlationInstance(...nameSpaceAndKey) {
  const { t, i18n } = useTranslation();
  if (!isArrayNotEmpty(nameSpaceAndKey)) {
    return i18n;
  }

  const givePrefixedT = (nameSpace, key) => {
    let prefix = "";
    if (nameSpace) {
      prefix = `${nameSpace}:`;
    }
    if (key) {
      prefix = `${prefix}${key}.`;
    }
    const tWithPrefix = (tKey, variables) => {
      if (!isStringNotEmpty(tKey) && !isNumber(tKey)) {
        return t(`${prefix}`);
      }

      return t(`${prefix}${tKey}`, isObjectNotEmpty(variables) && variables);
    };
    return tWithPrefix;
  };

  const arr = nameSpaceAndKey.map((el) => {
    if (el === "i18n") {
      return i18n;
    }
    const [ns, key] = el.split(":", 2);

    return givePrefixedT(ns, key);
  });

  return arr.length > 1 ? arr : arr[0];
}
