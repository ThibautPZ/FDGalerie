import PropTypes from "prop-types";
import Modal from "./Modal";

export default function UserProfilePopUp({ isOpen, onClose, message }) {
  return (
    <Modal
      isOpen={isOpen}
      hasCloseBtn={message.hasCloseBtn}
      validationBtnEvent={message.button.onValidation}
      onClose={onClose}
    >
      <p>{message.content}</p>
      <p>{message.content}</p>
      {message.button && (
        <button
          type="button"
          onClick={() => onClose(message.button.onValidation)}
        >
          {message.button.text}
        </button>
      )}
    </Modal>
  );
}

UserProfilePopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    button: PropTypes.shape({
      onValidation: PropTypes.string,
      text: PropTypes.string,
      value: PropTypes.number,
    }),
    hasCloseBtn: PropTypes.bool,
  }).isRequired,
};
