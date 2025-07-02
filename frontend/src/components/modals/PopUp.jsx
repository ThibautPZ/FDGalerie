import ConfirmationPopUp from "./ConfirmationPopUp";
import InfoPopUp from "./InfoPopUp";

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
