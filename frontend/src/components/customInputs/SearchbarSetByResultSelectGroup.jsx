import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  isStringNotEmpty,
  isObject,
} from "../../services/typesAndValidationChecks";
import FetchedDataSelect from "./FetchedDataSelect";
import { giveFieldRegisterOptions } from "../../services/formFunctions";
import FieldEraseButton from "../customComponents/FieldEraseButton";
import FieldResetButton from "../customComponents/FieldResetButton";

function SearchbarSetByResultSelectGroup({
  groupClassname,
  fields,
  isDisabled,
  querySpecs,
  // asyncValues,
  registerOptions,
  isFormModifying,
  errors,
  t,
}) {
  const { textField, selectField } = fields;
  const { name, label } = textField;
  const { register, setValue, resetField, formState, watch } = useFormContext();
  const [isSelectNeeded, setIsSelectNeeded] = useState(false);
  const [isResetButtonHidden, setIsResetButtonHidden] = useState(
    !isFormModifying ||
      !(formState.dirtyFields[name] || formState.dirtyFields[selectField.name])
  );

  const textFieldRegisterOptions = giveFieldRegisterOptions(
    textField,
    registerOptions
  );
  const selectFieldRegisterOptions = giveFieldRegisterOptions(
    selectField,
    registerOptions
  );

  const handleTextChange = (value) => {
    if (!isSelectNeeded) {
      setIsSelectNeeded(true);
    }
    if (!isStringNotEmpty(value)) {
      setIsSelectNeeded(false);
      setValue(selectField.name, {});
    }

    // return setValue(name, value);
  };

  const handleSelected = (value) => {
    if (isObject(value)) {
      setValue(name, value.label);
    }
    return setIsSelectNeeded(false);
  };

  const registeredText = register(name, {
    ...textFieldRegisterOptions,

    onChange: (e) => {
      handleTextChange(e.target.value);
    },
  });

  const watchedInputs = { watchedInputNames: name };

  const isEraseButtonHidden = !watch(name);

  const eraseFields = () => {
    setValue(name, "");
    if (isFormModifying && formState.defaultValues[name]) {
      return setIsResetButtonHidden(false);
    }
    return setIsSelectNeeded(false);
  };

  const resetFields = () => {
    resetField(name);

    setIsResetButtonHidden(true);
    return setIsSelectNeeded(false);
  };

  return (
    <div className={groupClassname}>
      <input
        type="text"
        disabled={isDisabled}
        className={name}
        placeholder={label?.placeHolder}
        onChange={registeredText.onChange}
        name={registeredText.name}
        ref={registeredText.ref}
        aria-invalid={errors[name] ? "true" : "false"}
        maxLength={textFieldRegisterOptions?.maxLength?.value}
      />

      <FetchedDataSelect
        fieldName={selectField.name}
        label={selectField.label}
        isHidden={!isSelectNeeded}
        isDisabled={isDisabled}
        multipleSelection={false}
        watchedInputs={watchedInputs}
        query={querySpecs}
        onSelectedFunction={handleSelected}
        registerOptions={selectFieldRegisterOptions}
        errors={errors}
        t={t}
      />
      <FieldEraseButton onClick={eraseFields} isHidden={isEraseButtonHidden} />
      <FieldResetButton onClick={resetFields} isHidden={isResetButtonHidden} />
    </div>
  );
}
export default SearchbarSetByResultSelectGroup;
