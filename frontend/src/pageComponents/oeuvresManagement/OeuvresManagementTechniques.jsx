import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";

import OeuvresManagementOeuvreAttributesTable from "./OeuvresManagementOeuvreAttributesTable";
import axiosInstance from "../../services/axiosInstance";
import tranlationInstance from "../../services/translationInstance";

export default function OeuvresManagementTechniques() {
  const { pathname } = useLocation();
  const outletContext = useOutletContext();
  const [isFolded, setIsFolded] = useState(true);
  const tPageText = tranlationInstance(
    "pageText:OeuvresManagement.OMTechniques"
  );

  const getDetailedTechniquesFromDb = async () => {
    const url = "api/techniques/techniquesWithDetails";
    const res = await axiosInstance.get(url);
    return res.data;
  };
  const { data } = useQuery({
    queryKey: ["techniques", { type: "allWithDetails" }],
    queryFn: getDetailedTechniquesFromDb,
    throwOnError: true,
  });

  const techniquesColumns = [
    {
      colName: ["name", "Fr"],
      tKey: ["techniqueNameFr"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["name", "EnUS"],
      tKey: ["techniqueNameEnUS"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["name", "EnGB"],
      tKey: ["techniqueNameEnGB"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["description", "Fr"],
      tKey: ["techniqueDescriptionFr"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: ["description", "EnUS"],
      tKey: ["techniqueDescriptionEnUS"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: ["description", "EnGB"],
      tKey: ["techniqueDescriptionEnGB"],
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
    <div className="OeuvreManagementTechniques">
      {pathname !== "/management/oeuvres/techniques/new" ? (
        <>
          <div className="OeuvresManagementHeader">
            <Link to="new">{tPageText("newTechnique")}</Link>
          </div>
          <Suspense fallback={<h1>Loading...</h1>}>
            <OeuvresManagementOeuvreAttributesTable
              attributeData={data.techniques}
              jsonData={{
                jsonFr: data.jsonFr,
                jsonEnUS: data.jsonEnUS,
                jsonEnGB: data.jsonEnGB,
              }}
              tableColumns={techniquesColumns}
              emptyDataText={tPageText("noTechniques")}
              className="OeuvresManagementTechniquesTable"
              attribute="technique"
              t={tPageText}
              setIsFolded={setIsFolded}
            />
          </Suspense>
        </>
      ) : (
        <Link to="/management/oeuvres/techniques/">{tPageText("return")}</Link>
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
