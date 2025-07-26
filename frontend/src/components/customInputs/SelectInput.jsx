import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

/**
 * Renders a select field with its label to display in a FormCore form.
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.multipleSelection] - Determines if multiple options can be selected
 * @param {string} props.fieldName - Field name in RHF
 * @param {Array.<{key: (string|number), value: (string|number), defaultValue:boolean, label: (string|number)}>} props.options - Array containing objects with RadioInput data
 * @param {*} [props.defaultValue] - Input default value
 * @param {{name: string, onChange: function, onBlur: function, ref: function}} props.register - Object containing RHF register tools
 * @param {{type: string, message: string, ref: Object}} props.error - Object containing errors due to form registerOptions
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered radio container with a label with each radio input.
 */
function SelectInput({
  label,
  isHidden,
  isDisabled,
  multipleSelection,
  fieldName,
  options,
  registerOptions,
  asyncValues,
  error,
  t,
}) {
  const { control } = useFormContext();
  const placeholder = t(`pageText:inputPlaceHolder.${fieldName}`);

  const labelNs = label?.namespace || `common:info.${fieldName}`;

  const populateOptionsWhenMissingLabel = (optionsArr) => {
    if (!Array.isArray(optionsArr) || !optionsArr.length) {
      return [];
    }
    const returnedArr = optionsArr.map((optionObj) => {
      if ((optionObj.value === 0 || optionObj.value) && !optionObj.label) {
        return {
          ...optionObj,
          label: t(`common:${fieldName}.${optionObj.value}`),
        };
      }
      return optionObj;
    });
    return returnedArr;
  };
  const giveOptions = () => {
    const syncOptions = populateOptionsWhenMissingLabel(options);
    const asyncOptions = populateOptionsWhenMissingLabel(asyncValues);
    const returnedArr = syncOptions.concat(asyncOptions);
    return returnedArr;
  };
  const selectOptions = giveOptions();

  return (
    <div
      hidden={isHidden}
      aria-invalid={error ? "true" : "false"}
      className={fieldName}
    >
      <label htmlFor={fieldName}>{t(labelNs)}</label>
      <Controller
        name={fieldName}
        control={control}
        rules={registerOptions}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <Select
            isDisabled={isDisabled}
            isClearable
            options={selectOptions}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            ref={ref}
            value={value}
            controlShouldRenderValue
            hideSelectedOptions
            isMulti={multipleSelection}
          />
        )}
      />
    </div>
  );
}

export default SelectInput;
