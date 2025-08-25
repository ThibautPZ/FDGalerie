import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";

const UseDeleteFamily = (handleModalInstall) => {
  const queryclient = useQueryClient();

  const deleteFamily = async (familyId) => {
    queryclient.invalidateQueries({ queryKey: ["families"] });
    const url = `/api/families/deleteFamily/${familyId}`;

    const res = await axiosInstance.delete(url);
    return res.data;
  };

  const translationPrefix = `popUpContent:OeuvresManagement.`;

  return useMutation({
    mutationFn: (familyId) => deleteFamily(familyId),
    onError: (error) => {
      return handleModalInstall(error.response.data.errorObj);
    },
    onSuccess: (data, variables) => {
      console.warn(data);
      queryclient.removeQueries({
        queryKey: [
          "families",
          { type: "singleWithDetails", familyId: variables },
        ],
      });
      queryclient.refetchQueries({ queryKey: ["families"] });
      return handleModalInstall(data.successObj, translationPrefix);
    },
  });
};

export default UseDeleteFamily;
