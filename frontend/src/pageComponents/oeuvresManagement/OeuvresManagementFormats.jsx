import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";

import OeuvresManagementOeuvreAttributesTable from "./OeuvresManagementOeuvreAttributesTable";
import axiosInstance from "../../services/axiosInstance";
import tranlationInstance from "../../services/translationInstance";

export default function OeuvresManagementFormats() {
  const { pathname } = useLocation();
  const outletContext = useOutletContext();
  const [isFolded, setIsFolded] = useState(true);
  const tPageText = tranlationInstance("pageText:OeuvresManagement.OMFormats");

  const getDetailedFormatsFromDb = async () => {
    const url = "api/paintingSizes/paintingSizesWithDetails";
    const res = await axiosInstance.get(url);
    return res.data;
  };
  const { data } = useQuery({
    queryKey: ["paintingSizes", { type: "allWithDetails" }],
    queryFn: getDetailedFormatsFromDb,
    throwOnError: true,
  });

  const formatsColumns = [
    {
      colName: ["name", "Fr"],
      tKey: ["paintingSizeNameFr"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["name", "EnUS"],
      tKey: ["paintingSizeNameEnUS"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["name", "EnGB"],
      tKey: ["paintingSizeNameEnGB"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["description", "Fr"],
      tKey: ["paintingSizeDescriptionFr"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: ["description", "EnUS"],
      tKey: ["paintingSizeDescriptionEnUS"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: ["description", "EnGB"],
      tKey: ["paintingSizeDescriptionEnGB"],
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
    <div className="OeuvresManagementFormats">
      {pathname !== "/management/oeuvres/formats/new" ? (
        <>
          <div className="OeuvresManagementHeader">
            <Link to="new">{tPageText("newFormat")}</Link>
          </div>
          <Suspense fallback={<h1>Loading...</h1>}>
            <OeuvresManagementOeuvreAttributesTable
              attributeData={data.paintingSizes}
              jsonData={{
                jsonFr: data.jsonFr,
                jsonEnUS: data.jsonEnUS,
                jsonEnGB: data.jsonEnGB,
              }}
              tableColumns={formatsColumns}
              emptyDataText={tPageText("noFormats")}
              className="OeuvresManagementFormatsTable"
              attribute="format"
              t={tPageText}
              setIsFolded={setIsFolded}
            />
          </Suspense>
        </>
      ) : (
        <Link to="/management/oeuvres/formats/">{tPageText("return")}</Link>
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
