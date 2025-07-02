import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import axiosInstance from "../../services/axiosInstance";
import newArrayOfObjectsWithValuesUpdated from "../../services/arrayMethods/newArrayOfObjectsWithValuesUpdated";

const UseUnwarnUser = (handleModalInstall, updateUsersQueryData) => {
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);

  const queryclient = useQueryClient();

  const postUnwarning = async (userInfos) => {
    queryclient.invalidateQueries(["users"]);
    const res = await axiosInstance.put(`/api/users/unwarning`, userInfos);
    return res.data;
  };

  return useMutation({
    mutationFn: (values) => postUnwarning(values),
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
        true,
        t(`${translationPrefix}closeBtnText`)
      );

      const updatedUserList = newArrayOfObjectsWithValuesUpdated(
        users,
        "id",
        variables.userId,
        "accountStatesId",
        1
      );
      return updateUsersQueryData(updatedUserList);
    },
  });
};

export default UseUnwarnUser;
