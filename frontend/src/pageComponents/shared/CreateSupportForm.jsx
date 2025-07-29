import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import tranlationInstance from "../../services/translationInstance";

export default function CreateSupportForm({
  createSupportMutation,
  createSupportFormMethods,
}) {
  const t = tranlationInstance("");

  const outletContext = useOutletContext();

  const mutation = createSupportMutation || outletContext.createSupportMutation;
  const formMethods =
    createSupportFormMethods || outletContext.createSupportFormMethods;

  const formFields = [
    {
      name: "supportNameFr",
      label: {
        namespace: "pageText:shared.CreateSupport.supportNameFr",
        placeHolder: t("pageText:shared.CreateSupport.supportNameFrPH"),
      },
      input: "text",
    },
    {
      name: "supportNameEnUS",
      label: {
        namespace: "pageText:shared.CreateSupport.supportNameEnUS",
        placeHolder: t("pageText:shared.CreateSupport.supportNameEnUSPH"),
      },
      input: "text",
    },
    {
      name: "supportNameEnGB",
      label: {
        namespace: "pageText:shared.CreateSupport.supportNameEnGB",
        placeHolder: t("pageText:shared.CreateSupport.supportNameEnGBPH"),
      },
      input: "text",
    },
    {
      name: "supportDescriptionFr",
      label: {
        namespace: "pageText:shared.CreateSupport.supportDescriptionFr",
        placeHolder: t("pageText:shared.CreateSupport.supportDescriptionFrPH"),
      },
      input: "text",
    },
    {
      name: "supportDescriptionEnUS",
      label: {
        namespace: "pageText:shared.CreateSupport.supportDescriptionEnUS",
        placeHolder: t(
          "pageText:shared.CreateSupport.supportDescriptionEnUSPH"
        ),
      },
      input: "text",
    },
    {
      name: "supportDescriptionEnGB",
      label: {
        namespace: "pageText:shared.CreateSupport.supportDescriptionEnGB",
        placeHolder: t(
          "pageText:shared.CreateSupport.supportDescriptionEnGBPH"
        ),
      },
      input: "text",
    },
  ];

  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <FormCore
        className="CreateSupportForm"
        mutation={mutation}
        formMethods={formMethods}
        addedValues={null}
        asyncValues={null}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={t(
          "pageText:shared.CreateSupport.createNewSupportBtnText"
        )}
      />
    </div>
  );
}
