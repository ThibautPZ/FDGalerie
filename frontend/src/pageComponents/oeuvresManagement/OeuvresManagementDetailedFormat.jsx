import { Suspense, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../services/axiosInstance";
import OeuvresManagementDetailedAttribute from "./OeuvresManagementDetailedAttribute";
import tranlationInstance from "../../services/translationInstance";
import OeuvresManagementModifyFormat from "./OeuvresManagementModifyFormat";

export default function OeuvresManagementDetailedFormat() {
  const { handleModalInstall } = useOutletContext();
  const { format } = useParams();
  const formatId = parseInt(format.split(":")[1], 10);

  const [isModifying, setIsModifying] = useState(false);

  const [tPageText, tFormats] = tranlationInstance(
    "pageText:OeuvresManagement.OMDetailedFormat",
    "paintingSizes"
  );

  const getDetailedFormatFromDb = async () => {
    const url = `api/paintingSizes/adminOneDetailed/${formatId}`;
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const { data } = useQuery({
    queryKey: ["paintingSizes", { type: "singleWithDetails", formatId }],
    queryFn: getDetailedFormatFromDb,
    throwOnError: true,
  });

  const handleDeleteFormatBtnClick = () => {
    return handleModalInstall(
      {
        type: "confirmation",
        message: "deleteFormatConfirmation",
        infoData: {
          insertText1: formatId,
        },
        confirmationData: {
          case: "confirmOperation",
          operationData: { id: formatId },
        },
      },
      "popUpContent:OeuvresManagement."
    );
  };

  return (
    <div className="OeuvresManagementDetailedFormat">
      {isModifying ? (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementModifyFormat
            formatData={data}
            setIsModifying={setIsModifying}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<h1>Loading...</h1>}>
          <OeuvresManagementDetailedAttribute
            attributeData={data}
            attribute="format"
            tAttributePageText={tPageText}
            tAttribute={tFormats}
            setIsModifying={setIsModifying}
            handleDeleteBtnClick={handleDeleteFormatBtnClick}
          />
        </Suspense>
      )}

      <button type="button" onClick={() => setIsModifying(!isModifying)}>
        {isModifying ? tPageText("return") : tPageText("modifyBtn")}
      </button>
    </div>
  );
}
