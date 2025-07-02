import PropTypes from "prop-types";

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
      id={fieldName}
      value={optionValue}
      defaultChecked={isDefaultChecked()}
      onChange={onChange}
      name={name}
      ref={ref}
    />
  );
}

RadioInput.propTypes = {
  fieldName: PropTypes.string.isRequired,
  optionValue: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool.isRequired,
  }).isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDefault: PropTypes.bool.isRequired,
  register: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      onBlur: PropTypes.func.isRequired,
      ref: PropTypes.func.isRequired,
    })
  ).isRequired,
};

RadioInput.defaultProps = {
  defaultValue: null,
};

export default RadioInput;
