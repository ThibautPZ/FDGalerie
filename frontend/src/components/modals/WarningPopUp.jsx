import Modal from "./Modal";
import tranlationInstance from "../../services/translationInstance";

function WarningPopUp({ isOpen, onClose, responseDataObj = {} }) {
  const { code = "00001", infoData = {} } = responseDataObj;

  const t = tranlationInstance(`popUpContent:warnings.${code}`);

  return (
    <Modal
      isOpen={isOpen}
      hasCloseBtn={t("hasCloseBtn")}
      validationBtnEvent={t("validationBtnReturnedStr")}
      closeBtnText={t("closeBtnText")}
      onClose={onClose}
    >
      <div>
        <p>{t("title")}</p>
        <p>{t("message", infoData)}</p>
        {t("validationBtnText") && (
          <button
            type="button"
            onClick={() => onClose(t("validationBtnReturnedStr"))}
          >
            {t("validationBtnText")}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default WarningPopUp;
