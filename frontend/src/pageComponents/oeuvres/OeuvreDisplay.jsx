import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import "../../scss/OeuvreDisplay.scss";

function OeuvreDisplay({ oeuvre }) {
  return (
    <div className="OeuvreDisplay">
      <Link to={`/oeuvre/${oeuvre.title}`}>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${
            import.meta.env.VITE_PAINTINGS_PATH
          }/${oeuvre.pathname}`}
          alt={oeuvre.title}
        />
      </Link>
    </div>
  );
}

export default OeuvreDisplay;

OeuvreDisplay.propTypes = {
  oeuvre: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
