import { Suspense, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import OeuvresManagementDetailedAttribute from "./OeuvresManagementDetailedAttribute";
import tranlationInstance from "../../services/translationInstance";
import OeuvresManagementModifyFamily from "./OeuvresManagementModifyFamily";

export default function OeuvresManagementDetailedFamily() {
  const { handleModalInstall } = useOutletContext();
  const { family } = useParams();
  const familyId = parseInt(family.split(":")[1], 10);

  const [isModifying, setIsModifying] = useState(false);

  const [tPageText, tFamilys] = tranlationInstance(
    "pageText:OeuvresManagement.OMDetailedFamily",
    "families"
  );

  const getDetailedFamilyFromDb = async () => {
    const url = `api/families/adminOneDetailed/${familyId}`;
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const { data } = useSuspenseQuery({
    queryKey: ["families", { type: "singleWithDetails", familyId }],
    queryFn: getDetailedFamilyFromDb,
    throwOnError: true,
  });

  const handleDeleteFamilyBtnClick = () => {
    return handleModalInstall(
      {
        type: "confirmation",
        message: "deleteFamilyConfirmation",
        infoData: {
          insertText1: familyId,
        },
        confirmationData: {
          case: "confirmOperation",
          operationData: { id: familyId },
        },
      },
      "popUpContent:OeuvresManagement."
    );
  };

  return (
    <div className="OeuvresManagementDetailedFamily">
      {isModifying ? (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementModifyFamily
            familyData={data}
            setIsModifying={setIsModifying}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementDetailedAttribute
            attributeData={data}
            attribute="family"
            tAttributePageText={tPageText}
            tAttribute={tFamilys}
            setIsModifying={setIsModifying}
            handleDeleteBtnClick={handleDeleteFamilyBtnClick}
          />
        </Suspense>
      )}

      <button type="button" onClick={() => setIsModifying(!isModifying)}>
        {isModifying ? tPageText("return") : tPageText("modifyBtn")}
      </button>
    </div>
  );
}
