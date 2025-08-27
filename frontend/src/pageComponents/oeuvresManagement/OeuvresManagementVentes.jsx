import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, useOutletContext } from "react-router-dom";

import axiosInstance from "../../services/axiosInstance";
import tranlationInstance from "../../services/translationInstance";
import OeuvresManagementTransactionTable from "./OeuvresManagementTransactionTable";

export default function OeuvresManagementVentes() {
  const outletContext = useOutletContext();
  const tPageText = tranlationInstance("pageText:OeuvresManagement.OMVentes");

  const getSalesListFromDb = async () => {
    const url = "api/paintingSales/browseWithDetails";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const salesListQuery = useSuspenseQuery({
    queryKey: ["oeuvreSales"],
    queryFn: getSalesListFromDb,
    throwOnError: true,
  });

  const ventesColumns = [
    {
      colName: "image",
      tKey: ["preview"],
      options: { filtering: { filterFn: "filterByImagePresence" } },
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
      options: { sorting: true, filtering: { filterFn: "filterByDateRange" } },
      cellCb: "dateCellCb",
    },
    {
      colName: "price",
      tKey: ["salePriceEur"],
      options: {
        sorting: true,
        filtering: { filterFn: "filterByNumberRange" },
      },
    },
    {
      colName: "note",
      tKey: ["note"],
      options: { sorting: true },
      cellCb: "noteCellCb",
    },
    {
      colName: "saleNumber",
      tKey: ["saleNumber"],
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
      {" "}
      <h1>{tPageText("title")}</h1>
      <Suspense fallback={<h1>Loading...</h1>}>
        <OeuvresManagementTransactionTable
          tableData={salesListQuery.data}
          tableColumns={ventesColumns}
          emptyDataText={tPageText("noVentes")}
          className="OeuvresManagementVentesTable"
          transaction="sales"
        />
      </Suspense>
      <Outlet context={outletContext} />
    </div>
  );
}
