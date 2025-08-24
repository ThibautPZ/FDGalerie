import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";

const UseDeleteTechnique = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const deleteTechnique = async (techniqueId) => {
    queryclient.invalidateQueries({ queryKey: ["techniques"] });
    const url = `/api/techniques/deleteTechnique/${techniqueId}`;

    const res = await axiosInstance.delete(url);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (techniqueId) => deleteTechnique(techniqueId),
    onError: (error) => {
      return handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data, variables) => {
      console.warn(data);
      queryclient.removeQueries({
        queryKey: [
          "techniques",
          { type: "singleWithDetails", techniqueId: variables },
        ],
      });
      queryclient.refetchQueries({ queryKey: ["techniques"] });
      return handleModalInstall(data.successObj, translationPrefix);
    },
  });
};
export default UseDeleteTechnique;
