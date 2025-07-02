import { useRef, useEffect, useState } from "react";

import "../../scss/Modal.scss";

export default function Modal({
  isOpen,
  hasCloseBtn = true,
  validationBtnEvent,
  closeBtnText,
  onClose,
  children,
}) {
  const [modalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef(null);

  /**
   * Function that sets to false the state which controls modal display.
   * If a function onClose has been passed in props, it will be expressed.
   */
  const handleCloseModal = (status, data) => {
    if (onClose) {
      onClose(status, data);
    }
    setModalOpen(false);
  };

  /**
   * Allows the user to close modal by pressing escape key.
   */
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      if (!hasCloseBtn) {
        return handleCloseModal(validationBtnEvent);
      }
      return handleCloseModal();
    }
    return null;
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
    <dialog
      className="Modal"
      ref={modalRef}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div>
        {children}
        {hasCloseBtn && (
          <button type="button" onClick={handleCloseModal}>
            {closeBtnText}
          </button>
        )}
      </div>
    </dialog>
  );
}
