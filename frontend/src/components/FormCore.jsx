import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormRegisterOptions from "../services/FormRegisterOptions";
import GroupWrapper from "./customInputs/GroupWrapper";

/**
 * Renders a form component using React Hook Form.
 * @component
 * @param {Object} props - Component props
 * @param {function} props.mutate - Function called when submitting form
 * @param {Object.<string, any>} props.defaultValues - Object containing form default values
 * @param {Object.<string, any>} props.addedValues - Object containing data to be sent when submitted, but don't show in form inputs
 * @param {Array.<{name: string, label: {namespace: string, count: string}, input: string, inputMode: string=, options: Array.<{key: string|number, value: string|number, defaultValue:boolean, label: string|number}}> } props.fields - Array: each element represents an form input
 * @param {Object} props.children - Children rendered between the form end and error messages
 * @param {Object} props.inputChildren - Children rendered between the last input and the submit button
 * @returns {React.JSX} Rendered form.
 */
function FormCore({
  className,
  mutation,
  formMethods,
  defaultValues,
  addedValues,
  asyncValues,
  fields,
  submitbuttonText,
  onSubmit,
  isFormModifying,
}) {
  // const [asyncFormValues, setAsyncFormValues] = useState({});
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);

  const { mutate, isSuccess } = mutation;

  const methods =
    formMethods || useForm({ defaultValues, shouldUnregister: true });

  const registerOptions = FormRegisterOptions(methods.watch);

  const handleFormSubmition = (data) => {
    let mutatedData = data;
    if (onSubmit) {
      mutatedData = onSubmit(data);
    }
    mutate(mutatedData);
  };

  const assignAddedValues = (addedValuesObj) => {
    for (const [key, value] of Object.entries(addedValuesObj)) {
      methods.register(key, { value });
    }
  };
  if (addedValues) {
    assignAddedValues(addedValues);
  }

  useEffect(() => {
    if (methods.formState.isSubmitSuccessful && isSuccess) {
      methods.reset(defaultValues);
    }
  }, [methods.formState.isSubmitSuccessful, methods.reset]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleFormSubmition)}>
          <GroupWrapper
            groupClassname={className}
            fields={fields}
            asyncValues={asyncValues}
            registerOptions={registerOptions}
            isFormModifying={isFormModifying}
            errors={methods.formState.errors}
            t={t}
          />

          <input type="submit" value={submitbuttonText} />
        </form>
      </FormProvider>

      <div role="alert">
        {Object.entries(methods.formState.errors).map(([key, value]) => (
          <p key={key}>{value.message}</p>
        ))}
      </div>
    </>
  );
}

export default FormCore;
