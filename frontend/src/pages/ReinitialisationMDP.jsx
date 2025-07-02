import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "../services/axiosInstance";
import ProfilePagePopUp from "../components/modals/ProfilePagePopUp";
import popUpContents from "../json/ReinitialisationMDPPagePopUpMessages.json";

function ReinitialisationMDP() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("id");
  const token = searchParams.get("token");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

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

  const handleNewPasswordRegistration = async (newPasswordFormData) => {
    const resetPasswordData = {
      password: newPasswordFormData.password,
      userId,
      token,
    };
    const url = "/api/auth/resetPassword";
    try {
      const res = await axiosInstance.post(url, resetPasswordData);
      if (res.data.success) {
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
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: null });

  const registerOptions = {
    password: {
      required: "Un mot de passe doit être renseigné.",
      minLength: {
        value: 8,
        message: "Un mot de passe valide doit contenir au moins 8 caractères.",
      },
      maxLength: {
        value: 64,
        message:
          "Un mot de passe valide doit contenir au maximum 64 caractères.",
      },
    },
    passwordConfirmation: {
      required: "Vous devez réécrire votre mot de passe pour le confirmer.",
      validate: (value) =>
        value === watch("password") || "Les mots de passe ne concordent pas.",
    },
  };

  const passwordRegister = register("password", registerOptions.password);
  const passwordConfirmationRegister = register(
    "passwordConfirmation",
    registerOptions.passwordConfirmation
  );

  return (
    <div className="">
      <p>Veuillez renseigner votre nouveau mot de passe.</p>
      <form onSubmit={handleSubmit(handleNewPasswordRegistration)}>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            placeholder="Choisissez votre nouveau mot de passe..."
            onChange={passwordRegister.onChange}
            name={passwordRegister.name}
            ref={passwordRegister.ref}
            aria-invalid={errors.password ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="passwordConfirmation">
            Confirmation du mot de passe :
          </label>
          <input
            type="password"
            placeholder="Confirmez votre nouveau mot de passe..."
            onChange={passwordConfirmationRegister.onChange}
            name={passwordConfirmationRegister.name}
            ref={passwordConfirmationRegister.ref}
            aria-invalid={errors.passwordConfirmation ? "true" : "false"}
          />
        </div>
        <input type="submit" value="Enregistrer" />
      </form>
      <div role="alert">
        {errors.password && <p>{errors.password.message}</p>}
        {errors.passwordConfirmation && (
          <p> {errors.passwordConfirmation.message}</p>
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

export default ReinitialisationMDP;
