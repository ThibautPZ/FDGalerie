import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Modal from "./Modal";

function InfoPopUp({ isOpen, onClose, responseDataObj, translationPrefix }) {
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);
  const tWithPrefix = (keyStr, insertText1) => {
    return t(`${translationPrefix}${responseDataObj.message}.${keyStr}`, {
      insertText1,
    });
  };

  // const commonT = (keyStr, number) => {
  //   return t(`common:info.${keyStr}`, number && { number });
  // };

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
        <p>
          {tWithPrefix(
            "message",
            responseDataObj.infoData && responseDataObj.infoData.insertText1
          )}
        </p>
        {tWithPrefix("validationBtnText") && (
          <button
            type="button"
            onClick={() => onClose(tWithPrefix("validationBtnReturnedStr"))}
          >
            {tWithPrefix("validationBtnText")}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default InfoPopUp;

InfoPopUp.propTypes = {
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
