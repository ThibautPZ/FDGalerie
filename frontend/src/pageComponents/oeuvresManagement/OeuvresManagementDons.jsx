import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, useOutletContext } from "react-router-dom";

import axiosInstance from "../../services/axiosInstance";
import OeuvresManagementDonsTable from "./OeuvresManagementDonsTable";

export default function OeuvresManagementDons() {
  const outletContext = useOutletContext();
  const getGiftsListFromDb = async () => {
    const url = "api/paintingGifts/browseWithDetails";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const giftsListQuery = useSuspenseQuery({
    queryKey: ["oeuvreGifts"],
    queryFn: getGiftsListFromDb,
    throwOnError: true,
  });
  return (
    <div>
      <OeuvresManagementDonsTable donsList={giftsListQuery.data} />
      <Outlet context={outletContext} />
    </div>
  );
}
