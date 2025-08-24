import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";

const UseDeleteFormat = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const deleteFormat = async (formatId) => {
    queryclient.invalidateQueries({ queryKey: ["paintingSizes"] });
    const url = `/api/paintingSizes/deletePaintingSize/${formatId}`;

    const res = await axiosInstance.delete(url);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (formatId) => deleteFormat(formatId),
    onError: (error) => {
      return handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data, variables) => {
      console.warn(data, variables);
      queryclient.removeQueries({
        queryKey: [
          "paintingSizes",
          { type: "singleWithDetails", formatId: variables },
        ],
      });
      queryclient.refetchQueries({ queryKey: ["paintingSizes"] });
      return handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseDeleteFormat;
