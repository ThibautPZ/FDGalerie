import { useFormContext } from "react-hook-form";

import giveRemainingCharacters from "../../services/giveRemainingCharacters";
import {
  civilNameRegExp,
  priceEurRegExp,
  integerRegExp,
  positiveIntegerRegExp,
  floatPrec2RegExp,
  floatPrec3RegExp,
  exponentialRegExp,
} from "../../services/regularExpressions";

const inputModeRegistrationInfo = {
  text: { regex: null, inputMode: "text" },
  priceEur: { regex: priceEurRegExp, inputMode: "decimal" },
  integer: { regex: integerRegExp, inputMode: "decimal" },
  positiveInteger: { regex: positiveIntegerRegExp, inputMode: "numeric" },
  decimalPrec2: { regex: floatPrec2RegExp, inputMode: "decimal" },
  decimalPrec3: { regex: floatPrec3RegExp, inputMode: "decimal" },
  civilName: { regex: civilNameRegExp, inputMode: "text" },
  exponential: { regex: exponentialRegExp, inputMode: "text" },
};

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
function TextInput({
  fieldName,
  label,
  isHidden,
  isDisabled,
  inputMode,
  registerOptions = {},
  error,
  t,
}) {
  const { watch, register, setValue } = useFormContext();
  const labelNs = label?.namespace || `common:info.${fieldName}`;

  const registeredField = register(fieldName, registerOptions);

  const giveOnChange = () => {
    const regex = inputModeRegistrationInfo[inputMode]?.regex;
    if (!regex) {
      return registeredField.onChange;
    }
    const onChange = (event) => {
      const { value } = event.target;
      return setValue(fieldName, value.match(regex)?.[0] || "");
    };
    return onChange;
  };

  const giveInputMode = () => {
    return (
      inputModeRegistrationInfo[inputMode]?.inputMode ||
      inputModeRegistrationInfo.text.inputMode
    );
  };

  return (
    <div hidden={isHidden} className={fieldName}>
      <label htmlFor={fieldName}>
        {t(
          `${labelNs}`,
          label?.count && {
            count: giveRemainingCharacters(watch(label.count), 3),
          },
          label?.number && { number: label.number }
        )}
      </label>

      <input
        type="text"
        disabled={isDisabled}
        inputMode={giveInputMode()}
        placeholder={label?.placeHolder}
        onChange={giveOnChange()}
        name={registeredField.name}
        ref={registeredField.ref}
        aria-invalid={error ? "true" : "false"}
        maxLength={registerOptions?.maxLength?.value}
      />

      {inputMode === "priceEur" && <label htmlFor={fieldName}> € </label>}
    </div>
  );
}

export default TextInput;
