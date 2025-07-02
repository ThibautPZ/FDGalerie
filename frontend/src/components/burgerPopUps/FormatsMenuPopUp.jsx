import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import "../../scss/FormatsMenuPopUp.scss";

function FormatsMenuPopUp({ popUpOpen, setPopUpOpen, formats }) {
  const navigate = useNavigate();

  const handleFormatselected = (taille) => {
    setPopUpOpen({ burger: false, subMenu: null });
    navigate(taille);
  };

  return popUpOpen.subMenu === "Formats" ? (
    <div className="FormatsMenuPopUp">
      {formats.length > 0 && (
        <div>
          {formats.map(({ format }) => {
            return (
              <div key={format}>
                <button
                  type="button"
                  value={`/oeuvres/format/${format}`}
                  onClick={(e) => handleFormatselected(e.target.value)}
                >
                  {format}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  ) : (
    ""
  );
}

export default FormatsMenuPopUp;

FormatsMenuPopUp.propTypes = {
  popUpOpen: PropTypes.shape({
    burger: PropTypes.bool,
    subMenu: PropTypes.string,
  }).isRequired,
  setPopUpOpen: PropTypes.func.isRequired,
  formats: PropTypes.arrayOf(
    PropTypes.shape({ format: PropTypes.string.isRequired })
  ).isRequired,
};
