import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import ZoomedPainting from "../components/ZoomedPainting";

import "../scss/Oeuvre.scss";

function Oeuvre() {
  const { titreOeuvre } = useParams();

  const [oeuvreDetails, setOeuvreDetails] = useState([]);
  const [openZoomPainting, setOpenZoomPainting] = useState(false);

  const fetchOeuvresByTitle = async () => {
    try {
      const paintingDetails = await axiosInstance.get(
        `/api/paintings/${titreOeuvre}`
      );

      setOeuvreDetails(...paintingDetails.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOeuvresByTitle();
  }, [titreOeuvre]);

  const getTechniquesLength = () => {
    return oeuvreDetails.techniques?.length;
  };

  const handlePaintingClick = () => {
    setOpenZoomPainting(true);
  };

  const handleCloseModal = () => {
    setOpenZoomPainting(false);
  };

  return (
    <div className="Oeuvre">
      {oeuvreDetails.pathname ? (
        <button type="button" onClick={handlePaintingClick}>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${
              import.meta.env.VITE_PAINTINGS_PATH
            }/${oeuvreDetails.pathname}`}
            alt={oeuvreDetails.title}
          />
        </button>
      ) : (
        <p>Chargement...</p>
      )}
      <h2>{oeuvreDetails.title}</h2>
      <p>
        {`Technique${getTechniquesLength() > 1 ? "s" : ""} : `}
        {oeuvreDetails.techniques?.map(({ technique }, index) => {
          return (
            <span key={technique}>
              {technique}
              {index !== getTechniquesLength() - 1 ? ", " : " "}
            </span>
          );
        })}
        {oeuvreDetails.support && `sur ${oeuvreDetails.support}`}
      </p>
      <p>{`Format ${oeuvreDetails.format} : largeur ${oeuvreDetails.width} cm, hauteur ${oeuvreDetails.height} cm`}</p>
      {oeuvreDetails.sisters?.length > 0 && (
        <div>
          <p>{`Appartient à la série ${oeuvreDetails.family}, auprès de ces autres oeuvres :`}</p>
          <p>
            {oeuvreDetails.sisters?.map(({ sister }) => (
              <Link to={`/oeuvre/${sister}`} key={sister}>
                <span>{sister}, </span>
              </Link>
            ))}
            (Cliquez sur les noms pour y accéder)
          </p>
        </div>
      )}

      {oeuvreDetails.comment ? (
        <div>
          <p>Note de l'artiste : </p>
          <p>{oeuvreDetails.comment}</p>
        </div>
      ) : (
        ""
      )}
      {oeuvreDetails.sold === 1 && <p>Indisponible à l'acquisition</p>}

      <ZoomedPainting
        isOpen={openZoomPainting}
        onClose={handleCloseModal}
        title={oeuvreDetails.title}
        pathname={oeuvreDetails.pathname}
      />
    </div>
  );
}

export default Oeuvre;
