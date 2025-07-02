import { useForm } from "react-hook-form";

import axiosInstance from "../../services/axiosInstance";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useLoginContext } from "../../contexts/LoginContext";

function Inscription({ handleModalInstall, popUpContents }) {
  const { user, setUser } = useCurrentUserContext();
  const { setIsLoggedIn } = useLoginContext();
  // const { setIsBackgroundBlurred } = useBlurredBackgroundContext();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: null });

  const handleLoginRegistration = async (signupFormData) => {
    const formData = signupFormData;
    if (Number.isNaN(formData.gender)) {
      Object.assign(formData, { gender: null });
    }

    delete formData.passwordConfirmation;

    try {
      const res = await axiosInstance.post(`/api/auth/signup`, formData);
      setUser(res.data);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(res.data));
      handleModalInstall(popUpContents.signUpConfirm);
    } catch (err) {
      console.error(err);

      handleModalInstall({
        ...popUpContents.signUpError,
        message: err.response.data.message,
      });
    }
  };

  const registerOptions = {
    firstname: {
      // required: "Un prénom doit être renseigné.",
      pattern: {
        value: /[a-z0-9éèàëñçù]/gi,
        message: "Le prénom indiqué contient des caractères invalides.",
      },
      minLength: {
        value: 2,
        message: "Un prénom doit avoir au moins 2 caractères.",
      },
      maxLength: {
        value: 64,
        message: "Un prénom doit avoir au maximum 64 caractères.",
      },
    },
    lastname: {
      // required: "Un nom de famille doit être renseigné.",
      pattern: {
        value: /[a-z0-9éèàëñçù]/gi,
        message: "Le nom indiqué contient des caractères invalides.",
      },
      minLength: {
        value: 2,
        message: "Un nom de famille doit avoir au moins 2 caractères.",
      },
      maxLength: {
        value: 64,
        message: "Un nom de famille doit avoir au maximum 64 caractères.",
      },
    },
    // gender: {
    //   required: "Un genre doit être renseigné.",
    // },
    address: {
      maxLength: {
        value: 128,
        message: "Une adresse doit contenir au maximum 128 caractères.",
      },
    },
    postalCode: {
      maxLength: {
        value: 14,
        message: "Un code postal doit contenir au maximum 14 caractères.",
      },
    },
    city: {
      maxLength: {
        value: 45,
        message: "Un nom de ville doit contenir au maximum 45 caractères.",
      },
    },
    phoneNumber1: {
      maxLength: {
        value: 22,
        message:
          "Un numéro de téléphone doit contenir au maximum 22 caractères.",
      },
    },
    phoneNumber2: {
      maxLength: {
        value: 22,
        message:
          "Un numéro de téléphone doit contenir au maximum 22 caractères.",
      },
    },
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

  const firstnameRegister = register("firstname", registerOptions.firstname);
  const lastnameRegister = register("lastname", registerOptions.lastname);
  const genderRegister = register("gender", registerOptions.gender);
  const addressRegister = register("address", registerOptions.address);
  const postalCodeRegister = register("postalCode", registerOptions.postalCode);
  const cityRegister = register("city", registerOptions.city);
  const phoneNumber1Register = register(
    "phoneNumber1",
    registerOptions.phoneNumber1
  );
  const phoneNumber2Register = register(
    "phoneNumber2",
    registerOptions.phoneNumber2
  );
  const emailRegister = register("email", registerOptions.email);
  const passwordRegister = register("password", registerOptions.password);
  const passwordConfirmationRegister = register(
    "passwordConfirmation",
    registerOptions.passwordConfirmation
  );

  return (
    <div className="">
      <p>Pas encore inscrit ? Enregistrez-vous ici.</p>
      <form onSubmit={handleSubmit(handleLoginRegistration)}>
        <div>
          <label htmlFor="firstname">Prénom :</label>
          <input
            type="text"
            defaultValue={user && user.firstname}
            placeholder={
              user ? user.firstname || "Votre prénom... " : "Votre prénom..."
            }
            onChange={firstnameRegister.onChange}
            name={firstnameRegister.name}
            ref={firstnameRegister.ref}
            aria-invalid={errors.firstname ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="lastname">Nom de famille :</label>
          <input
            type="text"
            defaultValue={user && user.lastname}
            placeholder={
              user
                ? user.lastname || "Votre nom de famille..."
                : "Votre nom de famille..."
            }
            onChange={lastnameRegister.onChange}
            name={lastnameRegister.name}
            ref={lastnameRegister.ref}
            aria-invalid={errors.lastname ? "true" : "false"}
          />
        </div>
        <fieldset>
          <legend>Selectionnez votre genre :</legend>

          <div>
            <input
              type="radio"
              id="genderChoice1"
              value={1}
              onChange={genderRegister.onChange}
              name={genderRegister.name}
              ref={genderRegister.ref}
            />
            <label htmlFor="genderChoice1">Femme</label>
          </div>

          <div>
            <input
              type="radio"
              id="genderChoice2"
              value={2}
              onChange={genderRegister.onChange}
              name={genderRegister.name}
              ref={genderRegister.ref}
            />
            <label htmlFor="genderChoice2">Homme</label>
          </div>

          <div>
            <input
              type="radio"
              id="genderChoice3"
              value={3}
              onChange={genderRegister.onChange}
              name={genderRegister.name}
              ref={genderRegister.ref}
            />
            <label htmlFor="genderChoice3">Non genré</label>
          </div>
        </fieldset>
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
        <div>
          <label htmlFor="phoneNumber1">Téléphone :</label>
          <input
            type="text"
            defaultValue={user && user.phone_number_1}
            placeholder={
              user
                ? user.phone_number_1 || "Votre numéro de téléphone..."
                : "Votre numéro de téléphone..."
            }
            onChange={phoneNumber1Register.onChange}
            name={phoneNumber1Register.name}
            ref={phoneNumber1Register.ref}
            aria-invalid={errors.phoneNumber1 ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber2">Téléphone 2 :</label>
          <input
            type="text"
            defaultValue={user && user.phone_number_2}
            placeholder={
              user
                ? user.phone_number_2 || "Votre numéro de téléphone..."
                : "Votre numéro de téléphone..."
            }
            onChange={phoneNumber2Register.onChange}
            name={phoneNumber2Register.name}
            ref={phoneNumber2Register.ref}
            aria-invalid={errors.phoneNumber2 ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="address">Adresse :</label>
          <input
            type="text"
            defaultValue={user && user.address}
            placeholder={
              user ? user.address || "Votre adresse..." : "Votre adresse..."
            }
            onChange={addressRegister.onChange}
            name={addressRegister.name}
            ref={addressRegister.ref}
            aria-invalid={errors.address ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="postalCode">Code postal :</label>
          <input
            type="text"
            defaultValue={user && user.postal_code}
            placeholder={
              user ? user.postal_code || "Code postal..." : "Code postal..."
            }
            onChange={postalCodeRegister.onChange}
            name={postalCodeRegister.name}
            ref={postalCodeRegister.ref}
            aria-invalid={errors.postalCode ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="city">Ville :</label>
          <input
            type="text"
            defaultValue={user && user.city}
            placeholder={user ? user.city || "Ville..." : "Ville..."}
            onChange={cityRegister.onChange}
            name={cityRegister.name}
            ref={cityRegister.ref}
            aria-invalid={errors.city ? "true" : "false"}
          />
        </div>{" "}
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            placeholder="Choisissez votre mot de passe..."
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
            placeholder="Confirmez votre mot de passe..."
            onChange={passwordConfirmationRegister.onChange}
            name={passwordConfirmationRegister.name}
            ref={passwordConfirmationRegister.ref}
            aria-invalid={errors.passwordConfirmation ? "true" : "false"}
          />
        </div>
        <input type="submit" value="S'inscrire" />
      </form>
      <div role="alert">
        {errors.firstname && <p> {errors.firstname.message}</p>}
        {errors.lastname && <p> {errors.lastname.message}</p>}
        {errors.gender && <p> {errors.gender.message}</p>}
        {errors.email && <p> {errors.email.message}</p>}
        {errors.phoneNumber1 && <p> {errors.phoneNumber1.message}</p>}
        {errors.phoneNumber2 && <p> {errors.phoneNumber2.message}</p>}
        {errors.address && <p> {errors.address.message}</p>}
        {errors.postalCode && <p> {errors.postalCode.message}</p>}
        {errors.city && <p> {errors.city.message}</p>}

        {errors.password && <p>{errors.password.message}</p>}
        {errors.passwordConfirmation && (
          <p> {errors.passwordConfirmation.message}</p>
        )}
      </div>
      {/* {modalOpen ? (
        <InfoModal
          isOpen={modalOpen}
          content={modalContent}
          onClose={handleCloseModal}
        />
      ) : null} */}
    </div>
    // Todo : user profile image upload
  );
}

export default Inscription;
