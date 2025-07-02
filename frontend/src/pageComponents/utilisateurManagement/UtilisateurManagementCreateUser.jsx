import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import "../../scss/UtilisateurManagement.scss";

function UtilisateurManagementCreateUser({
  mutation,
  setDisplayedComponents,
  handleModalInstall,
}) {
  const { t } = useTranslation([
    "common",
    "errors",
    "pageText",
    "popUpContent",
  ]);
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: null });

  // const addNewUser = () => {
  //   const queryclient = useQueryClient();
  //   const postUser = async (signupFormData) => {
  //     const formData = signupFormData;
  //     if (Number.isNaN(formData.gender)) {
  //       Object.assign(formData, { gender: null });
  //     }
  //     delete formData.passwordConfirmation;
  //     console.log(formData);

  //     queryclient.invalidateQueries("users");
  //     const res = await axiosInstance.post(`/api/auth/createUser`, formData);
  //     return res.data;
  //   };
  //   return useMutation({
  //     mutationFn: (values) => postUser(values),
  //   });
  // };
  // const { mutate, data, error, isError } = addNewUser();
  const handleReturnSelected = () => {
    if (isDirty) {
      const prefix =
        "popUpContent:UtilisateurManagement.backWhileCreatingUser.";
      return handleModalInstall(
        t(`${prefix}title`),
        t(`${prefix}message`),
        t(`${prefix}validationBtnReturnedStr`),
        t(`${prefix}validationBtnText`),
        t(`${prefix}closeBtnText`)
      );
    }
    return setDisplayedComponents("userListInfo");
  };
  const registerOptions = {
    firstname: {
      // required: "Un prénom doit être renseigné.",
      pattern: {
        value: /[a-z0-9éèàëñçù]/gi,
        message: t("errors:registerOptionsUser.firstname.pattern"),
      },
      minLength: {
        value: 2,
        message: t("errors:registerOptionsUser.firstname.minLength"),
      },
      maxLength: {
        value: 64,
        message: t("errors:registerOptionsUser.firstname.maxLength"),
      },
    },
    lastname: {
      // required: "Un nom de famille doit être renseigné.",
      pattern: {
        value: /[a-z0-9éèàëñçù]/gi,
        message: t("errors:registerOptionsUser.lastname.pattern"),
      },
      minLength: {
        value: 2,
        message: t("errors:registerOptionsUser.lastname.minLength"),
      },
      maxLength: {
        value: 64,
        message: t("errors:registerOptionsUser.lastname.maxLength"),
      },
    },
    userTypesId: {
      required: t("errors:registerOptionsUser.userTypesId.required"),
    },
    address: {
      maxLength: {
        value: 128,
        message: t("errors:registerOptionsUser.address.maxLength"),
      },
    },
    postalCode: {
      maxLength: {
        value: 14,
        message: t("errors:registerOptionsUser.postalCode.maxLength"),
      },
    },
    city: {
      maxLength: {
        value: 45,
        message: t("errors:registerOptionsUser.city.maxLength"),
      },
    },
    phoneNumber1: {
      maxLength: {
        value: 22,
        message: t("errors:registerOptionsUser.phoneNumber.maxLength"),
      },
    },
    phoneNumber2: {
      maxLength: {
        value: 22,
        message: t("errors:registerOptionsUser.phoneNumber.maxLength"),
      },
    },
    email: {
      required: t("errors:registerOptionsUser.email.required"),
      pattern: {
        value: /^[a-z0-9.-_]+@[a-z]+\.[a-z]{2,4}$/gi,
        message: t("errors:registerOptionsUser.email.pattern"),
      },
    },
    password: {
      required: t("errors:registerOptionsUser.password.required"),
      minLength: {
        value: 8,
        message: t("errors:registerOptionsUser.password.minLength"),
      },
      maxLength: {
        value: 64,
        message: t("errors:registerOptionsUser.password.maxLength"),
      },
    },
    passwordConfirmation: {
      required: t("errors:registerOptionsUser.passwordConfirmation.required"),
      validate: (value) =>
        value === watch("password") ||
        t("errors:registerOptionsUser.passwordConfirmation.validate"),
    },
  };

  const firstnameRegister = register("firstname", registerOptions.firstname);
  const lastnameRegister = register("lastname", registerOptions.lastname);
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
  const userTypesIdRegister = register(
    "userTypesId",
    registerOptions.userTypesId
  );
  const passwordRegister = register("password", registerOptions.password);
  const passwordConfirmationRegister = register(
    "passwordConfirmation",
    registerOptions.passwordConfirmation
  );

  return (
    <div className="UtilisateurManagementCreateUser">
      <button type="button" onClick={() => handleReturnSelected()}>
        {t("pageText:UtilisateurManagement.UMCreateUser.return")}
      </button>
      <form onSubmit={handleSubmit(mutation.mutate)}>
        <div>
          <label htmlFor="firstname">{t("common:info.firstname")}:</label>
          <input
            type="text"
            placeholder={t(
              "pageText:UtilisateurManagement.UMCreateUser.firstname"
            )}
            onChange={firstnameRegister.onChange}
            name={firstnameRegister.name}
            ref={firstnameRegister.ref}
            aria-invalid={errors.firstname ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="lastname">{t("common:info.lastname")}:</label>
          <input
            type="text"
            placeholder={t(
              "pageText:UtilisateurManagement.UMCreateUser.lastname"
            )}
            onChange={lastnameRegister.onChange}
            name={lastnameRegister.name}
            ref={lastnameRegister.ref}
            aria-invalid={errors.lastname ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="email">{t("common:info.email")}:</label>
          <input
            type="text"
            placeholder={t("pageText:UtilisateurManagement.UMCreateUser.email")}
            onChange={emailRegister.onChange}
            name={emailRegister.name}
            ref={emailRegister.ref}
            aria-invalid={errors.email ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber1">
            {t("common:info.phoneNumber", { number: "1" })}:
          </label>
          <input
            type="text"
            placeholder={t(
              "pageText:UtilisateurManagement.UMCreateUser.phoneNumber"
            )}
            onChange={phoneNumber1Register.onChange}
            name={phoneNumber1Register.name}
            ref={phoneNumber1Register.ref}
            aria-invalid={errors.phoneNumber1 ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber2">
            {t("common:info.phoneNumber", { number: " 2" })}:
          </label>
          <input
            type="text"
            placeholder={t(
              "pageText:UtilisateurManagement.UMCreateUser.phoneNumber"
            )}
            onChange={phoneNumber2Register.onChange}
            name={phoneNumber2Register.name}
            ref={phoneNumber2Register.ref}
            aria-invalid={errors.phoneNumber2 ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="address">{t("common:info.address")}:</label>
          <input
            type="text"
            placeholder={t(
              "pageText:UtilisateurManagement.UMCreateUser.phoneNumber"
            )}
            onChange={addressRegister.onChange}
            name={addressRegister.name}
            ref={addressRegister.ref}
            aria-invalid={errors.address ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="postalCode">{t("common:info.postalCode")}:</label>
          <input
            type="text"
            placeholder={t(
              "pageText:UtilisateurManagement.UMCreateUser.postalCode"
            )}
            onChange={postalCodeRegister.onChange}
            name={postalCodeRegister.name}
            ref={postalCodeRegister.ref}
            aria-invalid={errors.postalCode ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="city">{t("common:info.city")}:</label>
          <input
            type="text"
            placeholder={t("pageText:UtilisateurManagement.UMCreateUser.city")}
            onChange={cityRegister.onChange}
            name={cityRegister.name}
            ref={cityRegister.ref}
            aria-invalid={errors.city ? "true" : "false"}
          />
        </div>
        <legend>
          {t("pageText:UtilisateurManagement.UMCreateUser.status")}:
        </legend>
        <div>
          <input
            type="radio"
            id="userTypesId1"
            value={1}
            onChange={userTypesIdRegister.onChange}
            name={userTypesIdRegister.name}
            ref={userTypesIdRegister.ref}
          />
          <label htmlFor="userTypesId1">{t("common:userTypes.1")}</label>
        </div>
        <div>
          <input
            type="radio"
            id="userTypesId2"
            value={2}
            onChange={userTypesIdRegister.onChange}
            name={userTypesIdRegister.name}
            ref={userTypesIdRegister.ref}
          />
          <label htmlFor="userTypesId2">{t("common:userTypes.2")}</label>
        </div>
        <div>
          <label htmlFor="password">{t("common:info.password")}:</label>
          <input
            type="password"
            placeholder={t(
              "pageText:UtilisateurManagement.UMCreateUser.password"
            )}
            onChange={passwordRegister.onChange}
            name={passwordRegister.name}
            ref={passwordRegister.ref}
            aria-invalid={errors.password ? "true" : "false"}
          />
        </div>
        <div>
          <label htmlFor="passwordConfirmation">
            {t("common:info.passwordConfirmation")}:
          </label>
          <input
            type="password"
            placeholder={t(
              "pageText:UtilisateurManagement.UMCreateUser.passwordConfirmation"
            )}
            onChange={passwordConfirmationRegister.onChange}
            name={passwordConfirmationRegister.name}
            ref={passwordConfirmationRegister.ref}
            aria-invalid={errors.passwordConfirmation ? "true" : "false"}
          />
        </div>
        <input
          type="submit"
          value={t("pageText:UtilisateurManagement.UMCreateUser.register")}
        />
      </form>
      <div role="alert">
        {errors.firstname && <p> {errors.firstname.message}</p>}
        {errors.lastname && <p> {errors.lastname.message}</p>}
        {errors.userTypesId && <p> {errors.userTypesId.message}</p>}
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
    </div>
    // Todo : user profile image upload
  );
}

export default UtilisateurManagementCreateUser;
