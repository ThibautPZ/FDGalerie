import { useQuery } from "@tanstack/react-query";

import RadioContainer from "./RadioContainer";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import CheckboxInput from "./CheckboxInput";

import DateInput from "./DateInput";
import SpecialInputConstructor from "./SpecialInputConstructor";
import axiosInstance from "../../services/axiosInstance";
import FileInput from "./FileInput";
import CreatableSelectInput from "./CreatableSelectInput";
import { giveFieldRegisterOptions } from "../../services/formFunctions";

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
function InputConstructor({
  field,
  isHidden,
  asyncValues,
  registerOptions,
  errors,
  t,
}) {
  const {
    name,
    label,
    input,
    inputmode,
    specialInput,
    options,
    multiple,
    dateRestrictions,
    uploadOptions,
  } = field;

  const fieldRegisterOptions = giveFieldRegisterOptions(field, registerOptions);

  const fetchQueryFunction = async (url, labelData, valuesData) => {
    const urlWithPrefix = `api/${url}`;
    const res = await axiosInstance.get(urlWithPrefix);
    if (!res) {
      return Error;
    }
    const returnedArr = res.data.map((obj) => {
      return { label: obj[labelData], value: obj[valuesData] };
    });
    return returnedArr;
  };

  const fetchValues = ({ key, url, labelData, valuesData }) => {
    const returnedQuery = useQuery({
      queryKey: [key],
      queryFn: () => fetchQueryFunction(url, labelData, valuesData),
      throwOnError: true,
    });
    return returnedQuery;
  };

  let asyncFormValues = {};

  if (asyncValues && asyncValues[name]) {
    asyncFormValues = fetchValues(asyncValues[name]);
  }

  // let isHidden = false;
  // if (conditionalRendering) {
  //   isHidden = UseFormInputConditionalRendering(useWatch, conditionalRendering);
  // }

  if (specialInput) {
    return (
      <SpecialInputConstructor
        field={field}
        isHidden={isHidden}
        registerOptions={fieldRegisterOptions}
        asyncValues={asyncFormValues.data}
        error={errors[name]}
        t={t}
      />
    );
  }
  if (input === "text") {
    return (
      <TextInput
        label={label || null}
        isHidden={isHidden}
        fieldName={name}
        inputMode={inputmode}
        registerOptions={fieldRegisterOptions}
        asyncValues={asyncFormValues.data}
        error={errors[name]}
        t={t}
      />
    );
  }
  if (input === "radio") {
    return (
      <RadioContainer
        fieldName={name}
        isHidden={isHidden}
        label={label}
        options={options}
        registerOptions={fieldRegisterOptions}
        asyncValues={asyncFormValues.data}
        error={errors[name]}
        t={t}
      />
    );
  }
  if (input === "select") {
    return (
      <SelectInput
        label={label}
        isHidden={isHidden}
        multipleSelection={multiple}
        fieldName={name}
        options={options}
        registerOptions={fieldRegisterOptions}
        asyncValues={asyncFormValues.data}
        error={errors[name]}
        t={t}
      />
    );
  }
  if (input === "creatableSelect") {
    return (
      <CreatableSelectInput
        label={label}
        isClearable
        isHidden={isHidden}
        multipleSelection={multiple}
        fieldName={name}
        options={options}
        registerOptions={fieldRegisterOptions}
        asyncValues={asyncFormValues.data}
        error={errors[name]}
        t={t}
      />
    );
  }
  if (input === "checkbox") {
    return (
      <CheckboxInput
        label={label}
        fieldName={name}
        isHidden={isHidden}
        registerOptions={fieldRegisterOptions}
        asyncValues={asyncFormValues.data}
        error={errors[name]}
        t={t}
      />
    );
  }
  if (input === "date") {
    return (
      <DateInput
        label={label}
        fieldName={name}
        isHidden={isHidden}
        registerOptions={fieldRegisterOptions}
        asyncValues={asyncFormValues.data}
        dateRestrictions={dateRestrictions}
        error={errors[name]}
        t={t}
      />
    );
  }
  if (input === "file") {
    return (
      <FileInput
        label={label}
        fieldName={name}
        isHidden={isHidden}
        registerOptions={fieldRegisterOptions}
        asyncValues={asyncFormValues.data}
        uploadOptions={uploadOptions}
        error={errors[name]}
        t={t}
      />
    );
  }
  if (input === "label") {
    return <div hidden={isHidden}>{t(`${label?.namespace}`)}</div>;
  }
}

export default InputConstructor;
