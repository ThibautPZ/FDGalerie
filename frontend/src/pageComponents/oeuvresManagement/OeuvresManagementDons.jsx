import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, useOutletContext } from "react-router-dom";

import axiosInstance from "../../services/axiosInstance";
import tranlationInstance from "../../services/translationInstance";
import OeuvresManagementTransactionTable from "./OeuvresManagementTransactionTable";

export default function OeuvresManagementDons() {
  const outletContext = useOutletContext();
  const tPageText = tranlationInstance("pageText:OeuvresManagement.OMDons");

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

  const donsColumns = [
    {
      colName: "image",
      tKey: ["preview"],
      options: null,
      cellCb: "thumbMdCellCb",
    },
    {
      colName: "paintingTitle",
      tKey: ["oeuvreTitle"],
      options: { sorting: true },
    },
    {
      colName: ["firstName", "lastName"],
      tKey: ["ownerName"],
      options: { sorting: true },
      cellCb: "ownerCellCb",
    },
    {
      colName: "date",
      tKey: ["date"],
      options: { sorting: true },
      cellCb: "dateCellCb",
    },
    {
      colName: "note",
      tKey: ["note"],
      options: { sorting: true },
      cellCb: "noteCellCb",
    },
    {
      colName: "giftNumber",
      tKey: ["giftNumber"],
      options: { sorting: true },
    },
    {
      colName: "paintingId",
      tKey: ["paintingId"],
      options: { sorting: true },
    },
  ];

  return (
    <div>
      <Suspense fallback={<h1>Loading...</h1>}>
        <OeuvresManagementTransactionTable
          tableData={giftsListQuery.data}
          tableColumns={donsColumns}
          emptyDataText={tPageText("noDons")}
          className="OeuvresManagementDonsTable"
        />
      </Suspense>
      <Outlet context={outletContext} />
    </div>
  );
}
