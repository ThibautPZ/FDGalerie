import ConfirmationPopUp from "./ConfirmationPopUp";
import ErrorPopUp from "./ErrorPopUp";
import InfoPopUp from "./InfoPopUp";
import WarningPopUp from "./WarningPopUp";

function PopUp({ isOpen, onClose, content }) {
  const { responseDataObj, translationPrefix } = content;

  if (responseDataObj.type === "confirmation") {
    return (
      <ConfirmationPopUp
        isOpen={isOpen}
        onClose={onClose}
        responseDataObj={responseDataObj}
        translationPrefix={translationPrefix}
      />
    );
  }
  if (responseDataObj.type === "error") {
    return (
      <ErrorPopUp
        isOpen={isOpen}
        onClose={onClose}
        responseDataObj={responseDataObj}
      />
    );
  }

  if (responseDataObj.type === "warn") {
    return (
      <WarningPopUp
        isOpen={isOpen}
        onClose={onClose}
        responseDataObj={responseDataObj}
        translationPrefix={translationPrefix}
      />
    );
  }

  return (
    <InfoPopUp
      isOpen={isOpen}
      onClose={onClose}
      responseDataObj={responseDataObj}
      translationPrefix={translationPrefix}
    />
  );
}

export default PopUp;
