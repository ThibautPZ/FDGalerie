import FetchedDataSelect from "./FetchedDataSelect";
import { giveFieldRegisterOptions } from "../../services/formFunctions";
/**
 * An object used in FormCore RHF input components
 * @typedef {Object} InputField
 * @property {string} name - Field name as referred in RHF register.
 * @property {{namespace: string, count: string}} label - Informations to display as an input label.
 * @property {string} input - Input type html attribute.
 * @property {string} inputMode - Input InputMode html attribute.
 * @property {Array.<{key: (string|number), value: (string|number), defaultValue:boolean, label: (string|number) }>} options - Selectable values for select and radio inputs.
 */

/**
 * An object containing an array listing form input infos.
 *  @typedef {object} InputFieldsGroup
 * @property {string} groupClassname - Indicates group div element classname html attribute
 * @property { Array.<(InputFieldsGroup|InputField)>} includedComponents - Object containing either a fields group or a single field
 */
/**
@type {InputFieldsGroup}
*/
/**
 * Renders GroupWrapper or InputConstructor depending of field parameter content.
 * @component
 * @param {Object} props - Component props
 * @param {(InputField|InputFieldsGroup)  } props.field - Object containing either a fields group or a single field
 * @param {Object.<string, any>} props.defaultValues - Object containing form default values
 * @param {Object.<string, {name: string, onChange: function, onBlur: function, ref: function}>} props.registerState - Object containing all RHF register tools of the form
 * @param {Object.<string, {type: string, message: string, ref: Object}> } props.errors - Object containing errors due to form registerOptions
 * @param {function} [props.watch] - Function which returns a specified form field value
 * @param {number} [props.maxLength] - Number of max characters in a text input
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered input with label.
 */
function SpecialInputConstructor({
  field,
  isHidden,
  isDisabled,
  registerOptions,
  // asyncValues,
  errors,
  t,
}) {
  const { name, label, specialInput, multiple } = field;

  const fieldRegisterOptions = giveFieldRegisterOptions(field, registerOptions);

  if (specialInput.type === "FetchedDataSelect") {
    return (
      <FetchedDataSelect
        fieldName={name}
        label={label}
        isHidden={isHidden}
        isDisabled={isDisabled}
        multipleSelection={multiple}
        watchedInputs={specialInput.watchSpecs}
        query={specialInput.querySpecs}
        registerOptions={fieldRegisterOptions}
        errors={errors}
        t={t}
      />
    );
  }
}

export default SpecialInputConstructor;
