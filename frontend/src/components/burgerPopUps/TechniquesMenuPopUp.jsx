import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import "../../scss/TechniquesMenuPopUp.scss";

function TechniquesMenuPopUp({ popUpOpen, setPopUpOpen, techniques }) {
  const navigate = useNavigate();

  const handleTechniqueSelected = (tech) => {
    setPopUpOpen({ burger: false, subMenu: null });
    navigate(tech);
  };

  return popUpOpen.subMenu === "Techniques" ? (
    <div className="TechniquesMenuPopUp">
      {techniques.length > 0 && (
        <div>
          {techniques.map(({ technique }) => {
            return (
              <div key={technique}>
                <button
                  type="button"
                  value={`/oeuvres/technique/${technique}`}
                  onClick={(e) => handleTechniqueSelected(e.target.value)}
                >
                  {technique}
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

export default TechniquesMenuPopUp;

TechniquesMenuPopUp.propTypes = {
  popUpOpen: PropTypes.shape({
    burger: PropTypes.bool,
    subMenu: PropTypes.string,
  }).isRequired,
  setPopUpOpen: PropTypes.func.isRequired,
  techniques: PropTypes.arrayOf(
    PropTypes.shape({ technique: PropTypes.string.isRequired })
  ).isRequired,
};
