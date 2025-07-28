import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import tranlationInstance from "../../services/translationInstance";

export default function CreateFormatForm({
  createFormatMutation,
  createFormatFormMethods,
}) {
  const t = tranlationInstance("");
  const outletContext = useOutletContext();

  const mutation = createFormatMutation || outletContext.createFormatMutation;
  const formMethods =
    createFormatFormMethods || outletContext.createFormatFormMethods;

  const formFields = [
    {
      name: "paintingSizeNameFr",
      label: {
        namespace: "pageText:shared.CreateFormat.paintingSizeNameFr",
        placeHolder: t("pageText:shared.CreateFormat.paintingSizeNameFrPH"),
      },
      input: "text",
    },
    {
      name: "paintingSizeNameEnUS",
      label: {
        namespace: "pageText:shared.CreateFormat.paintingSizeNameEnUS",
        placeHolder: t("pageText:shared.CreateFormat.paintingSizeNameEnUSPH"),
      },
      input: "text",
    },
    {
      name: "paintingSizeNameEnGB",
      label: {
        namespace: "pageText:shared.CreateFormat.paintingSizeNameEnGB",
        placeHolder: t("pageText:shared.CreateFormat.paintingSizeNameEnGBPH"),
      },
      input: "text",
    },
    {
      name: "paintingSizeDescriptionFr",
      label: {
        namespace: "pageText:shared.CreateFormat.paintingSizeDescriptionFr",
        placeHolder: t(
          "pageText:shared.CreateFormat.paintingSizeDescriptionFrPH"
        ),
      },
      input: "text",
    },
    {
      name: "paintingSizeDescriptionEnUS",
      label: {
        namespace: "pageText:shared.CreateFormat.paintingSizeDescriptionEnUS",
        placeHolder: t(
          "pageText:shared.CreateFormat.paintingSizeDescriptionEnUSPH"
        ),
      },
      input: "text",
    },
    {
      name: "paintingSizeDescriptionEnGB",
      label: {
        namespace: "pageText:shared.CreateFormat.paintingSizeDescriptionEnGB",
        placeHolder: t(
          "pageText:shared.CreateFormat.paintingSizeDescriptionEnGBPH"
        ),
      },
      input: "text",
    },
  ];
  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <FormCore
        className="CreateFormatForm"
        mutation={mutation}
        formMethods={formMethods}
        addedValues={null}
        asyncValues={null}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={t(
          "pageText:shared.CreateFormat.createNewFormatBtnText"
        )}
      />
    </div>
  );
}
