import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import giveSanitizedFormData from "../../services/giveSanitizedFormData";

const UseModifyFormat = (formatId, handleModalInstall, i18n) => {
  const queryclient = useQueryClient();

  const updateFormat = async (modifiedFormatFormData) => {
    const { formData } = await giveSanitizedFormData(modifiedFormatFormData);

    queryclient.invalidateQueries({
      queryKey: ["paintingSizes"],
    });

    const url = `/api/paintingSizes/modifyPaintingSize/${formatId}`;

    const res = await axiosInstance.put(url, formData);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (values) => updateFormat(values),
    onError: (error) => {
      handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data) => {
      console.warn(data);
      i18n.reloadResources(["fr", "enUS", "enGB"], "paintingSizes");
      queryclient.refetchQueries({
        queryKey: ["paintingSizes"],
      });

      handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseModifyFormat;
