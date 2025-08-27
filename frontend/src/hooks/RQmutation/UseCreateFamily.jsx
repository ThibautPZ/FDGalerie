import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseCreateFamily = (handleModalInstall, i18n) => {
  const queryclient = useQueryClient();

  const postFamily = async (newFamilyFormData) => {
    const { formData } = await giveSanitizedFormData(newFamilyFormData);

    const query = "/api/families/createFamily";

    queryclient.invalidateQueries({ queryKey: ["families"] });

    const res = await axiosInstance.post(query, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:shared.CreateFamily.`;

  return useMutation({
    mutationFn: (values) => postFamily(values),
    onError: (error) => {
      console.warn(error);
      return handleModalInstall(
        error.response.data.errorObj,
        translationPrefix
      );
    },
    onSuccess: (data) => {
      console.warn(data);
      i18n.reloadResources(["fr", "enUS", "enGB"], "families");
      queryclient.refetchQueries({ queryKey: ["families"] });
      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseCreateFamily;
