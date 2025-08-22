import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";

const UseDeleteOeuvre = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const deleteOeuvre = async (oeuvreId) => {
    queryclient.invalidateQueries({ queryKey: ["oeuvre"] });
    const url = `/api/paintings/deletePainting/${oeuvreId}`;

    const res = await axiosInstance.delete(url);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (oeuvreId) => deleteOeuvre(oeuvreId),
    onError: (error) => {
      return handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data) => {
      console.warn(data);
      queryclient.refetchQueries({ queryKey: ["oeuvre"] });
      return handleModalInstall(data.successObj, translationPrefix);
    },
  });
};
export default UseDeleteOeuvre;
