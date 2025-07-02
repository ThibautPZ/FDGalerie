import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getFixedT } from "i18next";

import axiosInstance from "../../services/axiosInstance";

const UseDeleteAccount = (
  handleModalInstall,
  setUsersArray,
  updateUsersQueryData,
  splitArrayByObjectKeyValue
) => {
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);

  const queryclient = useQueryClient();

  const newArrayWithUnbannedUser = (usersArr, userId) => {
    const idKey = "id";
    const userStateKey = "accountStatesId";
    const userStateValue = 1;
    const { matchingObjects, unmatchingObjects } = splitArrayByObjectKeyValue(
      usersArr,
      idKey,
      userId
    );

    const unbannedUserObj = {
      ...matchingObjects[0],
      [userStateKey]: userStateValue,
    };
    unmatchingObjects.push(unbannedUserObj);
    return unmatchingObjects;
  };

  const postDelete = async (formData) => {
    const sentData = { ...formData };
    let language = sentData.userLang;
    if (language !== "fr" || language !== "en") {
      language = "fr";
      Object.assign(sentData, {
        userLang: language,
      });
    }
    if (!sentData.messageToUser) {
      const fixedT = getFixedT(
        language,
        "pageText",
        "UtilisateurManagement.UM"
      );
      Object.assign(sentData, {
        messageToUser: fixedT("genericDeleteMsg"),
      });
    }
    queryclient.invalidateQueries(["users"]);
    const res = await axiosInstance.post(`/api/users/deleteByAdmin`, sentData);
    return res.data;
  };

  return useMutation({
    mutationFn: (values) => postDelete(values),
    onError: (error) => {
      const translationPrefix = `popUpContent:httpErrors.${error.response.data.errorObj.message}.`;
      handleModalInstall(
        t(`${translationPrefix}title`),
        t(`${translationPrefix}message`),
        t(`${translationPrefix}validationBtnReturnedStr`),
        t(`${translationPrefix}validationBtnText`),
        true,
        t(`${translationPrefix}closeBtnText`)
      );
    },
    onSuccess: (data, variables) => {
      const translationPrefix = `popUpContent:UtilisateurManagement.${data.successObj.message}.`;
      const users = queryclient.getQueryData(["users"]);
      handleModalInstall(
        t(`${translationPrefix}title`),
        t(`${translationPrefix}message`),
        t(`${translationPrefix}validationBtnReturnedStr`),
        t(`${translationPrefix}validationBtnText`),
        false,
        t(`${translationPrefix}closeBtnText`)
      );
      const updatedUserList = newArrayWithUnbannedUser(users, variables.userId);
      setUsersArray(updatedUserList);
      return updateUsersQueryData(updatedUserList);
    },
  });
};

export default UseDeleteAccount;
