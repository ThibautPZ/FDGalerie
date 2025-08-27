import { useFormContext } from "react-hook-form";
import FieldResetButton from "../customComponents/FieldResetButton";

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
function CheckboxInput({
  label,
  isHidden,
  isDisabled,
  fieldName,
  registerOptions,
  isFormModifying,
  // asyncValues,
  error,
  t,
}) {
  const { register, formState, resetField } = useFormContext();
  const { onChange, name, ref } = register(fieldName, registerOptions);
  const labelNs = label?.namespace || `common:info.${fieldName}`;

  const isResetButtonHidden =
    !isFormModifying || !formState.dirtyFields[fieldName];

  return (
    <fieldset hidden={isHidden} disabled={isDisabled} className={fieldName}>
      {label ? <label htmlFor={fieldName}>{t(`${labelNs}`)}</label> : ""}

      <input
        type="checkbox"
        onChange={onChange}
        name={name}
        ref={ref}
        aria-invalid={error ? "true" : "false"}
      />
      <FieldResetButton
        onClick={() => resetField(fieldName)}
        isHidden={isResetButtonHidden}
      />
    </fieldset>
  );
}

export default CheckboxInput;
