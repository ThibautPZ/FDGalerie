import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import tranlationInstance from "../../services/translationInstance";

export default function CreateFamilyForm({
  createFamilyMutation,
  createFamilyFormMethods,
}) {
  const t = tranlationInstance("");

  const outletContext = useOutletContext();

  const mutation = createFamilyMutation || outletContext.createFamilyMutation;
  const formMethods =
    createFamilyFormMethods || outletContext.createFamilyFormMethods;

  const formFields = [
    {
      name: "familyName",
      label: {
        namespace: "pageText:shared.CreateFamily.familyName",
        placeHolder: t("pageText:shared.CreateFamily.familyNamePH"),
      },
      input: "text",
    },
    {
      name: "familyDescription",
      label: {
        namespace: "pageText:shared.CreateFamily.familyDescription",
        placeHolder: t("pageText:shared.CreateFamily.familyDescriptionPH"),
      },
      input: "text",
    },
  ];

  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <FormCore
        className="CreateFamilyForm"
        mutation={mutation}
        formMethods={formMethods}
        addedValues={null}
        asyncValues={null}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={t(
          "pageText:shared.CreateFamily.createNewFamilyBtnText"
        )}
      />
    </div>
  );
}
