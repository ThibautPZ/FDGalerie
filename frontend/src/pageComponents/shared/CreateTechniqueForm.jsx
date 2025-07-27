import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import tranlationInstance from "../../services/translationInstance";

export default function CreateTechniqueForm({
  createTechniqueMutation,
  createTechniqueFormMethods,
}) {
  const t = tranlationInstance("");

  const outletContext = useOutletContext();

  const mutation =
    createTechniqueMutation || outletContext.createTechniqueMutation;
  const formMethods =
    createTechniqueFormMethods || outletContext.createTechniqueFormMethods;

  const formFields = [
    {
      name: "techniqueNameFr",
      label: {
        namespace: "pageText:shared.CreateTechnique.techniqueNameFr",
        placeHolder: t("pageText:shared.CreateTechnique.techniqueNameFrPH"),
      },
      input: "text",
    },
    {
      name: "techniqueNameEnUS",
      label: {
        namespace: "pageText:shared.CreateTechnique.techniqueNameEnUS",
        placeHolder: t("pageText:shared.CreateTechnique.techniqueNameEnUSPH"),
      },
      input: "text",
    },
    {
      name: "techniqueNameEnGB",
      label: {
        namespace: "pageText:shared.CreateTechnique.techniqueNameEnGB",
        placeHolder: t("pageText:shared.CreateTechnique.techniqueNameEnGBPH"),
      },
      input: "text",
    },
  ];

  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <FormCore
        className="CreateTechniqueForm"
        mutation={mutation}
        formMethods={formMethods}
        addedValues={null}
        asyncValues={null}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={t(
          "pageText:shared.CreateTechnique.createNewTechniqueBtnText"
        )}
      />
    </div>
  );
}
