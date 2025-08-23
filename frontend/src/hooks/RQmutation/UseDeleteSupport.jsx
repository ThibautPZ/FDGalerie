import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";

const UseDeleteSupport = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const deleteSupport = async (supportId) => {
    queryclient.invalidateQueries({ queryKey: ["supports"] });
    const url = `/api/supports/deleteSupport/${supportId}`;

    const res = await axiosInstance.delete(url);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (supportId) => deleteSupport(supportId),
    onError: (error) => {
      return handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data) => {
      console.warn(data);
      queryclient.refetchQueries({ queryKey: ["supports"] });
      return handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseDeleteSupport;
