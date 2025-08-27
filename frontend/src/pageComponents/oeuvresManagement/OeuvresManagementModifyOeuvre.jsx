import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";

import UseModifyOeuvre from "../../hooks/RQmutation/UseModifyOeuvre";
import {
  isArrayNotEmpty,
  isObjectNotEmpty,
} from "../../services/typesAndValidationChecks";
import OeuvresManagementCreateOeuvreForm from "./OeuvresManagementCreateOeuvreForm";

export default function OeuvresManagementModifyOeuvre({
  oeuvreData,
  translations,
}) {
  const { tCommon, tTechniques, tSupports, tFormats, tFamilies } = translations;

  const { handleModalInstall, setIsModifying } = useOutletContext();

  const {
    id,
    title,
    width,
    height,
    techniques,
    support,
    supportId,
    format,
    formatId,
    family,
    familyId,
    artistCommentFr,
    artistCommentEnUS,
    artistCommentEnGB,
    oeuvreAvailability,
    availabilityName,
    publiclyVisible,
    fileName,
    fileExtension,
    gift = {},
    sale = {},
    reservation = {},
  } = oeuvreData;

  const giveSelectOption = (value, label, t) => {
    if (!value) {
      return null;
    }
    return { value, label: t(`${label}.name`) };
  };

  const defaultFile =
    fileName && fileExtension
      ? { name: fileName, extension: fileExtension }
      : null;

  const defaultTechniques = isArrayNotEmpty(techniques)
    ? techniques.map((technique) =>
        giveSelectOption(technique.id, technique.name, tTechniques)
      )
    : [];

  const defaultSupport = giveSelectOption(supportId, support, tSupports);
  const defaultFormat = giveSelectOption(formatId, format, tFormats);
  const defaultFamily = giveSelectOption(familyId, family, tFamilies);
  const defaultAvailability = {
    value: oeuvreAvailability,
    label: tCommon(`oeuvreAvailability.${availabilityName}`),
  };

  const defaultValues = {
    oeuvreFileDefaultFile: defaultFile,
    oeuvreFile: [],
    oeuvreFileDeleteFile: false,
    oeuvreTitle: title || "",
    oeuvreTechnique: defaultTechniques,
    oeuvreSupport: defaultSupport,
    oeuvreFormat: defaultFormat,
    oeuvreWidth: width.toString(10),
    oeuvreHeight: height.toString(10),
    oeuvreFamily: defaultFamily,
    artistCommentFr: artistCommentFr || "",
    artistCommentEnUS: artistCommentEnUS || "",
    artistCommentEnGB: artistCommentEnGB || "",
    oeuvreAvailability: defaultAvailability,
    oeuvreGivenToFirstname: gift.firstName || "",
    oeuvreGivenToLastname: gift.lastName || "",
    oeuvreGivenToSelection: isObjectNotEmpty(gift)
      ? { contactId: gift.contactId, userId: gift.userId }
      : null,
    oeuvreGivenToKnownPerson: isObjectNotEmpty(gift)
      ? { contactId: gift.contactId, userId: gift.userId }
      : null,
    giftDate: gift.date ? new Date(gift.date) : null,
    giftNote: gift.note || "",
    oeuvreSoldToFirstname: sale.firstName || "",
    oeuvreSoldToLastname: sale.lastName || "",
    oeuvreSoldToSelection: isObjectNotEmpty(sale)
      ? { contactId: sale.contactId, userId: sale.userId }
      : null,
    oeuvreSoldToKnownPerson: isObjectNotEmpty(sale)
      ? {
          contactId: sale.contactId,
          userId: sale.userId,
        }
      : null,
    saleDate: sale.date ? new Date(sale.date) : null,
    salePrice: sale.price || "",
    saleNote: sale.note || "",
    oeuvreReservedToFirstname: reservation.firstName || "",
    oeuvreReservedToLastname: reservation.lastName || "",
    oeuvreReservedToSelection: isObjectNotEmpty(reservation)
      ? {
          contactId: reservation.contactId,
          userId: reservation.userId,
        }
      : null,
    oeuvreReservedToKnownPerson: isObjectNotEmpty(reservation)
      ? {
          contactId: reservation.contactId,
          userId: reservation.userId,
        }
      : null,
    reservationDate: reservation.date ? new Date(reservation.date) : null,
    reservationPrice: reservation.price || "",
    reservationNote: reservation.note || "",
    oeuvreVisibility: !!publiclyVisible,
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

  const modifyOeuvreMutation = UseModifyOeuvre(id, handleModalInstall);

  return (
    <OeuvresManagementCreateOeuvreForm
      mutation={modifyOeuvreMutation}
      formMethods={formMethods}
      onSubmit={handleSubmitForm}
      onSuccess={() => setIsModifying(false)}
      isFormModifying
    />
  );
}
