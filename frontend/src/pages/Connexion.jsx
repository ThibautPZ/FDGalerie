import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "../scss/Connexion.scss";

import ProfilePagePopUp from "../components/modals/ProfilePagePopUp";
import popUpContents from "../json/ProfilePagePopUpMessages.json";
import Identification from "../pageComponents/connexion/Identification";
import Inscription from "../pageComponents/connexion/Inscription";

function Connexion() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const [loginSelected, setLoginSelected] = useState(page);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  // const { isBackgroundBlurred } = useBlurredBackgroundContext();
  const navigate = useNavigate();
  useEffect(() => {
    setLoginSelected(page);
  }, [page]);

  const changeSelected = () => {
    setLoginSelected(!loginSelected);
  };

  const handleCloseModal = (status) => {
    setModalOpen(false);
    // setIsBackgroundBlurred(false);
    if (status === "navigateHome") {
      navigate("/");
    }

    setModalContent({});
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleModalInstall = (content) => {
    setModalContent(content);
    handleOpenModal();
  };

  return (
    <div className="Connexion">
      <div className="ConnexionSwitch">
        <button
          type="button"
          onClick={changeSelected}
          disabled={!loginSelected}
        >
          Se connecter
        </button>

        <button type="button" onClick={changeSelected} disabled={loginSelected}>
          S' inscrire.
        </button>
      </div>

      <div>
        {loginSelected ? (
          <Inscription
            handleModalInstall={handleModalInstall}
            popUpContents={popUpContents}
          />
        ) : (
          <Identification
            handleModalInstall={handleModalInstall}
            popUpContents={popUpContents}
          />
        )}
      </div>
      {modalOpen ? (
        <ProfilePagePopUp
          isOpen={modalOpen}
          content={modalContent}
          onClose={handleCloseModal}
        />
      ) : null}
    </div>
  );
}

export default Connexion;
