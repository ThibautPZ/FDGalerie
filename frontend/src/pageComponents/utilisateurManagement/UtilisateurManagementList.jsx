import { useState } from "react";
import { useTranslation } from "react-i18next";

import "../../scss/UtilisateurManagement.scss";

function UtilisateurManagementList({
  userList,
  selectedUser,
  handleUserSelected,
}) {
  const { t } = useTranslation(["common", "pageText"]);
  const [currentInfo, setCurrentInfo] = useState({
    dbInfo: "email",
    displayedInfo: t("info.email"),
  });

  const handleInfoDisplaySelected = (info) => {
    const regex = /[0-9]/gi;
    const translationName = `info.${info}`.replaceAll(regex, "");
    const infoToDisplay = t(translationName);
    setCurrentInfo({ dbInfo: info, displayedInfo: infoToDisplay });
  };
  return userList?.length ? (
    <div className="UtilisateurManagementList">
      <label htmlFor="infoDisplayedSelect">
        {t("pageText:UtilisateurManagement.UMList.displayed")}
        {currentInfo.displayedInfo}
      </label>
      <select
        name="infoDisplayedSelect"
        id="infoDisplayedSelect"
        onChange={(e) => handleInfoDisplaySelected(e.target.value)}
      >
        <option value="email">{t("info.email")}</option>
        <option value="userId">{t("info.id")}</option>
        <option value="firstname">{t("info.firstname")}</option>
        <option value="lastname">{t("info.lastname")}</option>
        <option value="address">{t("info.address")}</option>
        <option value="postalCode">{t("info.postalCode")}</option>
        <option value="city">{t("info.city")}</option>
        <option value="phoneNumber1">{t("info.phoneNumber")} 1</option>
        <option value="phoneNumber2">{t("info.phoneNumber")} 2</option>
        <option value="accountDate">{t("info.accountDate")}</option>
        <option value="userTypesId">{t("info.userTypesId")}</option>
      </select>
      {userList?.length > 0 &&
        userList.map((user) => (
          <button
            type="button"
            key={user.id}
            onClick={() => handleUserSelected(user)}
            disabled={user.userId === selectedUser.userId}
          >
            {user[currentInfo.dbInfo] || t("info.unregistered")}
            {user.id}
          </button>
        ))}
    </div>
  ) : (
    ""
  );
}

export default UtilisateurManagementList;
