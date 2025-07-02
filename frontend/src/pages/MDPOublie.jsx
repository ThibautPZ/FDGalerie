import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useCurrentUserContext } from "../contexts/CurrentUserContext";
import axiosInstance from "../services/axiosInstance";
import ProfilePagePopUp from "../components/modals/ProfilePagePopUp";
import popUpContents from "../json/MDPOubliePagePopUpMessages.json";

function MDPOublie() {
  const { user } = useCurrentUserContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  // const { isBackgroundBlurred } = useBlurredBackgroundContext();
  const navigate = useNavigate();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: null });

  const handleLoginRegistration = async (signupFormData) => {
    try {
      const res = await axiosInstance.post(
        `/api/auth/forgottenPassword`,
        signupFormData
      );
      if (res) {
        handleModalInstall(popUpContents.procedureSuccess);
      }
    } catch (err) {
      console.error(err);

      handleModalInstall({
        ...popUpContents.procedureFail,
        message:
          err.response.data.message || popUpContents.procedureFail.message,
      });
    }
  };

  const registerOptions = {
    email: {
      required: "Une adresse email doit être renseignée.",
      pattern: {
        value: /^[a-z0-9.-_]+@[a-z]+\.[a-z]{2,4}$/gi,
        message:
          "L' email indiqué n' a pas le bon format. Il doit être semblable à ceci : \"micheldupont@exemple.com.\"",
      },
    },
  };

  const emailRegister = register("email", registerOptions.email);

  return (
    <div className="">
      <p>
        Vous avez oublié le mot de passe de votre compte ? Renseignez l'adresse
        email liée à votre compte, nous y enverrons un lien permettant
        d'enregistrer un nouveau mot de passe.
      </p>
      <form onSubmit={handleSubmit(handleLoginRegistration)}>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="text"
            defaultValue={user && user.email}
            placeholder={
              user
                ? user.email || "Votre adresse email..."
                : "Votre adresse email..."
            }
            onChange={emailRegister.onChange}
            name={emailRegister.name}
            ref={emailRegister.ref}
            aria-invalid={errors.email ? "true" : "false"}
          />
        </div>

        <input type="submit" value="Réinitialiser mon mot de passe." />
      </form>
      <div role="alert">{errors.email && <p> {errors.email.message}</p>}</div>
      {modalOpen ? (
        <ProfilePagePopUp
          isOpen={modalOpen}
          content={modalContent}
          onClose={handleCloseModal}
        />
      ) : null}
    </div>
    // Todo : user profile image upload
  );
}

export default MDPOublie;
