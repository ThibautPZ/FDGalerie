import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseCreateOeuvre = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const filteredKeys = [
    "oeuvreGivenToFirstname",
    "oeuvreGivenToLastname",
    "oeuvreSoldToFirstname",
    "oeuvreSoldToLastname",
    "oeuvreReservedToFirstname",
    "oeuvreReservedToLastname",
  ];

  const postOeuvre = async (newOeuvreFormData) => {
    const { formData, fileFields, files } = await giveSanitizedFormData(
      newOeuvreFormData,
      null,
      filteredKeys
    );

    // values: fileFields: "single", "array", "fields", "none"
    //    files: (single):{name:"oneFieldName"}  (array):{name:"oneFieldName", maxCount:number}, (fields): [{name:"oneFieldName", maxCount:number},{name:"otherFieldName", maxCount:number},]
    // const fileFields = "single";
    // const files = { name: "oeuvreFile" };
    const parsedFiles = JSON.stringify(files);

    const requestQuery = `fileFields=${fileFields}&files=${parsedFiles}`;
    queryclient.invalidateQueries({ queryKey: ["oeuvre"] });
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

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (values) => postOeuvre(values),
    onError: (error) => {
      console.warn(error);
      return handleModalInstall(
        error.response.data.errorObj,
        translationPrefix
      );
    },
    onSuccess: (data) => {
      console.warn(data);
      queryclient.refetchQueries({ queryKey: ["oeuvre"] });
      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseCreateOeuvre;
