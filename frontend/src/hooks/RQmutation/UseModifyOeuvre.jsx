import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseModifyOeuvre = (oeuvreId, handleModalInstall) => {
  const queryclient = useQueryClient();

  const filteredKeys = [
    "oeuvreGivenToFirstname",
    "oeuvreGivenToLastname",
    "oeuvreSoldToFirstname",
    "oeuvreSoldToLastname",
    "oeuvreReservedToFirstname",
    "oeuvreReservedToLastname",
  ];

  const updateOeuvre = async (modifiedOeuvreFormData) => {
    const { formData, fileFields, files } = await giveSanitizedFormData(
      modifiedOeuvreFormData,
      null,
      filteredKeys
    );

    const parsedFiles = JSON.stringify(files);

    const requestQuery = `fileFields=${fileFields}&files=${parsedFiles}`;

    queryclient.invalidateQueries({ queryKey: ["oeuvre"] });

    const url = `/api/paintings/updatePainting/${oeuvreId}?${requestQuery}`;

    const res = await axiosInstance.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (values) => updateOeuvre(values),
    onError: (error) => {
      handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data) => {
      console.warn(data);
      queryclient.refetchQueries(["oeuvre"]);
      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};
export default UseModifyOeuvre;
