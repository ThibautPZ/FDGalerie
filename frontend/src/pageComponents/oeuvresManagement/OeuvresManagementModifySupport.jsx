import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";

import UseModifySupport from "../../hooks/RQmutation/UseModifySupport";
import tranlationInstance from "../../services/translationInstance";
import SupportForm from "../shared/SupportForm";

export default function OeuvresManagementModifySupport({
  supportData,
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
  } = supportData;

  const defaultValues = {
    supportNameFr: nameFr || "",
    supportNameEnUS: nameEnUS || "",
    supportNameEnGB: nameEnGB || "",
    supportDescriptionFr: descriptionFr || "",
    supportDescriptionEnUS: descriptionEnUS || "",
    supportDescriptionEnGB: descriptionEnGB || "",
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

  const modifySupportMutation = UseModifySupport(id, handleModalInstall, i18n);

  return (
    <SupportForm
      mutation={modifySupportMutation}
      formMethods={formMethods}
      onSubmit={handleSubmitForm}
      onSuccess={() => setIsModifying(false)}
      isFormModifying
    />
  );
}
