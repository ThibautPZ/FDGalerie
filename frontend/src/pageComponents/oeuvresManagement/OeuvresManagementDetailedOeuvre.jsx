import { useState } from "react";
import { Link } from "react-router-dom";

import "../../scss/Oeuvre.scss";

import ZoomedPainting from "../../components/ZoomedPainting";

function OeuvresManagementDetailedOeuvre({ oeuvre }) {
  const [openZoomPainting, setOpenZoomPainting] = useState(false);

  const getTechniquesLength = () => {
    return oeuvre.techniques?.length;
  };

  const handlePaintingClick = () => {
    setOpenZoomPainting(true);
  };
  const handleCloseModal = () => {
    setOpenZoomPainting(false);
  };

  return (
    <div className="OeuvresManagementDetailedOeuvre">
      {oeuvre.pathname ? (
        <button type="button" onClick={handlePaintingClick}>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${
              import.meta.env.VITE_PAINTINGS_PATH
            }/${oeuvre.pathname}`}
            alt={oeuvre.title}
          />
        </button>
      ) : (
        <p>Chargement...</p>
      )}
      <h2>{oeuvre.title}</h2>
      <p>
        {`Technique${getTechniquesLength() > 1 ? "s" : ""} : `}
        {oeuvre.techniques?.map(({ technique }, index) => {
          return (
            <span key={technique}>
              {technique}
              {index !== getTechniquesLength() - 1 ? ", " : " "}
            </span>
          );
        })}
        {oeuvre.support && `sur ${oeuvre.support}`}
      </p>
      <p>{`Format ${oeuvre.format} : largeur ${oeuvre.width} cm, hauteur ${oeuvre.height} cm`}</p>
      {oeuvre.sisters?.length > 0 && (
        <div>
          <p>{`Appartient à la série ${oeuvre.family}, auprès de ces autres oeuvres :`}</p>
          <p>
            {oeuvre.sisters?.map(({ sister }) => (
              <Link to={`/oeuvre/${sister}`} key={sister}>
                <span>{sister}, </span>
              </Link>
            ))}
            (Cliquez sur les noms pour y accéder)
          </p>
        </div>
      )}

      {oeuvre.comment ? (
        <div>
          <p>Note de l'artiste : </p>
          <p>{oeuvre.comment}</p>
        </div>
      ) : (
        ""
      )}
      {oeuvre.sold === 1 && <p>Indisponible à l'acquisition</p>}
      <ZoomedPainting
        isOpen={openZoomPainting}
        onClose={handleCloseModal}
        title={oeuvre.title}
        pathname={oeuvre.pathname}
      />
    </div>
  );
}

export default OeuvresManagementDetailedOeuvre;
