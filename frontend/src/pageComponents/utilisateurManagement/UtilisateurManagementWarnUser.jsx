import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import "../../scss/UtilisateurManagement.scss";
import FormCore from "../../components/FormCore";

function UtilisateurManagementWarnUser({
  selectedUser,
  mutation,
  setDisplayedComponents,
  handleModalInstall,
}) {
  const { t } = useTranslation(["common", "pageText", "popUpContent"]);
  const [watchMethod, setWatchMethod] = useState({});

  const valuesToAdd = {
    userEmail: selectedUser.email,
    userId: selectedUser.id,
    userLang: selectedUser.registeredLanguagesId,
  };
  const formFields = [
    {
      name: "notificationToUser",
      label: {
        namespace:
          "pageText:UtilisateurManagement.UMWarnUser.remainingCharacters",
        count: "notificationToUser",
      },

      input: "text",
    },
  ];

  const warnUserFormMethods = useForm({
    defaultValues: { notificationToUser: "" },
  });
  const handleReturnClick = (message) => {
    if (message?.length) {
      const translationPrefix =
        "popUpContent:UtilisateurManagement.backWhileWritingDeleteMessage";
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
    <div className="UtilisateurManagementWarnUser">
      <button
        type="button"
        onClick={() => handleReturnClick(watchMethod("messageToUser"))}
      >
        {t("pageText:UtilisateurManagement.UMWarnUser.return")}
      </button>
      <p>
        {t("pageText:UtilisateurManagement.UMWarnUser.textIntro", {
          firstname: selectedUser.firstname,
          lastname: selectedUser.lastname,
          mail: selectedUser.email,
        })}
      </p>
      <p>{t("pageText:UtilisateurManagement.UMWarnUser.instruction")}</p>
      <FormCore
        mutation={mutation}
        formMethods={warnUserFormMethods}
        defaultValues={null}
        addedValues={valuesToAdd}
        fields={formFields}
        setWatchMethod={setWatchMethod}
        submitbuttonText={t(
          "pageText:UtilisateurManagement.UMWarnUser.submitBtnText"
        )}
      />
    </div>
  );
}
export default UtilisateurManagementWarnUser;
