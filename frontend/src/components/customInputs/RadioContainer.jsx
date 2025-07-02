import PropTypes from "prop-types";
import RadioInput from "./RadioInput";

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
  options,
  defaultValue,
  register,
  error,
  t,
}) {
  const giveFieldKey = (option) => {
    return `${fieldName}${option.key}`;
  };

  const putIdOutOfStringEnd = (str) => {
    if (str.endsWith("sId")) {
      return str.slice(0, -2);
    }
    return str;
  };

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
          <RadioInput
            key={giveFieldKey(option)}
            fieldName={giveFieldKey(option)}
            optionValue={option.value}
            defaultValue={defaultValue}
            isDefault={option.defaultValue}
            register={register}
          />
          <label htmlFor={giveFieldKey(option)}>
            {t(`common:${putIdOutOfStringEnd(fieldName)}.${option.value}`)}
          </label>
        </div>
      ))}
    </div>
  );
}

RadioContainer.propTypes = {
  fieldName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      defaultValue: PropTypes.bool.isRequired,
    })
  ).isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  register: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      onBlur: PropTypes.func.isRequired,
      ref: PropTypes.func.isRequired,
    })
  ).isRequired,
  error: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      ref: PropTypes.objectOf().isRequired,
    })
  ).isRequired,
  t: PropTypes.func.isRequired,
};

RadioContainer.defaultProps = {
  defaultValue: null,
};

export default RadioContainer;
