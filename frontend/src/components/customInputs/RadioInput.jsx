/**
 * Renders a radio input.
 * @component
 * @param {Object} props - Component props
 * @param {(string|number)} props.fieldName - Field name in RHF
 * @param {(string|number)} props.optionValue - Radio input value
 * @param {*} [props.defaultValue] - Radio input default value
 * @param {boolean} props.isDefault - In case of not defined default value, indicate if this input should be the default selected one
 * @param {{name: string, onChange: function, onBlur: function, ref: function}} props.register - Object containing RHF register tools
 * @returns {JSX.Element} Rendered radio input.
 */
function RadioInput({
  isDisabled,
  fieldName,
  optionValue,
  defaultValue,
  isDefault,
  register,
}) {
  const { onChange, name, ref } = register;

  const isDefaultChecked = () => {
    if (defaultValue) {
      return defaultValue.toString() === optionValue.toString();
    }
    return isDefault;
  };

  return (
    <input
      type="radio"
      disabled={isDisabled}
      id={fieldName}
      value={optionValue}
      defaultChecked={isDefaultChecked()}
      onChange={onChange}
      name={name}
      ref={ref}
    />
  );
}

export default RadioInput;
