import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

import TextWithHighlights from "../customComponents/TextWithHighlights";

// todo: substring highlight

/**
 * Renders a option input in a SelectInput component.
 * @component
 * @param {Object} props - Component props
 * @param {(string|number)} props.fieldName - Field name in RHF
 * @param {(string|number)} props.translationIndex - Option input text content index for translation function
 * @param {(string|number)} props.displayedLabel - Option input text content
 * @param {(string|number)} props.optionValue - Radio input value
 * @param {*} [props.defaultValue] - Input default value
 * @param {boolean} props.isDefault - In case of not defined default value, indicate if this input should be the default selected one
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered radio container with a label with each radio input.
 */
function OptionInput({
  fieldName,
  multiple,
  displayedLabel,
  optionValue,
  substringHighlight,
  t,
}) {
  const { getValues, setValue } = useFormContext();

  const giveOptionInputClassname = () => {
    const optionInputClassname = `${fieldName}Option`;
    const selectedValues = getValues(fieldName);
    if (!selectedValues.find((element) => element === optionValue.toString())) {
      return optionInputClassname;
    }
    return `${optionInputClassname}_selected`;
  };

  const setMultipleSelectionValue = (value) => {
    const originArr = getValues(fieldName);
    const previouslySelectedIndex = originArr.indexOf(value);
    if (previouslySelectedIndex > -1) {
      originArr.splice(previouslySelectedIndex, 1);
    }
    if (previouslySelectedIndex === -1) {
      originArr.push(value);
    }

    return setValue(fieldName, originArr);
  };

  const giveTextContent = () => {
    return displayedLabel || t(`common:${fieldName}.${optionValue}`);
  };

  return (
    <option
      hidden={optionValue === null}
      className={multiple ? giveOptionInputClassname(optionValue) : fieldName}
      value={optionValue}
      onClick={
        multiple ? (e) => setMultipleSelectionValue(e.target.value) : null
      }
    >
      <TextWithHighlights
        parentName={fieldName}
        fullText={giveTextContent()}
        textToBeHighlighted={substringHighlight || null}
        t={t}
      />
    </option>
  );
}

OptionInput.propTypes = {
  fieldName: PropTypes.string.isRequired,
  displayedLabel: PropTypes.string,
  optionValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  t: PropTypes.func.isRequired,
};

OptionInput.defaultProps = {
  displayedLabel: "",
};

export default OptionInput;
