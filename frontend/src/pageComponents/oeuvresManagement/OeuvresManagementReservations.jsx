import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, useOutletContext } from "react-router-dom";

import axiosInstance from "../../services/axiosInstance";
import tranlationInstance from "../../services/translationInstance";
import OeuvresManagementTransactionTable from "./OeuvresManagementTransactionTable";

export default function OeuvresManagementReservations() {
  const outletContext = useOutletContext();
  const tPageText = tranlationInstance(
    "pageText:OeuvresManagement.OMReservations"
  );

  const getReservationsListFromDb = async () => {
    const url = "api/paintingreservations/browseWithDetails";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const reservationsListQuery = useSuspenseQuery({
    queryKey: ["oeuvrereservations"],
    queryFn: getReservationsListFromDb,
    throwOnError: true,
  });

  const ReservationsColumns = [
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
      colName: "price",
      tKey: ["reservationPriceEur"],
      options: { sorting: true },
    },
    {
      colName: "note",
      tKey: ["note"],
      options: { sorting: true },
      cellCb: "noteCellCb",
    },
    {
      colName: "reservationNumber",
      tKey: ["reservationNumber"],
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
          tableData={reservationsListQuery.data}
          tableColumns={ReservationsColumns}
          emptyDataText={tPageText("noReservations")}
          className="OeuvresManagementReservationsTable"
        />
      </Suspense>
      <Outlet context={outletContext} />
    </div>
  );
}
