import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseModifyTechnique = (techniqueId, handleModalInstall, i18n) => {
  const queryclient = useQueryClient();

  const updateTechnique = async (modifiedTechniqueFormData) => {
    const { formData } = await giveSanitizedFormData(modifiedTechniqueFormData);

    queryclient.invalidateQueries({ queryKey: ["technique"] });

    const url = `/api/techniques/modifyTechnique/${techniqueId}`;

    const res = await axiosInstance.put(url, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (values) => updateTechnique(values),
    onError: (error) => {
      handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data) => {
      console.warn(data);
      i18n.reloadResources(["fr", "enUS", "enGB"], "techniques");
      queryclient.refetchQueries(
        { queryKey: ["techniques"] },
        { throwOnError: true }
      );

      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};
export default UseModifyTechnique;
