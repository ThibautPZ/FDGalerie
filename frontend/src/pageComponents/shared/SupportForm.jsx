import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import tranlationInstance from "../../services/translationInstance";

export default function SupportForm({
  mutation,
  formMethods,
  onSubmit,
  onSuccess,
  isFormModifying = false,
}) {
  const tPageText = tranlationInstance("pageText:shared.SupportForm");

  const outletContext = useOutletContext();

  const supportMutation = mutation || outletContext.createSupportMutation;
  const supportFormMethods =
    formMethods || outletContext.createSupportFormMethods;

  const formFields = [
    {
      name: "supportNameFr",
      label: {
        namespace: "pageText:shared.SupportForm.supportNameFr",
        placeHolder: tPageText("supportNameFrPH"),
      },
      input: "text",
    },
    {
      name: "supportNameEnUS",
      label: {
        namespace: "pageText:shared.SupportForm.supportNameEnUS",
        placeHolder: tPageText("supportNameEnUSPH"),
      },
      input: "text",
    },
    {
      name: "supportNameEnGB",
      label: {
        namespace: "pageText:shared.SupportForm.supportNameEnGB",
        placeHolder: tPageText("supportNameEnGBPH"),
      },
      input: "text",
    },
    {
      name: "supportDescriptionFr",
      label: {
        namespace: "pageText:shared.SupportForm.supportDescriptionFr",
        placeHolder: tPageText("supportDescriptionFrPH"),
      },
      input: "text",
    },
    {
      name: "supportDescriptionEnUS",
      label: {
        namespace: "pageText:shared.SupportForm.supportDescriptionEnUS",
        placeHolder: tPageText("supportDescriptionEnUSPH"),
      },
      input: "text",
    },
    {
      name: "supportDescriptionEnGB",
      label: {
        namespace: "pageText:shared.SupportForm.supportDescriptionEnGB",
        placeHolder: tPageText("supportDescriptionEnGBPH"),
      },
      input: "text",
    },
  ];

  return (
    <div className="OeuvresManagementSupportForm">
      <FormCore
        className="SupportForm"
        mutation={supportMutation}
        formMethods={supportFormMethods}
        addedValues={null}
        asyncValues={null}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={
          isFormModifying
            ? tPageText("modifySupportBtnText")
            : tPageText("createSupportBtnText")
        }
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        isFormModifying={isFormModifying}
      />
    </div>
  );
}
