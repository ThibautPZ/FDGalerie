import { useFormContext } from "react-hook-form";

import giveRemainingCharacters from "../../services/giveRemainingCharacters";

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
  inputMode,
  registerOptions = {},
  error,
  t,
}) {
  const { watch, register, getValues, setValue } = useFormContext();
  const labelNs = label?.namespace || `common:info.${fieldName}`;

  const filterStringToPrice = (str) => {
    const numRegex = /[0-9]/g;
    const punctRegex = /[.,]/g;
    let punctuationIndex = 0;
    if (!str) {
      return "";
    }
    if (!str[0].match(numRegex)) {
      return "";
    }
    let [returnedStr] = str;
    for (let i = 1; i < str.length; i += 1) {
      if (str[i].match(numRegex)) {
        if (punctuationIndex === 1 || punctuationIndex === 2) {
          punctuationIndex += 1;
          returnedStr = `${returnedStr}${str[i]}`;
        }
        if (punctuationIndex === 0) {
          returnedStr = `${returnedStr}${str[i]}`;
        }
      }
      if (str[i].match(punctRegex) && punctuationIndex === 0) {
        punctuationIndex = 1;
        returnedStr = `${returnedStr}${str[i]}`;
      }
    }
    return returnedStr;
  };

  const setValueFilter = (name, inputmode) => {
    const originText = getValues(name);
    let filteredText = "";
    if (inputmode === "price" || inputmode === "decimal") {
      filteredText = filterStringToPrice(originText);
    }
    setValue(name, filteredText);
  };

  if (inputMode) {
    const onInputModeChange = () => {
      setValueFilter(fieldName, inputMode);
    };
    Object.assign(registerOptions, {
      onChange: onInputModeChange,
    });
  }
  const registeredField = register(fieldName, registerOptions);

  const giveInputMode = (inputModeStr) => {
    if (!inputModeStr) {
      return "text";
    }
    if (inputModeStr === "price") {
      return "decimal";
    }

    return inputModeStr;
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
        inputMode={giveInputMode(inputMode)}
        placeholder={label?.placeHolder}
        onChange={registeredField.onChange}
        name={registeredField.name}
        ref={registeredField.ref}
        aria-invalid={error ? "true" : "false"}
        maxLength={registerOptions?.maxLength?.value}
      />

      {inputMode === "price" && <label htmlFor={fieldName}> € </label>}
    </div>
  );
}

export default TextInput;
