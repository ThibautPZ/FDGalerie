import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";

import OeuvresManagementOeuvreAttributesTable from "./OeuvresManagementOeuvreAttributesTable";
import axiosInstance from "../../services/axiosInstance";
import tranlationInstance from "../../services/translationInstance";

export default function OeuvresManagementSupports() {
  const { pathname } = useLocation();
  const outletContext = useOutletContext();
  const [isFolded, setIsFolded] = useState(true);
  const tPageText = tranlationInstance("pageText:OeuvresManagement.OMSupports");

  const getDetailedSupportsFromDb = async () => {
    const url = "api/supports/supportsWithDetails";
    const res = await axiosInstance.get(url);
    return res.data;
  };
  const { data } = useQuery({
    queryKey: ["supports", { type: "allWithDetails" }],
    queryFn: getDetailedSupportsFromDb,
    throwOnError: true,
  });

  const supportsColumns = [
    {
      colName: ["name", "Fr"],
      tKey: ["supportNameFr"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["name", "EnUS"],
      tKey: ["supportNameEnUS"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["name", "EnGB"],
      tKey: ["supportNameEnGB"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["description", "Fr"],
      tKey: ["supportDescriptionFr"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: ["description", "EnUS"],
      tKey: ["supportDescriptionEnUS"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: ["description", "EnGB"],
      tKey: ["supportDescriptionEnGB"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: "nbPaintings",
      tKey: ["nbPaintings"],
      options: { sorting: true },
    },
    {
      colName: "id",
      tKey: ["id"],
      options: { sorting: true },
    },
  ];

  return (
    <div className="OeuvreManagementSupports">
      {pathname !== "/management/oeuvres/supports/new" ? (
        <>
          <div className="OeuvresManagementHeader">
            <Link to="new">{tPageText("newSupport")}</Link>
          </div>
          <Suspense fallback={<h1>Loading...</h1>}>
            <OeuvresManagementOeuvreAttributesTable
              attributeData={data.supports}
              jsonData={{
                jsonFr: data.jsonFr,
                jsonEnUS: data.jsonEnUS,
                jsonEnGB: data.jsonEnGB,
              }}
              tableColumns={supportsColumns}
              emptyDataText={tPageText("noSupports")}
              className="OeuvresManagementSupportsTable"
              attribute="support"
              t={tPageText}
              setIsFolded={setIsFolded}
            />
          </Suspense>
        </>
      ) : (
        <Link to="/management/oeuvres/supports/">{tPageText("return")}</Link>
      )}
      <Outlet
        context={{
          ...outletContext,
          isFolded,
          setIsFolded,
        }}
      />
    </div>
  );
}
