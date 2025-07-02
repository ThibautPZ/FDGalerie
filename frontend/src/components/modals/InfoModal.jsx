import { useRef, useEffect, useState } from "react";

function InfoModal({ isOpen, content, onConfirm, onClose }) {
  const [modalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef(null);

  const handleCloseModal = () => {
    onClose();
    setModalOpen(false);
  };

  const handleConfirmModal = () => {
    if (onConfirm) {
      onConfirm();
    }
    setModalOpen(false);
  };

  /**
   * Allows the user to close modal by pressing escape key.
   */
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      if (modalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [modalOpen]);

  return (
    <dialog ref={modalRef} onKeyDown={handleKeyDown} role="presentation">
      <div>
        <h3>{content.head}</h3>
        <p>{content.body}</p>
        <div>
          {content.confirmBtnText ? (
            <button type="button" onClick={handleConfirmModal}>
              {content.confirmBtnText}
            </button>
          ) : (
            ""
          )}
          {content.closeBtnText ? (
            <button type="button" onClick={handleCloseModal}>
              {content.closeBtnText || "Fermer"}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </dialog>
  );
}

export default InfoModal;
