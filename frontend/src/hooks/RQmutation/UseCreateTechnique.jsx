import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseCreateTechnique = (handleModalInstall, i18n) => {
  const queryclient = useQueryClient();

  const postTechnique = async (newTechniqueFormData) => {
    const { formData } = await giveSanitizedFormData(newTechniqueFormData);

    const query = "/api/techniques/createTechnique";

    queryclient.invalidateQueries({ queryKey: ["oeuvre"] });

    const res = await axiosInstance.post(query, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:shared.CreateTechnique.`;

  return useMutation({
    mutationFn: (values) => postTechnique(values),
    onError: (error) => {
      console.warn(error);
      return handleModalInstall(
        error.response.data.errorObj,
        translationPrefix
      );
    },
    onSuccess: (data) => {
      console.warn(data);
      i18n.reloadResources(["fr", "enUS", "enGB"], "techniques");
      queryclient.refetchQueries({ queryKey: ["techniques"] });
      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseCreateTechnique;
