import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import axiosInstance from "../../services/axiosInstance";

const UseCreateUser = (handleModalInstall, updateUsersQueryData) => {
  const { t, i18n } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);

  const queryclient = useQueryClient();

  const postUser = async (signupFormData) => {
    const formData = signupFormData;
    if (Number.isNaN(formData.gender)) {
      Object.assign(formData, { gender: null, userLang: i18n.language });
    }
    delete formData.passwordConfirmation;
    queryclient.invalidateQueries(["users"]);
    const res = await axiosInstance.post(`/api/auth/createUser`, formData);
    return res.data;
  };
  return useMutation({
    mutationFn: (values) => postUser(values),
    onError: (error) => {
      handleModalInstall(
        t(`errors:title.${error.response.data.errorObj.title}`),
        t(`errors:message.${error.response.data.errorObj.message}`),
        t(`errors:message.${error.response.data.errorObj.message}`),
        t(`errors:message.${error.response.data.errorObj.message}`),
        true,
        t(`errors:message.${error.response.data.errorObj.message}`)
      );
    },
    onSuccess: async (data) => {
      const translationPrefix = `popUpContent:UtilisateurManagement.${data.successObj.message}.`;
      const users = await queryclient.fetchQuery(["users"]);
      handleModalInstall(
        t(`${translationPrefix}title`),
        t(`${translationPrefix}message`),
        t(`${translationPrefix}validationBtnReturnedStr`),
        t(`${translationPrefix}validationBtnText`),
        false,
        t(`${translationPrefix}closeBtnText`)
      );
      const updatedUserList = [...users, data.newUser];
      return updateUsersQueryData(updatedUserList);
    },
  });
};

export default UseCreateUser;
