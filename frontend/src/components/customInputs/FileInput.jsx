import { useFormContext } from "react-hook-form";
import {
  isArrayNotEmpty,
  isStringNotEmpty,
} from "../../services/typesAndValidationChecks";

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
  fieldName,
  registerOptions,
  // asyncValues,
  uploadOptions,
  error,
  t,
}) {
  const { fileTypes } = uploadOptions;
  const { register } = useFormContext();
  const labelNs = label?.namespace || `common:info.${fieldName}`;

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

  const registeredField = register(fieldName, registerOptions);

  return (
    <div hidden={isHidden} className={fieldName}>
      <label htmlFor={fieldName}>{t(`${labelNs}`)}</label>

      <input
        type="file"
        accept={accept}
        placeholder={label?.placeHolder}
        onChange={registeredField.onChange}
        name={registeredField.name}
        ref={registeredField.ref}
        aria-invalid={error ? "true" : "false"}
      />
    </div>
  );
}

export default FileInput;
