import { useForm } from "react-hook-form";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
// import { useBlurredBackgroundContext } from "../contexts/BlurredBackgroundContext";

import axiosInstance from "../../services/axiosInstance";
import popUpContents from "../../json/ProfilePagePopUpMessages.json";

function UserInfoUpdate({ setFormState, handleOpenModal, setModalContent }) {
  const { user, setUser } = useCurrentUserContext();
  // const { setIsBackgroundBlurred } = useBlurredBackgroundContext();

  // const [modalOpen, handleOpenModal] = useState(false);
  // const [modalContent, setModalContent] = useState({ head: "", body: "" });

  const handleModalInstall = (content) => {
    setModalContent(content);
    handleOpenModal();
  };

  const userInfoDefaultValues = {
    firstname: (user && user.firstname) || "",
    lastname: (user && user.lastname) || "",
    gender: (user && user.gender) || "",
    address: (user && user.address) || "",
    postalCode: (user && user.postalCode) || "",
    city: (user && user.city) || "",
    phoneNumber1: (user && user.phoneNumber1) || "",
    phoneNumber2: (user && user.phoneNumber2) || "",
    email: (user && user.email) || "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({ defaultValues: userInfoDefaultValues });

  const handleModifCancelClick = () => {
    setFormState("display");
  };

  const selectModifiedInfos = (formData, modifiedFields) => {
    const resultingFormData = {};
    Object.keys(modifiedFields).forEach((key) => {
      Object.assign(resultingFormData, { [key]: formData[key] });
    });
    return resultingFormData;
  };

  const handleLoginModification = async (signupFormData) => {
    if (!isDirty) {
      handleModalInstall(popUpContents.noModifToSave);
      return handleOpenModal();
    }
    const modifiedInfosForm = selectModifiedInfos(signupFormData, dirtyFields);

    Object.assign(modifiedInfosForm, { user });

    try {
      const res = await axiosInstance.post(
        `/api/users/updateInfo`,
        modifiedInfosForm
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      handleModalInstall(popUpContents.modifConfirm);
    } catch (err) {
      console.error(err);

      handleModalInstall({
        ...popUpContents.modifError,
        message: err.response.data.message,
      });
    }
    return handleOpenModal();
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

  return (
    <div className="">
      <p>Pas encore inscrit ? Enregistrez-vous ici.</p>
      <form onSubmit={handleSubmit(handleLoginModification)}>
        <div>
          <label htmlFor="firstname">Prénom :</label>
          <input
            type="text"
            defaultValue={userInfoDefaultValues.firstname}
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
        </div>

        <div>
          <input type="submit" value="Sauvegarder les modifications" />
          <button type="button" onClick={handleModifCancelClick}>
            Annuler les modifications
          </button>
        </div>
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
      </div>
      {/* {modalOpen ? (
        <InfoModal
          isOpen={modalOpen}
          content={modalContent}
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
        />
      ) : null} */}
    </div>
    // Todo : user profile image upload
  );
}

export default UserInfoUpdate;
