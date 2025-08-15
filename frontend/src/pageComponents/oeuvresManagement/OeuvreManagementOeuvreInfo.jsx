import { useSuspenseQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { Suspense } from "react";

import axiosInstance from "../../services/axiosInstance";
// import ModifyOeuvre from "./ModifyOeuvre";
import OeuvresManagementDetailedOeuvre from "./OeuvresManagementDetailedOeuvre";
import tranlationInstance from "../../services/translationInstance";

import OeuvresManagementModifyOeuvre from "./OeuvresManagementModifyOeuvre";

export default function OeuvresManagementOeuvreInfo() {
  const [
    tPageText,
    tPageDetailedOeuvreText,
    tCommon,
    tCommonInfo,
    tTechniques,
    tSupports,
    tFormats,
    tFamilies,
  ] = tranlationInstance(
    "pageText:OeuvresManagement",
    "pageText:OeuvresManagement.OMDetailedOeuvre",
    "common",
    "common:info",
    "techniques",
    "supports",
    "paintingSizes",
    "families"
  );
  const { isModifying, setIsModifying } = useOutletContext();
  const { id } = useParams();
  const oeuvreId = parseInt(id.split(":")[1], 10);

  const getDetailedOeuvreFromDb = async () => {
    const url = `api/paintings/adminOneDetailed/${oeuvreId}`;

    const res = await axiosInstance.get(url);

    return res.data;
  };

  const { data } = useSuspenseQuery({
    queryKey: ["detailedOeuvre", { oeuvreId }],
    queryFn: getDetailedOeuvreFromDb,
    throwOnError: true,
  });

  const handleModifyBtnClick = () => {
    setIsModifying(!isModifying);
  };

  return (
    <>
      <div>
        <Suspense fallback={<h1>Loading...</h1>}>
          {!isModifying ? (
            <OeuvresManagementDetailedOeuvre
              oeuvreData={data}
              translations={{
                tPageDetailedOeuvreText,
                tCommon,
                tCommonInfo,
                tTechniques,
                tSupports,
                tFormats,
                tFamilies,
              }}
            />
          ) : (
            <OeuvresManagementModifyOeuvre
              oeuvreData={data}
              translations={{
                tPageText,
                tCommon,
                tCommonInfo,
                tTechniques,
                tSupports,
                tFormats,
                tFamilies,
              }}
              isModifying
            />
          )}
        </Suspense>
      </div>
      <button type="button" onClick={handleModifyBtnClick}>
        {isModifying
          ? tPageText("OMOeuvreInfo.modifyBtnReturn")
          : tPageText("OMOeuvreInfo.modifyBtnModify")}
      </button>
    </>
  );
}
