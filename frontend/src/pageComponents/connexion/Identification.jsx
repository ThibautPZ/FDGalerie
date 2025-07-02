import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useLoginContext } from "../../contexts/LoginContext";
import InfoModal from "../../components/modals/InfoModal";
// import { useBlurredBackgroundContext } from "../contexts/BlurredBackgroundContext";
// import interceptor from "../hooks/useInstanceWithInterceptor";
import axiosInstance from "../../services/axiosInstance";
import i18n from "../../i18n";

function Identification() {
  // const { setIsBackgroundBlurred } = useBlurredBackgroundContext();
  const { setIsLoggedIn } = useLoginContext();
  const { setUser } = useCurrentUserContext();
  // const expressAPI = interceptor();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ head: "", body: "" });

  const handleLoginError = (msgFromBack) => {
    setModalContent({
      head: "Erreur de connexion",
      body:
        msgFromBack ||
        "Une erreur s'est déroulée lors de la connexion. Veuillez réessayer.",
    });
    setModalOpen(true);
    // setIsBackgroundBlurred(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // setIsBackgroundBlurred(false);
  };

  const handleMDPOublieNavigation = () => {
    return navigate("/MDPOublie");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerOptions = {
    email: {
      required: "Une adresse email doit être renseignée.",
      pattern: {
        value: /^[a-z0-9.-_]+@[a-z]+\.[a-z]{2,4}$/gi,
        message:
          "L' email indiqué n' a pas le bon format. Il doit être semblable à ceci : \"micheldupont@exemple.com.\"",
      },
    },
    password: {
      required: "Un mot de passe doit être renseigné.",
      minLength: {
        value: 8,
        message:
          "Un mot de passe valide doit contenir au minimum 8 caractères.",
      },
      maxLength: {
        value: 30,
        message:
          "Un mot de passe valide doit contenir au maximum 30 caractères.",
      },
    },
  };

  const emailRegister = register("email", registerOptions.email);
  const passwordRegister = register("password", registerOptions.password);

  const handleLoginRegistration = async (loginFormData) => {
    Object.assign(loginFormData, { userLang: i18n.language });
    try {
      const res = await axiosInstance.post(`/api/auth/login`, loginFormData);

      setUser(res.data);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      console.error(err);
      handleLoginError(err.response.data);
    }
  };

  return (
    <div className="Login">
      <p>Vous êtes déjà inscrit ? Connectez-vous ici.</p>
      <form onSubmit={handleSubmit(handleLoginRegistration)}>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="text"
            placeholder="Adresse email..."
            onChange={emailRegister.onChange}
            name={emailRegister.name}
            ref={emailRegister.ref}
            aria-invalid={errors.email ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            placeholder="Mot de passe..."
            onChange={passwordRegister.onChange}
            name={passwordRegister.name}
            ref={passwordRegister.ref}
            aria-invalid={errors.password ? "true" : "false"}
          />
        </div>
        <input type="submit" value="Log In" />
      </form>
      <p>
        Vous possédez un compte, mais vous ne vous souvenez plus de votre mot de
        passe ?
      </p>
      <button type="button" onClick={handleMDPOublieNavigation}>
        Réinitialiser mon mot de passe
      </button>
      <div role="alert">
        {errors.email && <p> {errors.email.message}</p>}
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      {modalOpen ? (
        <InfoModal
          isOpen={modalOpen}
          content={modalContent}
          onClose={handleCloseModal}
        />
      ) : null}
    </div>
  );
}

export default Identification;
