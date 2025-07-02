import { useState } from "react";
import { useTranslation } from "react-i18next";

import "../../scss/UtilisateurManagement.scss";
import FormCore from "../../components/FormCore";

function UtilisateurManagementUnbanUser({
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
      name: "messageToUser",
      label: {
        namespace:
          "pageText:UtilisateurManagement.UMUnbanUser.remainingCharacters",
        count: "messageToUser",
      },

      input: "text",
    },
  ];
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
    <div className="UtilisateurManagementUnbanUser">
      <button
        type="button"
        onClick={() => handleReturnClick(watchMethod("messageToUser"))}
      >
        {t("pageText:UtilisateurManagement.UMUnbanUser.return")}
      </button>
      <p>
        {t("pageText:UtilisateurManagement.UMUnbanUser.textIntro", {
          firstname: selectedUser.firstname,
          lastname: selectedUser.lastname,
          mail: selectedUser.email,
        })}
      </p>
      <p>{t("pageText:UtilisateurManagement.UMUnbanUser.instruction")}</p>
      <FormCore
        mutation={mutation}
        defaultValues={null}
        addedValues={valuesToAdd}
        fields={formFields}
        setWatchMethod={setWatchMethod}
      />
    </div>
  );
}
export default UtilisateurManagementUnbanUser;
