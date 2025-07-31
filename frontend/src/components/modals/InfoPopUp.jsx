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
