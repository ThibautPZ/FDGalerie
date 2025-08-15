import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Modal from "./Modal";
import { isArrayNotEmpty } from "../../services/typesAndValidationChecks";

function ConfirmationPopUp({
  isOpen,
  onClose,
  responseDataObj,
  translationPrefix,
}) {
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);
  const tWithPrefix = (keyStr) => {
    return t(`${translationPrefix}${responseDataObj.message}.${keyStr}`);
  };

  const commonT = (keyStr, number) => {
    return t(`common:info.${keyStr}`, number && { number });
  };

  if (responseDataObj.confirmationData.case === "matchingPeople") {
    return (
      <Modal
        isOpen={isOpen}
        hasCloseBtn={tWithPrefix("hasCloseBtn")}
        validationBtnEvent={tWithPrefix("validationBtnReturnedStr")}
        closeBtnText={tWithPrefix("closeBtnText")}
        onClose={onClose}
      >
        <div>
          <p>{tWithPrefix("title")}</p>
          <p>{tWithPrefix("message")}</p>
          <ul>
            <li>{commonT("firstname")}</li>
            <li>{commonT("lastname")}</li>
            <li>{commonT("email")}</li>
            <li>{commonT("address")}</li>
            <li>{commonT("postalCode")}</li>
            <li>{commonT("city")}</li>
            <li>{commonT("phoneNumber", 1)}</li>
            <li>{commonT("phoneNumber", 2)}</li>
            <li>{commonT("userTypesId")}</li>
            <li>{commonT("accountDate")}</li>
          </ul>
          {isArrayNotEmpty(responseDataObj.confirmationData.matchingPeople) &&
            responseDataObj.confirmationData.matchingPeople.map(
              (personInfos) => (
                <ul>
                  <li>{personInfos.firstname || "/"}</li>
                  <li>{personInfos.lastname || "/"}</li>
                  <li>{personInfos.email || "/"}</li>
                  <li>{personInfos.address || "/"}</li>
                  <li>{personInfos.postalCode || "/"}</li>
                  <li>{personInfos.city || "/"}</li>
                  <li>{personInfos.phoneNumber1 || "/"}</li>
                  <li>{personInfos.phoneNumber2 || "/"}</li>
                  <li>
                    {Object.hasOwn(personInfos, "contactId") &&
                      commonT("contact")}
                    {Object.hasOwn(personInfos, "userId") &&
                      t("common:userTypes.1")}
                  </li>
                  <li>{personInfos.accountDate}</li>
                </ul>
              )
            )}
          {tWithPrefix("validationBtnText") && (
            <button
              type="button"
              onClick={() =>
                onClose(
                  tWithPrefix("validationBtnReturnedStr"),
                  responseDataObj.confirmationData.originalReq
                )
              }
            >
              {tWithPrefix("validationBtnText")}
            </button>
          )}
        </div>
      </Modal>
    );
  }

  if (responseDataObj.confirmationData.case === "confirmOperation") {
    return (
      <Modal
        isOpen={isOpen}
        hasCloseBtn={tWithPrefix("hasCloseBtn")}
        validationBtnEvent={tWithPrefix("validationBtnReturnedStr")}
        closeBtnText={tWithPrefix("closeBtnText")}
        onClose={onClose}
      >
        <div>
          <p>{tWithPrefix("title")}</p>
          <p>{tWithPrefix("message")}</p>
          {tWithPrefix("validationBtnText") && (
            <button
              type="button"
              onClick={() =>
                onClose(
                  tWithPrefix("validationBtnReturnedStr"),
                  responseDataObj.confirmationData.operationData
                )
              }
            >
              {tWithPrefix("validationBtnText")}
            </button>
          )}
        </div>
      </Modal>
    );
  }

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     hasCloseBtn={content?.hasCloseBtn}
  //     validationBtnEvent={content.button?.onValidation}
  //     closeBtnText={content?.closeBtnText}
  //     onClose={onClose}
  //   >
  //     <div>
  //       <p>{content.title}</p>
  //       <p>{content.message}</p>
  //       {content.button.text && (
  //         <button
  //           type="button"
  //           onClick={() => onClose(content.button.onValidation, data)}
  //         >
  //           {content.button.text}
  //         </button>
  //       )}
  //     </div>
  //   </Modal>
  // );
}

export default ConfirmationPopUp;

ConfirmationPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    closeBtnText: PropTypes.string,
    button: PropTypes.shape({
      onValidation: PropTypes.string,
      text: PropTypes.string,
      value: PropTypes.number,
    }),
    hasCloseBtn: PropTypes.bool,
  }).isRequired,
};
