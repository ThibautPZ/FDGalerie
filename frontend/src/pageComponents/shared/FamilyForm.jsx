import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import tranlationInstance from "../../services/translationInstance";

export default function FamilyForm({
  mutation,
  formMethods,
  onSubmit,
  onSuccess,
  isFormModifying = false,
}) {
  const tPageText = tranlationInstance("pageText:shared.FamilyForm");

  const outletContext = useOutletContext();

  const familyMutation = mutation || outletContext.createFamilyMutation;
  const familyFormMethods =
    formMethods || outletContext.createFamilyFormMethods;

  const formFields = [
    {
      name: "familyName",
      label: {
        namespace: "pageText:shared.FamilyForm.familyName",
        placeHolder: tPageText("familyNamePH"),
      },
      input: "text",
    },
    {
      name: "familyDescriptionFr",
      label: {
        namespace: "pageText:shared.FamilyForm.familyDescriptionFr",
        placeHolder: tPageText("familyDescriptionFrPH"),
      },
      input: "text",
    },
    {
      name: "familyDescriptionEnUS",
      label: {
        namespace: "pageText:shared.FamilyForm.familyDescriptionEnUS",
        placeHolder: tPageText("familyDescriptionEnUSPH"),
      },
      input: "text",
    },
    {
      name: "familyDescriptionEnGB",
      label: {
        namespace: "pageText:shared.FamilyForm.familyDescriptionEnGB",
        placeHolder: tPageText("familyDescriptionEnGBPH"),
      },
      input: "text",
    },
  ];

  return (
    <div className="OeuvresManagementFamilyForm">
      <FormCore
        className="FamilyForm"
        mutation={familyMutation}
        formMethods={familyFormMethods}
        addedValues={null}
        asyncValues={null}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={
          isFormModifying
            ? tPageText("modifyFamilyBtnText")
            : tPageText("createFamilyBtnText")
        }
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        isFormModifying={isFormModifying}
      />
    </div>
  );
}
