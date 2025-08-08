import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseCreateSupport = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const postSupport = async (newSupportFormData) => {
    const { formData } = await giveSanitizedFormData(newSupportFormData);

    const query = "/api/supports/createSupport";

    queryclient.invalidateQueries({ queryKey: ["oeuvre"] });

    const res = await axiosInstance.post(query, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:shared.CreateSupport.`;

  return useMutation({
    mutationFn: (values) => postSupport(values),
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

export default UseCreateSupport;
