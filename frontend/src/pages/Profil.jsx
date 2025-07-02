import { useState } from "react";

import "../scss/Profil.scss";
import { useCurrentUserContext } from "../contexts/CurrentUserContext";
import UserInfo from "../pageComponents/profil/UserInfo";
import formatStringFromDb from "../services/formatStringFromDb";
import UserInfoUpdate from "../pageComponents/profil/UserInfoUpdate";
import ProfilePagePopUp from "../components/modals/ProfilePagePopUp";
import UserPasswordUpdate from "../pageComponents/profil/UserPasswordUpdate";

function Profil() {
  const { user } = useCurrentUserContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [formState, setFormState] = useState("display");

  const handleCloseModal = (status) => {
    setModalOpen(false);
    // setIsBackgroundBlurred(false);
    if (status === "setProfileDisplay") {
      setFormState("display");
    }

    setModalContent({});
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const formatDateToWords = (date) => {
    const numbers = date.split("-");
    const throwawayDate = new Date();
    throwawayDate.setMonth(numbers[1] - 1);
    let day = Number.parseInt(numbers[2], 10);
    if (day === 1) {
      day = "1er";
    }
    return `${day} 
      ${throwawayDate.toLocaleString("fr-FR", { month: "long" })} ${
        numbers[0]
      }`;
  };
  const calculateDuration = (subscribeDate) => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const subscribeYear = subscribeDate.slice(0, 4);
    const subscribeMonth = subscribeDate.slice(5, 7);
    let passedYears = todayYear - subscribeYear;
    let passedMonths = todayMonth - subscribeMonth;
    if (passedMonths < 0) {
      passedYears -= 1;
      passedMonths = 12 + passedMonths;
    }
    return `${passedYears === 1 ? `${passedYears} an ` : ""}${
      passedYears > 1 ? `${passedYears} ans ` : ""
    }${passedYears > 0 && passedMonths > 0 ? "et " : ""}${
      passedMonths > 0 ? `${passedMonths} mois ` : ""
    }`;
  };

  return (
    <div className="Profil">
      <h2>Votre profil</h2>
      <p>
        {calculateDuration(formatStringFromDb(user.accountDate))
          ? `Membre depuis ${calculateDuration(user.accountDate)}(`
          : ""}
        Compte créé le {formatDateToWords(user.accountDate)}.
        {calculateDuration(user.accountDate) ? ")" : ""}
      </p>
      <div>
        <h3>Vos informations</h3>
        {formState === "display" ? (
          <UserInfo setFormState={setFormState} />
        ) : (
          ""
        )}
        {formState === "modification" ? (
          <UserInfoUpdate
            setFormState={setFormState}
            handleOpenModal={handleOpenModal}
            setModalContent={setModalContent}
          />
        ) : (
          ""
        )}
        {formState === "passwordUpdate" ? (
          <UserPasswordUpdate
            setFormState={setFormState}
            handleOpenModal={handleOpenModal}
            setModalContent={setModalContent}
          />
        ) : (
          ""
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

export default Profil;
