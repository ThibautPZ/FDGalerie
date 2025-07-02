import { useWatch, useFieldArray, useFormContext } from "react-hook-form";
import UseFormInputConditionalRendering from "../../hooks/UseFormInputConditionalRendering";
import InputConstructor from "./InputConstructor";

function ConditionalFieldArray({
  classname,
  fieldsList,
  conditionalRendering,
  asyncValues,
  registerOptions,
  errors,
  t,
}) {
  const { control } = useFormContext();
  const useWatchWithControl = (inputName) => {
    return useWatch({ control, name: inputName });
  };
  let isHidden = false;
  isHidden = UseFormInputConditionalRendering(
    useWatchWithControl,
    conditionalRendering
  );

  const { fields } = useFieldArray({
    control,
    name: classname,
    shouldUnregister: true,
  });

  // fields : [{inputName: defaultValue, id:providedRHFid},...]

  return (
    <>
      {fields.map((field, index) => (
        <InputConstructor
          key={field.id}
          field={fieldsList[index]}
          isHidden={isHidden}
          asyncValues={asyncValues}
          registerOptions={registerOptions}
          errors={errors}
          t={t}
        />
      ))}
    </>
  );
}

export default ConditionalFieldArray;
