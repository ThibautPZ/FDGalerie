import { Suspense, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import OeuvresManagementDetailedAttribute from "./OeuvresManagementDetailedAttribute";
import tranlationInstance from "../../services/translationInstance";
import OeuvresManagementModifySupport from "./OeuvresManagementModifySupport";

export default function OeuvresManagementDetailedSupport() {
  const { handleModalInstall } = useOutletContext();
  const { support } = useParams();
  const supportId = parseInt(support.split(":")[1], 10);

  const [isModifying, setIsModifying] = useState(false);

  const [tPageText, tSupports] = tranlationInstance(
    "pageText:OeuvresManagement.OMDetailedSupport",
    "supports"
  );

  const getDetailedSupportFromDb = async () => {
    const url = `api/supports/adminOneDetailed/${supportId}`;
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const { data } = useSuspenseQuery({
    queryKey: ["supports", { type: "singleWithDetails", supportId }],
    queryFn: getDetailedSupportFromDb,
    throwOnError: true,
  });

  const handleDeleteSupportBtnClick = () => {
    return handleModalInstall(
      {
        type: "confirmation",
        message: "deleteSupportConfirmation",
        infoData: {
          insertText1: supportId,
        },
        confirmationData: {
          case: "confirmOperation",
          operationData: { id: supportId },
        },
      },
      "popUpContent:OeuvresManagement."
    );
  };

  return (
    <div className="OeuvresManagementDetailedSupport">
      {isModifying ? (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementModifySupport
            supportData={data}
            setIsModifying={setIsModifying}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementDetailedAttribute
            attributeData={data}
            attribute="technique"
            tAttributePageText={tPageText}
            tAttribute={tSupports}
            setIsModifying={setIsModifying}
            handleDeleteBtnClick={handleDeleteSupportBtnClick}
          />
        </Suspense>
      )}

      <button type="button" onClick={() => setIsModifying(!isModifying)}>
        {isModifying ? tPageText("return") : tPageText("modifyBtn")}
      </button>
    </div>
  );
}
