import { useTranslation } from "react-i18next";
import { isObjectNotEmpty } from "../../services/typesAndValidationChecks";

function AdditionalSelectLabelInfo({ label, value }) {
  const { t } = useTranslation(["common", "pageText"]);

  if (!isObjectNotEmpty(label) || !isObjectNotEmpty(value)) {
    return null;
  }
  const { infoOfInterestType, infosOfInterest, displayedInfo } =
    label.additionalLabelData;

  const giveContent = (namespaceStr, searchedValue) => {
    if (displayedInfo === "namespace") {
      return t(namespaceStr);
    }
    if (displayedInfo === "value") {
      return searchedValue;
    }
    return null;
  };

  const giveTextIfKeyHasValue = () => {
    let returnedStr = "";
    infosOfInterest.forEach((info) => {
      if (value[info.searchedValue]) {
        returnedStr = giveContent(info.namespace, value[info.searchedValue]);
      }
    });
    return returnedStr;
  };

  const giveAdditionalInfos = () => {
    let returnedStr = "";
    if (!isObjectNotEmpty(label)) {
      return returnedStr;
    }
    if (infoOfInterestType === "keyHasValue") {
      returnedStr = giveTextIfKeyHasValue();
    }
    return returnedStr;
  };

  const displayedText = giveAdditionalInfos();

  return <span>{displayedText}</span>;
}

export default AdditionalSelectLabelInfo;
