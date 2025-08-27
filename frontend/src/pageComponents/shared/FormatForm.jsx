import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import tranlationInstance from "../../services/translationInstance";

export default function FormatForm({
  mutation,
  formMethods,
  onSubmit,
  onSuccess,
  isFormModifying = false,
}) {
  const tPageText = tranlationInstance("pageText:shared.FormatForm");

  const outletContext = useOutletContext();

  const formatMutation = mutation || outletContext.createFormatMutation;
  const formatFormMethods =
    formMethods || outletContext.createFormatFormMethods;

  const formFields = [
    {
      name: "paintingSizeNameFr",
      label: {
        namespace: "pageText:shared.FormatForm.paintingSizeNameFr",
        placeHolder: tPageText("paintingSizeNameFrPH"),
      },
      input: "text",
    },
    {
      name: "paintingSizeNameEnUS",
      label: {
        namespace: "pageText:shared.FormatForm.paintingSizeNameEnUS",
        placeHolder: tPageText("paintingSizeNameEnUSPH"),
      },
      input: "text",
    },
    {
      name: "paintingSizeNameEnGB",
      label: {
        namespace: "pageText:shared.FormatForm.paintingSizeNameEnGB",
        placeHolder: tPageText("paintingSizeNameEnGBPH"),
      },
      input: "text",
    },
    {
      name: "paintingSizeDescriptionFr",
      label: {
        namespace: "pageText:shared.FormatForm.paintingSizeDescriptionFr",
        placeHolder: tPageText("paintingSizeDescriptionFrPH"),
      },
      input: "text",
    },
    {
      name: "paintingSizeDescriptionEnUS",
      label: {
        namespace: "pageText:shared.FormatForm.paintingSizeDescriptionEnUS",
        placeHolder: tPageText("paintingSizeDescriptionEnUSPH"),
      },
      input: "text",
    },
    {
      name: "paintingSizeDescriptionEnGB",
      label: {
        namespace: "pageText:shared.FormatForm.paintingSizeDescriptionEnGB",
        placeHolder: tPageText("paintingSizeDescriptionEnGBPH"),
      },
      input: "text",
    },
  ];
  return (
    <div className="OeuvresManagementFormatForm">
      <FormCore
        className="FormatForm"
        mutation={formatMutation}
        formMethods={formatFormMethods}
        addedValues={null}
        asyncValues={null}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={
          isFormModifying
            ? tPageText("modifyFormatBtnText")
            : tPageText("createFormatBtnText")
        }
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        isFormModifying={isFormModifying}
      />
    </div>
  );
}
