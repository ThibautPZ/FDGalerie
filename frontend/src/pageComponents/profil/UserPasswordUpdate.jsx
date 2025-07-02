import { useForm } from "react-hook-form";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";

// import { useBlurredBackgroundContext } from "../contexts/BlurredBackgroundContext";
import axiosInstance from "../../services/axiosInstance";
import popUpContents from "../../json/ProfilePagePopUpMessages.json";

function UserPasswordUpdate({
  setFormState,
  handleOpenModal,
  setModalContent,
}) {
  const { user } = useCurrentUserContext();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: null });

  const handleModalInstall = (content) => {
    setModalContent(content);
    handleOpenModal();
  };

  const handlePasswordUpdate = async (signupFormData) => {
    const formData = {
      password: signupFormData.password,
      formerPassword: signupFormData.formerPassword,
      id: user.id,
      email: user.email,
    };

    try {
      const res = await axiosInstance.post(`api/auth/passwordUpdate`, formData);
      if (res) {
        handleModalInstall(popUpContents.modifConfirm);
      }
    } catch (err) {
      console.error(err);
      if (err.response.data.message) {
        handleModalInstall({
          ...popUpContents.modifError,
          message: err.response.data.message,
        });
      } else
        handleModalInstall({
          ...popUpContents.modifError,
          message: err.response.data,
        });
    }
  };

  const registerOptions = {
    formerPassword: {
      required: "Votre mot de passe actuel doit être renseigné.",
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
    password: {
      required: "Un nouveau mot de passe doit être renseigné.",
      minLength: {
        value: 8,
        message: "Un mot de passe valide doit contenir au moins 8 caractères.",
      },
      maxLength: {
        value: 64,
        message:
          "Un mot de passe valide doit contenir au maximum 64 caractères.",
      },
      validate: (value) =>
        value !== watch("formerPassword") ||
        "Votre nouveau mot de passe doit être différent de l'actuel.",
    },
    passwordConfirmation: {
      required:
        "Vous devez réécrire le nouveau mot de passe pour le confirmer.",
      validate: (value) =>
        value === watch("password") || "Les mots de passe ne concordent pas.",
    },
  };

  const formerPasswordRegister = register(
    "formerPassword",
    registerOptions.formerPassword
  );
  const updatedPasswordRegister = register(
    "password",
    registerOptions.password
  );
  const passwordConfirmationRegister = register(
    "passwordConfirmation",
    registerOptions.passwordConfirmation
  );

  return (
    <div className="">
      <p>Pas encore inscrit ? Enregistrez-vous ici.</p>
      <form onSubmit={handleSubmit(handlePasswordUpdate)}>
        <div>
          <label htmlFor="formerPassword">Mot de passe actuel :</label>
          <input
            type="password"
            placeholder="Votre mot de passe..."
            onChange={formerPasswordRegister.onChange}
            name={formerPasswordRegister.name}
            ref={formerPasswordRegister.ref}
            aria-invalid={errors.formerPassword ? "true" : "false"}
          />
        </div>

        <div>
          <label htmlFor="password">Nouveau mot de passe :</label>
          <input
            type="password"
            placeholder="Choisissez votre mot de passe..."
            onChange={updatedPasswordRegister.onChange}
            name={updatedPasswordRegister.name}
            ref={updatedPasswordRegister.ref}
            aria-invalid={errors.password ? "true" : "false"}
          />
        </div>

        <div>
          <label htmlFor="passwordConfirmation">
            Confirmation du nouveau mot de passe :
          </label>
          <input
            type="password"
            placeholder="Confirmez votre mot de passe..."
            onChange={passwordConfirmationRegister.onChange}
            name={passwordConfirmationRegister.name}
            ref={passwordConfirmationRegister.ref}
            aria-invalid={errors.passwordConfirmation ? "true" : "false"}
          />
        </div>
        <div>
          <input type="submit" value="Sauvegarder le nouveau mot de passe" />
          <button type="button" onClick={() => setFormState("display")}>
            Annuler les modifications
          </button>
        </div>
      </form>
      <div role="alert">
        {errors.formerPassword && <p>{errors.formerPassword.message}</p>}
        {errors.password && <p>{errors.password.message}</p>}
        {errors.passwordConfirmation && (
          <p> {errors.passwordConfirmation.message}</p>
        )}
      </div>
    </div>
    // Todo : user profile image upload
  );
}

export default UserPasswordUpdate;
