import Modal from "./Modal";

function ProfilePagePopUp({ isOpen, onClose, content }) {
  return (
    <Modal
      isOpen={isOpen}
      hasCloseBtn={content?.hasCloseBtn}
      validationBtnEvent={content.button?.onValidation}
      closeBtnText={content?.closeBtnText}
      onClose={onClose}
    >
      <div>
        <p>{content.title}</p>
        <p>{content.message}</p>
        {content.button.text && (
          <button
            type="button"
            onClick={() => onClose(content.button.onValidation)}
          >
            {content.button.text}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default ProfilePagePopUp;
