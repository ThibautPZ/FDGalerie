import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseCreateContact = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const postContact = async (newContactFormData) => {
    const { formData } = await giveSanitizedFormData(newContactFormData);

    queryclient.invalidateQueries({
      queryKey: ["contacts", { type: "withPaintingsOwningCount" }],
    });
    const res = await axiosInstance.post(`/api/auth/createContact`, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:ContactManagement.`;

  return useMutation({
    mutationFn: (values) => postContact(values),
    onError: (error) => {
      console.warn("err", error.response.data.errorObj);
      handleModalInstall(error.response.data.errorObj, translationPrefix);
    },
    onSuccess: (data) => {
      console.warn("suc", data.successObj);
      queryclient.refetchQueries({
        queryKey: ["contacts", { type: "withPaintingsOwningCount" }],
      });
      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseCreateContact;
