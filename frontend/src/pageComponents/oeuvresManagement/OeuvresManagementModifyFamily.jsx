import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";

import UseModifyFamily from "../../hooks/RQmutation/UseModifyFamily";
import tranlationInstance from "../../services/translationInstance";
import FamilyForm from "../shared/FamilyForm";

export default function OeuvresManagementModifyFamily({
  familyData,
  setIsModifying,
}) {
  const { handleModalInstall } = useOutletContext();
  const i18n = tranlationInstance("i18n");

  const { id, name, descriptionFr, descriptionEnUS, descriptionEnGB } =
    familyData;

  const defaultValues = {
    familyName: name || "",
    familyDescriptionFr: descriptionFr || "",
    familyDescriptionEnUS: descriptionEnUS || "",
    familyDescriptionEnGB: descriptionEnGB || "",
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

  const modifyFamilyMutation = UseModifyFamily(id, handleModalInstall, i18n);

  return (
    <FamilyForm
      mutation={modifyFamilyMutation}
      formMethods={formMethods}
      onSubmit={handleSubmitForm}
      onSuccess={() => setIsModifying(false)}
      isFormModifying
    />
  );
}
