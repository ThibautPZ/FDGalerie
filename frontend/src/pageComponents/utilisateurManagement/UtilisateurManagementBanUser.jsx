import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import "../../scss/UtilisateurManagement.scss";

function UtilisateurManagementBanUser({
  selectedUser,
  mutation,
  setDisplayedComponents,
  handleModalInstall,
}) {
  const { t } = useTranslation(["common", "pageText"]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { messageToUser: "" },
    values: {
      userEmail: selectedUser.email,
      userId: selectedUser.id,
      userLang: selectedUser.registeredLanguagesId,
    },
  });

  const giveRemainingCharacters = (value) => {
    if (value) {
      return 254 - value.length;
    }
    return 254;
  };

  const registerOptions = {
    messageToUser: {
      pattern: {
        value: /[a-z0-9éèàëñçù;,.:()/]/gi,
        message: t("errors:registerOptionsUser.messageToUser.pattern"),
      },
      minLength: {
        value: 3,
        message: t("errors:registerOptionsUser.messageToUser.minLength"),
      },
      maxLength: {
        value: 254,
        message: t("errors:registerOptionsUser.messageToUser.maxLength"),
      },
    },
  };

  const messageToUserRegister = register(
    "messageToUser",
    registerOptions.messageToUser
  );

  const handleReturnClick = (message) => {
    if (message?.length) {
      const translationPrefix =
        "popUpContent:UtilisateurManagement.backWhileWritingBanMessage.";
      return handleModalInstall(
        t(`${translationPrefix}title`),
        t(`${translationPrefix}message`),
        t(`${translationPrefix}validationBtnReturnedStr`),
        t(`${translationPrefix}validationBtnText`),
        t(`${translationPrefix}closeBtnText`)
      );
    }
    return setDisplayedComponents("userListInfo");
  };
  return (
    <div className="UtilisateurManagementBanUser">
      <button
        type="button"
        onClick={() => handleReturnClick(watch("messageToUser"))}
      >
        {t("pageText:UtilisateurManagement.UMBanUser.return")}
      </button>
      <p>
        {t("pageText:UtilisateurManagement.UMBanUser.textIntro", {
          firstname: selectedUser.firstname,
          lastname: selectedUser.lastname,
          mail: selectedUser.email,
        })}
      </p>
      <p>{t("pageText:UtilisateurManagement.UMBanUser.instruction")}</p>
      <form onSubmit={handleSubmit(mutation.mutate)}>
        <div>
          <label htmlFor="messageToUser">
            {t("pageText:UtilisateurManagement.UMBanUser.remainingCharacters", {
              count: giveRemainingCharacters(watch("messageToUser")),
            })}
            :
          </label>
          <input
            type="text"
            placeholder={t(
              "pageText:UtilisateurManagement.UMBanUser.msgPlaceholder"
            )}
            onChange={messageToUserRegister.onChange}
            name={messageToUserRegister.name}
            ref={messageToUserRegister.ref}
            aria-invalid={errors.messageToUser ? "true" : "false"}
            maxLength={254}
          />
        </div>
        <input
          type="submit"
          value={t("pageText:UtilisateurManagement.UMCreateUser.register")}
        />
      </form>

      <div role="alert">
        {errors.messageToUser && <p> {errors.messageToUser.message}</p>}
      </div>
    </div>
  );
}
export default UtilisateurManagementBanUser;
