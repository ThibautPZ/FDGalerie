import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import axiosInstance from "../../services/axiosInstance";
import newArrayOfObjectsWithValuesUpdated from "../../services/arrayMethods/newArrayOfObjectsWithValuesUpdated";

const UseWarnUser = (
  handleModalInstall,
  setUsersArray,
  updateUsersQueryData
) => {
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);

  const queryclient = useQueryClient();

  const postWarning = async (formData) => {
    const sentData = { ...formData };
    let language = sentData.userLang;
    if (language !== "fr" || language !== "en") {
      language = "fr";
      Object.assign(sentData, {
        userLang: language,
      });
    }
    queryclient.invalidateQueries(["users"]);
    const res = await axiosInstance.post(`/api/users/warningByAdmin`, sentData);
    return res.data;
  };

  return useMutation({
    mutationFn: (values) => postWarning(values),
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

      const updatedUserList = newArrayOfObjectsWithValuesUpdated(
        users,
        "id",
        variables.userId,
        "accountStatesId",
        2
      );
      setUsersArray(updatedUserList);
      return updateUsersQueryData(updatedUserList);
    },
  });
};

export default UseWarnUser;
