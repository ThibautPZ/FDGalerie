import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseModifyContact = (contactId, handleModalInstall) => {
  const queryclient = useQueryClient();

  const updateContact = async (modifiedContactFormData) => {
    const { formData } = await giveSanitizedFormData(modifiedContactFormData);
    queryclient.invalidateQueries(["contact", contactId]);
    const url = `/api/auth/updateContact/${contactId}`;

    const res = await axiosInstance.put(url, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:ContactManagement.`;

  return useMutation({
    mutationFn: (values) => updateContact(values),
    onError: (error) => {
      handleModalInstall(error.response.data.errorObj, translationPrefix);
    },
    onSuccess: (data) => {
      queryclient.refetchQueries(["contact", contactId]);
      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseModifyContact;
