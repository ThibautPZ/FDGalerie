import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  isArrayNotEmpty,
  isObjectNotEmpty,
  isStringNotEmpty,
  isBoolean,
} from "../../services/typesAndValidationChecks";
import PaintingThumbLg from "../image/PaintingThumbLg";
import FieldResetButton from "../customComponents/FieldResetButton";
import FieldEraseButton from "../customComponents/FieldEraseButton";

/**
 * Renders a text input component with its label to display in a FormCore form.
 * @component
 * @param {Object} props - Component props
 * @param {{namespace: string, count: ?string}}  [props.label] - Object containing label text and or name of watched text input
 * @param {string} props.fieldName - Field name in RHF
 * @param {*} [props.defaultValue] - Input default value
 * @param {{name: string, onChange: function, onBlur: function, ref: function}} props.register - Object containing RHF register tools
 * @param {{type: string, message: string, ref: Object}} props.error - Object containing errors due to form registerOptions
 * @param {function} [props.watch] - Function which returns a specified form field value
 * @param {number} [props.maxLength] - Number of max characters in a text input
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered text input with label.
 */
function FileInput({
  label,
  isHidden,
  isDisabled,
  fieldName,
  registerOptions,
  // asyncValues,
  uploadOptions,
  isFormModifying,
  error,
  t,
}) {
  const { fileTypes } = uploadOptions;
  const { register, watch, resetField, setValue, formState } = useFormContext();
  const labelNs = label?.namespace || `common:info.${fieldName}`;
  const newNs = label?.newNamespace || `common:info.${fieldName}`;
  const modifyNs = label?.modifyNamespace || `common:info.${fieldName}`;
  const noFileNs = label?.noFileNamespace || `common:info.noSelectedFile`;
  const [objectUrl, setObjectUrl] = useState(null);

  const acceptedImageExtensions =
    "image/png, image/jpeg, image/jpg, image/webp";
  const acceptedVideoExtensions = "video/mp4, video/MOV, video/AVI, video/WMF";

  const populateExtensionsList = (fileTypeStr, listArray) => {
    if (fileTypeStr === "image") {
      return listArray.push(acceptedImageExtensions);
    }
    if (fileTypeStr === "video") {
      return listArray.push(acceptedVideoExtensions);
    }
    return null;
  };

  const giveInputAccept = () => {
    const textArray = [];
    if (isStringNotEmpty(fileTypes)) {
      populateExtensionsList(fileTypes, textArray);
    }
    if (isArrayNotEmpty(fileTypes)) {
      fileTypes.forEach((type) => populateExtensionsList(type, textArray));
    }
    return textArray.join(", ");
  };

  const accept = giveInputAccept();

  const defaultFileFieldName = `${fieldName}DefaultFile`;
  const defaultFile = formState.defaultValues[defaultFileFieldName];
  const isDefaultFile = isObjectNotEmpty(defaultFile);
  const deleteFileFieldName = `${fieldName}DeleteFile`;
  const deleteFile = formState.defaultValues[deleteFileFieldName];
  const isDeleteFileNeeded = isBoolean(deleteFile) && defaultFile;
  if (isDeleteFileNeeded) {
    register(deleteFileFieldName);
  }
  const registeredField = register(fieldName, {
    ...registerOptions,
    onChange: () => {
      if (isDeleteFileNeeded) {
        setValue(deleteFileFieldName, false);
      }
    },
  });
  const fileValue = watch(fieldName);

  const giveDisplayedFile = () => {
    const isNewFile = fileValue?.length;

    const isFileDeleted = !!watch(deleteFileFieldName);

    if (isFileDeleted) {
      return "noFile";
    }
    if (isNewFile) {
      return "newFile";
    }
    if (isDefaultFile) {
      return "defaultFile";
    }
    return "noFile";
  };
  const giveFileLabel = () => {
    if (giveDisplayedFile() === "noFile") {
      return t(newNs);
    }
    return t(modifyNs);
  };

  const resetFile = () => {
    resetField(fieldName);
    if (isDeleteFileNeeded) {
      setValue(deleteFileFieldName, false);
    }
  };

  const eraseFile = () => {
    setValue(fieldName, []);
    if (isDeleteFileNeeded) {
      setValue(deleteFileFieldName, true);
    }
  };

  useEffect(() => {
    if (giveDisplayedFile() === "newFile") {
      const objUrl = URL.createObjectURL(fileValue[0]);
      setObjectUrl(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    }
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileValue]);

  return (
    <div hidden={isHidden} className={fieldName}>
      <p>{t(labelNs)}</p>
      <label htmlFor={fieldName}>{giveFileLabel()}</label>
      <input
        type="file"
        id={fieldName}
        hidden
        disabled={isDisabled}
        accept={accept}
        placeholder={label?.placeHolder}
        onChange={registeredField.onChange}
        name={registeredField.name}
        ref={registeredField.ref}
        aria-invalid={error ? "true" : "false"}
      />
      {giveDisplayedFile() === "newFile" ? (
        <>
          <img src={objectUrl} alt="preview" />
          <FieldResetButton
            onClick={() => resetField(fieldName)}
            isHidden={!isFormModifying}
          />
          <FieldEraseButton onClick={eraseFile} />
        </>
      ) : null}
      {giveDisplayedFile() === "defaultFile" ? (
        <>
          <PaintingThumbLg fileName={defaultFile.name} />
          <FieldEraseButton onClick={eraseFile} />
        </>
      ) : null}
      {giveDisplayedFile() === "noFile" ? (
        <>
          <p>{t(noFileNs)}</p>
          <FieldResetButton
            onClick={resetFile}
            isHidden={!(isFormModifying && isDefaultFile)}
          />
        </>
      ) : null}
    </div>
  );
}

export default FileInput;
