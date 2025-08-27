import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import tranlationInstance from "../../services/translationInstance";

export default function TechniqueForm({
  mutation,
  formMethods,
  onSubmit,
  onSuccess,
  isFormModifying = false,
}) {
  const tPageText = tranlationInstance("pageText:shared.TechniqueForm");

  const outletContext = useOutletContext();

  const techniqueMutation = mutation || outletContext.createTechniqueMutation;
  const techniqueFormMethods =
    formMethods || outletContext.createTechniqueFormMethods;

  const formFields = [
    {
      name: "techniqueNameFr",
      label: {
        namespace: "pageText:shared.TechniqueForm.techniqueNameFr",
        placeHolder: tPageText("techniqueNameFrPH"),
      },
      input: "text",
    },
    {
      name: "techniqueNameEnUS",
      label: {
        namespace: "pageText:shared.TechniqueForm.techniqueNameEnUS",
        placeHolder: tPageText("techniqueNameEnUSPH"),
      },
      input: "text",
    },
    {
      name: "techniqueNameEnGB",
      label: {
        namespace: "pageText:shared.TechniqueForm.techniqueNameEnGB",
        placeHolder: tPageText("techniqueNameEnGBPH"),
      },
      input: "text",
    },
    {
      name: "techniqueDescriptionFr",
      label: {
        namespace: "pageText:shared.TechniqueForm.techniqueDescriptionFr",
        placeHolder: tPageText("techniqueDescriptionFrPH"),
      },
      input: "text",
    },
    {
      name: "techniqueDescriptionEnUS",
      label: {
        namespace: "pageText:shared.TechniqueForm.techniqueDescriptionEnUS",
        placeHolder: tPageText("techniqueDescriptionEnUSPH"),
      },
      input: "text",
    },
    {
      name: "techniqueDescriptionEnGB",
      label: {
        namespace: "pageText:shared.TechniqueForm.techniqueDescriptionEnGB",
        placeHolder: tPageText("techniqueDescriptionEnGBPH"),
      },
      input: "text",
    },
  ];

  return (
    <div className="OeuvresManagementTechniqueForm">
      <FormCore
        className="TechniqueForm"
        mutation={techniqueMutation}
        formMethods={techniqueFormMethods}
        addedValues={null}
        asyncValues={null}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={
          isFormModifying
            ? tPageText("modifyTechniqueBtnText")
            : tPageText("createTechniqueBtnText")
        }
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        isFormModifying={isFormModifying}
      />
    </div>
  );
}
