import { useTranslation } from "react-i18next";

import "../../scss/UtilisateurManagement.scss";
import giveMatchingObjectValues from "../../services/objectMethods/giveMatchingObjectValues";

function UtilisateurManagementUserInfo({
  user,
  setDisplayedComponents,
  handleModalInstall,
}) {
  const { t } = useTranslation(["common", "pageText", "popUpContent"]);

  // const iterateOverUserInfos = (userInfos) => {
  //   let returnedStr = "";
  //   for (let info in userInfos) {
  //     if (Object.prototype.hasOwnProperty.call(userInfos, info)) {
  //       returnedStr = `${returnedStr}<div> <p> ${t(
  //         `info.${[info]}`
  //       )} : </p> <p> ${userInfos[info] || t("info.unregistered")} </p> </div>`;
  //     }
  //   }
  //   return JSON.parse(returnedStr);
  // };

  const isAccountStateMatching = (arrOfStr) => {
    if (!arrOfStr.length || typeof arrOfStr === "string") {
      return false;
    }
    let returnedBool = false;
    const references = {
      active: 1,
      warned: 2,
      banned: 3,
      deleted: 4,
      unsubscribed: 5,
    };
    const searchedIds = giveMatchingObjectValues(references, arrOfStr);
    searchedIds.forEach((id) => {
      if (id === user.accountStatesId) {
        returnedBool = true;
      }
    });
    return returnedBool;
  };

  const userInfosInArray = (userInfos) => {
    return Object.entries(userInfos);
  };
  const putNumberOutOfString = (string) => {
    const regex = /[0-9]/gi;
    const number = string[string.search(regex)];
    const strWithoutNumber = string.replaceAll(regex, "");
    return `${t(`info.${strWithoutNumber}`, { number: number || "" })} `;
  };

  const warnUser = () => {
    if (isAccountStateMatching(["warned"])) {
      const translationPrefix =
        "popUpContent:UtilisateurManagement.userHasNotif.";
      return handleModalInstall(
        t(`${translationPrefix}title`),
        t(`${translationPrefix}message`),
        t(`${translationPrefix}validationBtnReturnedStr`),
        t(`${translationPrefix}validationBtnText`),
        t(`${translationPrefix}closeBtnText`)
      );
    }
    return setDisplayedComponents("warnUser");
  };

  const banUser = () => {
    return setDisplayedComponents("banUser");
  };

  const unbanUser = () => {
    const translationPrefix = "popUpContent:UtilisateurManagement.unbanUser.";
    return handleModalInstall(
      t(`${translationPrefix}title`),
      t(`${translationPrefix}message`),
      t(`${translationPrefix}validationBtnReturnedStr`),
      t(`${translationPrefix}validationBtnText`),
      t(`${translationPrefix}closeBtnText`)
    );
  };

  const unwarnUser = () => {
    const translationPrefix = "popUpContent:UtilisateurManagement.unwarnUser.";
    return handleModalInstall(
      t(`${translationPrefix}title`),
      t(`${translationPrefix}message`),
      t(`${translationPrefix}validationBtnReturnedStr`),
      t(`${translationPrefix}validationBtnText`),
      t(`${translationPrefix}closeBtnText`)
    );
  };

  const deleteUser = () => {
    return setDisplayedComponents("deleteAccount");
  };

  return user.userId ? (
    <div className="UtilisateurManagementUserInfo">
      {userInfosInArray(user).map((pairArr) => (
        <div key={pairArr[0]}>
          <p> {putNumberOutOfString(pairArr[0])} </p>
          <p>
            {pairArr[0] === "userTypesId" ? t(`userTypes.${pairArr[1]}`) : ""}
            {pairArr[0] === "accountStatesId"
              ? t(`accountStates.${pairArr[1]}`)
              : ""}
            {pairArr[0] === "registeredLanguagesId"
              ? t(`languages.${pairArr[1]}`) || t("info.unregistered")
              : ""}
            {!pairArr[0].endsWith("sId") || !pairArr[0] === "registeredLang"
              ? pairArr[1] || t("info.unregistered")
              : ""}
          </p>
        </div>
      ))}
      {isAccountStateMatching(["active", "warned"]) ? (
        <>
          <button type="button" onClick={warnUser}>
            {t("pageText:UtilisateurManagement.UMUserInfo.warnUser")}
          </button>
          <button type="button" onClick={banUser}>
            {t("pageText:UtilisateurManagement.UMUserInfo.banUser")}
          </button>
        </>
      ) : (
        ""
      )}
      {isAccountStateMatching(["warned"]) ? (
        <button type="button" onClick={unwarnUser}>
          {t("pageText:UtilisateurManagement.UMUserInfo.unwarnUser")}
        </button>
      ) : (
        ""
      )}
      {isAccountStateMatching(["banned"]) ? (
        <button type="button" onClick={unbanUser}>
          {t("pageText:UtilisateurManagement.UMUserInfo.unbanUser")}
        </button>
      ) : (
        ""
      )}
      {!isAccountStateMatching(["deleted", "unsubscribed"]) ? (
        <button type="button" onClick={deleteUser}>
          {t("pageText:UtilisateurManagement.UMUserInfo.deleteUser")}
        </button>
      ) : (
        ""
      )}
    </div>
  ) : (
    ""
  );
}

export default UtilisateurManagementUserInfo;
