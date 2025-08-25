import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";

import OeuvresManagementOeuvreAttributesTable from "./OeuvresManagementOeuvreAttributesTable";
import axiosInstance from "../../services/axiosInstance";
import tranlationInstance from "../../services/translationInstance";

export default function OeuvresManagementFamilies() {
  const { pathname } = useLocation();
  const outletContext = useOutletContext();
  const [isFolded, setIsFolded] = useState(true);
  const tPageText = tranlationInstance("pageText:OeuvresManagement.OMFamilies");

  const getDetailedFamiliesFromDb = async () => {
    const url = "api/families/familiesWithDetails";
    const res = await axiosInstance.get(url);
    return res.data;
  };
  const { data } = useQuery({
    queryKey: ["families", { type: "allWithDetails" }],
    queryFn: getDetailedFamiliesFromDb,
    throwOnError: true,
  });

  const familiesColumns = [
    {
      colName: ["name", "Fr"],
      tKey: ["familyName"],
      options: { sorting: true },
      cellCb: "translatedNameCellCb",
    },
    {
      colName: ["description", "Fr"],
      tKey: ["familyDescriptionFr"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: ["description", "EnUS"],
      tKey: ["familyDescriptionEnUS"],
      options: { sorting: true },
      cellCb: "translatedDescriptionCellCb",
    },
    {
      colName: ["description", "EnGB"],
      tKey: ["familyDescriptionEnGB"],
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
    <div className="OeuvresManagementFamilies">
      {pathname !== "/management/oeuvres/families/new" ? (
        <>
          <div className="OeuvresManagementHeader">
            <Link to="new">{tPageText("newFamily")}</Link>
          </div>
          <Suspense fallback={<h1>Loading...</h1>}>
            <OeuvresManagementOeuvreAttributesTable
              attributeData={data.families}
              jsonData={{
                jsonFr: data.jsonFr,
                jsonEnUS: data.jsonEnUS,
                jsonEnGB: data.jsonEnGB,
              }}
              tableColumns={familiesColumns}
              emptyDataText={tPageText("noFamilies")}
              className="OeuvresManagementFamiliesTable"
              attribute="family"
              t={tPageText}
              setIsFolded={setIsFolded}
            />
          </Suspense>
        </>
      ) : (
        <Link to="/management/oeuvres/families/">{tPageText("return")}</Link>
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
