import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseCreateOeuvre = (handleModalInstall, updateOeuvresQueryData) => {
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);

  const queryclient = useQueryClient();

  const postOeuvre = async (newOeuvreFormData) => {
    const { formData, fileFields, files } = await giveSanitizedFormData(
      newOeuvreFormData
    );

    // values: fileFields: "single", "array", "fields", "none"
    //    files: (single):{name:"oneFieldName"}  (array):{name:"oneFieldName", maxCount:number}, (fields): [{name:"oneFieldName", maxCount:number},{name:"otherFieldName", maxCount:number},]
    // const fileFields = "single";
    // const files = { name: "oeuvreFile" };
    const parsedFiles = JSON.stringify(files);

    const requestQuery = `fileFields=${fileFields}&files=${parsedFiles}`;
    queryclient.invalidateQueries(["oeuvres"]);
    const res = await axiosInstance.postForm(
      `/api/paintings/createPainting?${requestQuery}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  };
  return useMutation({
    mutationFn: (values) => postOeuvre(values),
    onError: (error) => {
      console.warn(error);
      handleModalInstall(
        t(`errors:title.${error.response.data.errorObj.title}`),
        t(`errors:message.${error.response.data.errorObj.message}`),
        t(`errors:message.${error.response.data.errorObj.message}`),
        t(`errors:message.${error.response.data.errorObj.message}`),
        true,
        t(`errors:message.${error.response.data.errorObj.message}`)
      );
    },
    onSuccess: (data) => {
      console.warn(data);

      const translationPrefix = `popUpContent:UtilisateurManagement.${data.successObj.message}.`;
      const oeuvres = queryclient.getQueryData(["oeuvres"]);
      handleModalInstall(
        t(`${translationPrefix}title`),
        t(`${translationPrefix}message`),
        t(`${translationPrefix}validationBtnReturnedStr`),
        t(`${translationPrefix}validationBtnText`),
        false,
        t(`${translationPrefix}closeBtnText`)
      );
      const updatedOeuvresList = [...oeuvres, data.newOeuvre];
      return updateOeuvresQueryData(updatedOeuvresList);
    },
  });
};

export default UseCreateOeuvre;
