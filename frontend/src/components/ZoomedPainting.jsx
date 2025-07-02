import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import "../scss/ZoomedPainting.scss";

function ZoomedPainting({ isOpen, onClose, title, pathname }) {
  const [modalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef(null);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleCloseZoom = () => {
    onClose();
    setModalOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleCloseZoom();
    }
  };

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
  return modalOpen ? (
    <dialog
      className="ZoomedPainting"
      onKeyDown={handleKeyDown}
      ref={modalRef}
      role="presentation"
    >
      <button type="button" onClick={handleCloseZoom}>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${
            import.meta.env.VITE_PAINTINGS_PATH
          }/${pathname}`}
          alt={title}
        />
      </button>
    </dialog>
  ) : (
    ""
  );
}

export default ZoomedPainting;

ZoomedPainting.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  pathname: PropTypes.string,
}.isRequired;

// ZoomedPainting.defaultProps = {
//   title: "",
//   pathname: "",
// };
