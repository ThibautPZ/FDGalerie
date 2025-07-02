import PropTypes from "prop-types";

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
function DateInput({
  label,
  isHidden,
  fieldName,
  dateRestrictions,
  register,
  error,
  t,
}) {
  const { onChange, name, ref } = register;
  const { min, max, step } = dateRestrictions;

  const labelNs = label?.namespace || `common:info.${fieldName}`;

  return (
    <div hidden={isHidden} className={fieldName}>
      <label htmlFor={fieldName}>{t(`${labelNs}`)}</label>

      <input
        type="date"
        placeholder={label?.placeHolder}
        onChange={onChange}
        name={name}
        ref={ref}
        aria-invalid={error ? "true" : "false"}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
DateInput.propTypes = {
  label: PropTypes.shape({
    namespace: PropTypes.string,
    placeHolder: PropTypes.string,
    count: PropTypes.string,
  }),
  fieldName: PropTypes.string.isRequired,
  register: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    ref: PropTypes.func.isRequired,
  }).isRequired,
  error: PropTypes.shape({
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    ref: PropTypes.objectOf().isRequired,
  }),
  t: PropTypes.func.isRequired,
};

DateInput.defaultProps = {
  label: null,
  error: null,
};

export default DateInput;
