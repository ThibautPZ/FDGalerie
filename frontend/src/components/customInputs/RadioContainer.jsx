import { useFormContext } from "react-hook-form";

import FieldResetButton from "../customComponents/FieldResetButton";
import FieldEraseButton from "../customComponents/FieldEraseButton";

/**
 * Renders a radio inputs container with its label to display in a FormCore form.
 * @component
 * @param {Object} props - Component props
 * @param {string} props.fieldName - Field name in RHF
 * @param {Array.<{key: (string|number), value: (string|number), defaultValue:boolean}>} props.options - Array containing objects with RadioInput data
 * @param {*} [props.defaultValue] - Input default value
 * @param {{name: string, onChange: function, onBlur: function, ref: function}} props.register - Object containing RHF register tools
 * @param {{type: string, message: string, ref: Object}} props.error - Object containing errors due to form registerOptions
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered radio container with a label with each radio input.
 */
function RadioContainer({
  fieldName,
  label,
  isHidden,
  isDisabled,
  options,
  registerOptions,
  // asyncValues,
  isFormModifying,
  error,
  t,
}) {
  const { register, formState, resetField, setValue, watch } = useFormContext();

  const giveFieldKey = (option) => {
    return `${fieldName}${option?.value}`;
  };

  const { name, ref, onChange } = register(fieldName, registerOptions);

  const isEraseButtonHidden = !watch(fieldName);

  const isResetButtonHidden =
    !isFormModifying || formState.defaultValues[fieldName] === watch(fieldName);

  return (
    <div
      hidden={isHidden}
      aria-invalid={error ? "true" : "false"}
      className={fieldName}
    >
      <legend>
        {label?.namespace ? t(label.namespace) : t(`common:info.${fieldName}`)}
      </legend>
      {options.map((option) => (
        <div>
          <input
            type="radio"
            disabled={isDisabled}
            key={giveFieldKey(option)}
            id={giveFieldKey(option)}
            name={name}
            value={option.value}
            onChange={onChange}
            ref={ref}
          />
          <label htmlFor={giveFieldKey(option)}>{t(option.label)}</label>
        </div>
      ))}
      <FieldEraseButton
        onClick={() => setValue(fieldName, "")}
        isHidden={isEraseButtonHidden}
      />
      <FieldResetButton
        onClick={() => resetField(fieldName)}
        isHidden={isResetButtonHidden}
      />
    </div>
  );
}

export default RadioContainer;
