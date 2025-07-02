import { useFormContext, useWatch } from "react-hook-form";

import InputConstructor from "./InputConstructor";
import UseFormInputConditionalRendering from "../../hooks/UseFormInputConditionalRendering";
import SpecialGroupConstructor from "./SpecialGroupConstructor";

/**
 * Selects an input from text, radio or select to render in the FormCore component.
 * @component
 * @param {Object} props - Component props
 * @param {{name: string, label: {namespace: string, count: string}, input: string, options: Array.<{key: (string|number), value: (string|number), defaultValue:boolean, label: (string|number) }>} } props.field - Object containing input type and options
 * @param {*} [props.defaultValue] - Input default value
 * @param {Object.<string, {name: string, onChange: function, onBlur: function, ref: function}>} props.registerState - Object containing all RHF register tools of the form
 * @param {Object.<string, {type: string, message: string, ref: Object}> } props.errors - Object containing errors due to form registerOptions
 * @param {function} [props.watch] - Function which returns a specified form field value
 * @param {number} [props.maxLength] - Number of max characters in a text input
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered input with label.
 */
function GroupWrapper({
  groupClassname,
  specialGroup,
  fields,
  conditionalRendering,
  asyncValues,
  registerOptions,
  errors,
  t,
}) {
  const { control } = useFormContext();

  let isGroupHidden = false;

  const useWatchWithControl = (inputName) => {
    return useWatch({ control, name: inputName });
  };

  if (conditionalRendering) {
    isGroupHidden = UseFormInputConditionalRendering(
      useWatchWithControl,
      conditionalRendering
    );
  }

  if (!isGroupHidden) {
    if (specialGroup) {
      return specialGroup ? (
        <SpecialGroupConstructor
          groupClassname={groupClassname}
          specialGroupSpecs={specialGroup}
          asyncValues={asyncValues}
          registerOptions={registerOptions}
          errors={errors}
          t={t}
        />
      ) : (
        ""
      );
    }

    return (
      <div className={groupClassname}>
        {fields.map((field) => {
          return field.groupClassname ? (
            <GroupWrapper
              key={field.groupClassname}
              conditionalRendering={field.conditionalRendering || null}
              specialGroup={field.specialGroup}
              groupClassname={field.groupClassname}
              fields={field.includedComponents}
              asyncValues={asyncValues}
              registerOptions={registerOptions}
              errors={errors}
              t={t}
            />
          ) : (
            <InputConstructor
              key={field.name || field.label.namespace}
              field={field}
              asyncValues={asyncValues}
              registerOptions={registerOptions}
              errors={errors}
              t={t}
            />
          );
        })}
      </div>
    );
  }
}

export default GroupWrapper;
