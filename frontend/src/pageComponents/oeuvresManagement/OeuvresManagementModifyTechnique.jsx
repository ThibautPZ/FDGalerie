import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";

import UseModifyTechnique from "../../hooks/RQmutation/UseModifyTechnique";
import TechniqueForm from "../shared/TechniqueForm";
import tranlationInstance from "../../services/translationInstance";

export default function OeuvresManagementModifyTechnique({
  techniqueData,
  setIsModifying,
}) {
  const { handleModalInstall } = useOutletContext();
  const i18n = tranlationInstance("i18n");

  const {
    id,
    nameFr,
    nameEnUS,
    nameEnGB,
    descriptionFr,
    descriptionEnUS,
    descriptionEnGB,
  } = techniqueData;

  const defaultValues = {
    techniqueNameFr: nameFr || "",
    techniqueNameEnUS: nameEnUS || "",
    techniqueNameEnGB: nameEnGB || "",
    techniqueDescriptionFr: descriptionFr || "",
    techniqueDescriptionEnUS: descriptionEnUS || "",
    techniqueDescriptionEnGB: descriptionEnGB || "",
  };

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: false,
  });
  const formDirtyFields = formMethods.formState.dirtyFields;

  const handleSubmitForm = (formData) => {
    const returnedData = { ...formData, modifiedFields: formDirtyFields };

    return returnedData;
  };

  const modifyTechniqueMutation = UseModifyTechnique(
    id,
    handleModalInstall,
    i18n
  );

  return (
    <TechniqueForm
      mutation={modifyTechniqueMutation}
      formMethods={formMethods}
      onSubmit={handleSubmitForm}
      onSuccess={() => setIsModifying(false)}
      isFormModifying
    />
  );
}
