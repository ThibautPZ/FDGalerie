import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

import RadioContainer from "./RadioContainer";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import CheckboxInput from "./CheckboxInput";
import DateInput from "./DateInput";
import SpecialInputConstructor from "./SpecialInputConstructor";
import axiosInstance from "../../services/axiosInstance";
import FileInput from "./FileInput";
import CreatableSelectInput from "./CreatableSelectInput";
import {
  giveEmptyValue,
  giveFieldRegisterOptions,
} from "../../services/formFunctions";
import UseFormInputConditionalRendering from "../../hooks/UseFormInputConditionalRendering";

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
  isDisabled,
  asyncValues,
  registerOptions,
  useWatchWithControl,
  isFormModifying,
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
    conditionalDisabling,
  } = field;

  const { setValue } = useFormContext();

  const fieldRegisterOptions = giveFieldRegisterOptions(field, registerOptions);

  const fetchQueryFunction = async (url, labelData, valuesData) => {
    const urlWithPrefix = `api/${url}`;
    const res = await axiosInstance.get(urlWithPrefix);
    if (!res) {
      return Error;
    }
    const returnedArr = res.data.map((obj) => {
      const objLabel = obj[labelData.key];
      if (labelData.labelCb) {
        return { label: labelData.labelCb(objLabel), value: obj[valuesData] };
      }
      return { label: objLabel, value: obj[valuesData] };
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
  // todo : asyncValues in field
  let asyncFormValues = {};

  if (asyncValues && asyncValues[name]) {
    asyncFormValues = fetchValues(asyncValues[name]);
  }

  const isInputDisabled =
    isDisabled ||
    UseFormInputConditionalRendering(useWatchWithControl, conditionalDisabling);

  useEffect(() => {
    if (isInputDisabled) {
      const emptyValue = giveEmptyValue(input, multiple);
      setValue(name, emptyValue);
    }
  }, [isInputDisabled]);

  if (specialInput) {
    return (
      <SpecialInputConstructor
        field={field}
        isHidden={isHidden}
        isDisabled={isInputDisabled}
        registerOptions={fieldRegisterOptions}
        isFormModifying={isFormModifying}
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
        isDisabled={isInputDisabled}
        fieldName={name}
        inputMode={inputmode}
        registerOptions={fieldRegisterOptions}
        isFormModifying={isFormModifying}
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
        isDisabled={isInputDisabled}
        label={label}
        options={options}
        registerOptions={fieldRegisterOptions}
        isFormModifying={isFormModifying}
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
        isDisabled={isInputDisabled}
        multipleSelection={multiple}
        fieldName={name}
        options={options}
        registerOptions={fieldRegisterOptions}
        isFormModifying={isFormModifying}
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
        isDisabled={isInputDisabled}
        multipleSelection={multiple}
        fieldName={name}
        options={options}
        registerOptions={fieldRegisterOptions}
        isFormModifying={isFormModifying}
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
        isDisabled={isInputDisabled}
        registerOptions={fieldRegisterOptions}
        isFormModifying={isFormModifying}
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
        isDisabled={isInputDisabled}
        registerOptions={fieldRegisterOptions}
        isFormModifying={isFormModifying}
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
        isDisabled={isInputDisabled}
        registerOptions={fieldRegisterOptions}
        isFormModifying={isFormModifying}
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
