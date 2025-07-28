import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseCreateFormat = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const postFormat = async (newFormatFormData) => {
    const { formData } = await giveSanitizedFormData(newFormatFormData);

    const query = "/api/paintingSizes/createPaintingSize";

    queryclient.invalidateQueries(["oeuvresWithDetails"]);

    const res = await axiosInstance.post(query, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:popUpContent:shared.CreateFormat.`;

  return useMutation({
    mutationFn: (values) => postFormat(values),
    onError: (error) => {
      console.warn(error);
      return handleModalInstall(
        error.response.data.errorObj,
        translationPrefix
      );
    },
    onSuccess: (data) => {
      console.warn(data);
      queryclient.refetchQueries(["oeuvresWithDetails"]);
      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseCreateFormat;
