import { Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import OeuvresManagementDetailedAttribute from "./OeuvresManagementDetailedAttribute";
import tranlationInstance from "../../services/translationInstance";
import OeuvresManagementModifyTechnique from "./OeuvresManagementModifyTechnique";

export default function OeuvresManagementDetailedTechnique() {
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

  return (
    <div className="OeuvresManagementDetailedTechnique">
      {isModifying ? (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementModifyTechnique
            techniqueData={data}
            setIsModifying={setIsModifying}
          />
          <button type="button" onClick={() => setIsModifying(false)}>
            {tPageText("return")}
          </button>
        </Suspense>
      ) : (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementDetailedAttribute
            attributeData={data}
            attribute="technique"
            tAttributePageText={tPageText}
            tAttribute={tTechniques}
            setIsModifying={setIsModifying}
          />
        </Suspense>
      )}
    </div>
  );
}
