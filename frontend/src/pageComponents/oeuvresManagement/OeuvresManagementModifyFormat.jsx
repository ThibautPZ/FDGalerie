import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";

import UseModifyFormat from "../../hooks/RQmutation/UseModifyFormat";
import tranlationInstance from "../../services/translationInstance";
import FormatForm from "../shared/FormatForm";

export default function OeuvresManagementModifyFormat({
  formatData,
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
  } = formatData;

  const defaultValues = {
    paintingSizeNameFr: nameFr || "",
    paintingSizeNameEnUS: nameEnUS || "",
    paintingSizeNameEnGB: nameEnGB || "",
    paintingSizeDescriptionFr: descriptionFr || "",
    paintingSizeDescriptionEnUS: descriptionEnUS || "",
    paintingSizeDescriptionEnGB: descriptionEnGB || "",
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

  const modifyFormatMutation = UseModifyFormat(id, handleModalInstall, i18n);

  return (
    <FormatForm
      mutation={modifyFormatMutation}
      formMethods={formMethods}
      onSubmit={handleSubmitForm}
      onSuccess={() => setIsModifying(false)}
      isFormModifying
    />
  );
}
