import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseModifySupport = (supportId, handleModalInstall, i18n) => {
  const queryclient = useQueryClient();

  const updateSupport = async (modifiedSupportFormData) => {
    const { formData } = await giveSanitizedFormData(modifiedSupportFormData);

    queryclient.invalidateQueries({ queryKey: ["supports"] });

    const url = `/api/supports/modifySupport/${supportId}`;

    const res = await axiosInstance.put(url, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (values) => updateSupport(values),
    onError: (error) => {
      handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data) => {
      console.warn(data);
      i18n.reloadResources(["fr", "enUS", "enGB"], "supports");
      queryclient.refetchQueries({ queryKey: ["supports"] });

      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};
export default UseModifySupport;
