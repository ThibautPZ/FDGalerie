import { Suspense, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import OeuvresManagementDetailedAttribute from "./OeuvresManagementDetailedAttribute";
import tranlationInstance from "../../services/translationInstance";
import OeuvresManagementModifyTechnique from "./OeuvresManagementModifyTechnique";

export default function OeuvresManagementDetailedTechnique() {
  const { handleModalInstall } = useOutletContext();
  const { technique } = useParams();
  const techniqueId = parseInt(technique.split(":")[1], 10);

  const [isModifying, setIsModifying] = useState(false);

  const [tPageText, tTechniques] = tranlationInstance(
    "pageText:OeuvresManagement.OMDetailedTechnique",
    "techniques"
  );

  const getDetailedTechniqueFromDb = async () => {
    const url = `api/techniques/adminOneDetailed/${techniqueId}`;
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const { data } = useSuspenseQuery({
    queryKey: ["techniques", { type: "singleWithDetails", techniqueId }],
    queryFn: getDetailedTechniqueFromDb,
    throwOnError: true,
  });

  const handleDeleteTechniqueBtnClick = () => {
    return handleModalInstall(
      {
        type: "confirmation",
        message: "deleteTechniqueConfirmation",
        infoData: {
          insertText1: techniqueId,
        },
        confirmationData: {
          case: "confirmOperation",
          operationData: { id: techniqueId },
        },
      },
      "popUpContent:OeuvresManagement."
    );
  };

  return (
    <div className="OeuvresManagementDetailedTechnique">
      {isModifying ? (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementModifyTechnique
            techniqueData={data}
            setIsModifying={setIsModifying}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementDetailedAttribute
            attributeData={data}
            attribute="technique"
            tAttributePageText={tPageText}
            tAttribute={tTechniques}
            setIsModifying={setIsModifying}
            handleDeleteBtnClick={handleDeleteTechniqueBtnClick}
          />
        </Suspense>
      )}

      <button type="button" onClick={() => setIsModifying(!isModifying)}>
        {isModifying ? tPageText("return") : tPageText("modifyBtn")}
      </button>
    </div>
  );
}
