import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseModifyFamily = (familyId, handleModalInstall, i18n) => {
  const queryclient = useQueryClient();

  const updateFamily = async (modifiedFamilyFormData) => {
    const { formData } = await giveSanitizedFormData(modifiedFamilyFormData);

    queryclient.invalidateQueries({ queryKey: ["families"] });

    const url = `/api/families/modifyFamily/${familyId}`;

    const res = await axiosInstance.put(url, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (values) => updateFamily(values),
    onError: (error) => {
      handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data) => {
      console.warn(data);
      i18n.reloadResources(["fr", "enUS", "enGB"], "families");
      queryclient.refetchQueries({ queryKey: ["families"] });

      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseModifyFamily;
