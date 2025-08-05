import { useSuspenseQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Suspense } from "react";

import axiosInstance from "../../services/axiosInstance";
// import ModifyOeuvre from "./ModifyOeuvre";
import OeuvresManagementDetailedOeuvre from "./OeuvresManagementDetailedOeuvre";
import tranlationInstance from "../../services/translationInstance";
import filterObject from "../../services/objectMethods/filterObject";

import OeuvresManagementModifyOeuvre from "./OeuvresManagementModifyOeuvre";

// todo : call mutation and formmethods here by sending handlemodalinstall in context
export default function OeuvresManagementOeuvreInfo() {
  const tPageText = tranlationInstance(
    "pageText:OeuvresManagement.OMOeuvreInfo"
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

  const defaultValues = {};
  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  });
  const formDirtyFields = formMethods.formState.dirtyFields;
  const isKeyDirtyField = (key) => {
    if (formDirtyFields[key]) {
      return true;
    }
    return false;
  };

  const handleSubmitForm = (formData) => {
    const [returnedData] = filterObject(formData, isKeyDirtyField);

    return returnedData;
  };

  const handleModifyBtnClick = () => {
    setIsModifying(!isModifying);
  };

  return (
    <>
      <div>
        <Suspense fallback={<h1>Loading...</h1>}>
          {!isModifying ? (
            <OeuvresManagementDetailedOeuvre oeuvreData={data} />
          ) : (
            <OeuvresManagementModifyOeuvre
              mutation={null}
              formMethods={formMethods}
              onSubmit={handleSubmitForm}
              isModifying
            />
          )}
        </Suspense>
      </div>
      <button type="button" onClick={handleModifyBtnClick}>
        {isModifying
          ? tPageText("modifyBtnReturn")
          : tPageText("modifyBtnModify")}
      </button>
    </>
  );
}
