import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  isStringNotEmpty,
  isObject,
  isArrayNotEmpty,
} from "../../services/typesAndValidationChecks";
import FetchedDataSelect from "./FetchedDataSelect";
import AdditionalSelectLabelInfo from "../customComponents/AdditionalSelectLabelInfo";
import { giveFieldRegisterOptions } from "../../services/formFunctions";
import FieldEraseButton from "../customComponents/FieldEraseButton";
import FieldResetButton from "../customComponents/FieldResetButton";

function DualSearchbarSetByResultSelectGroup({
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
  const { textField1, textField2, selectField, selectedValueField } = fields;

  const watchedInputsNames = [
    textField1.name,
    textField2.name,
    selectedValueField.name,
  ];

  const { responseKeysToBeOptionContent, additionalLabelInfo } = querySpecs;

  const {
    register,
    setValue,
    getValues,
    resetField,
    trigger,
    watch,
    formState,
  } = useFormContext();

  const [isSelectNeeded, setIsSelectNeeded] = useState(false);
  const [isResetButtonHidden, setIsResetButtonHidden] = useState(
    !isFormModifying ||
      !watchedInputsNames.find((name) => formState.dirtyFields[name])
  );

  const textField1RegisterOptions = giveFieldRegisterOptions(
    textField1,
    registerOptions
  );
  const textField2RegisterOptions = giveFieldRegisterOptions(
    textField2,
    registerOptions
  );
  const selectFieldRegisterOptions = giveFieldRegisterOptions(
    selectField,
    registerOptions
  );

  const handleTextChange = (value, otherTextInputName) => {
    if (!isSelectNeeded) {
      setIsSelectNeeded(true);
    }
    if (!isStringNotEmpty(value) && !getValues(otherTextInputName)) {
      setIsSelectNeeded(false);
      setValue(selectField.name, {});
    }
  };

  const giveTextToSetWhenSelect = (keysArr, valueObj) => {
    let returnedStr = "";
    if (!isArrayNotEmpty(keysArr)) {
      return returnedStr;
    }
    keysArr.forEach((key) => {
      returnedStr = `${returnedStr}${valueObj[key]} `;
    });
    return returnedStr;
  };

  const handleSelected = (value) => {
    if (isObject(value)) {
      const valueForTextField1 = giveTextToSetWhenSelect(
        textField1.valueKeysToSetWhenSelect,
        value.value
      );
      const valueForTextField2 = giveTextToSetWhenSelect(
        textField2.valueKeysToSetWhenSelect,
        value.value
      );
      setValue(textField1.name, valueForTextField1);
      setValue(textField2.name, valueForTextField2);
      setValue(selectedValueField.name, value.value);
      trigger(selectedValueField.name);
    }
    return setIsSelectNeeded(false);
  };

  const registeredText1 = register(textField1.name, {
    ...textField1RegisterOptions,
    onChange: (e) => {
      handleTextChange(e.target.value, textField2.name);
    },
  });

  const registeredText2 = register(textField2.name, {
    ...textField2RegisterOptions,
    onChange: (e) => {
      handleTextChange(e.target.value, textField1.name);
    },
  });

  const registeredHidden = register(
    selectedValueField.name,
    registerOptions[selectedValueField.name]
  );

  const watchedInputs = {
    watchedInputNames: [textField1.name, textField2.name],
  };

  const selectFieldValue = getValues(selectField.name);

  const isEraseButtonHidden = !watch(watchedInputsNames).find((value) => value);

  const giveEmptyValue = (index) => {
    return index < 2 ? "" : null;
  };

  const areWatchedInputsDefaultValuesEmpty = () => {
    return watchedInputsNames.find((name, index) => {
      const searchedValue = giveEmptyValue(index);
      return formState.defaultValues[name] !== searchedValue;
    });
  };

  const eraseFields = () => {
    watchedInputsNames.forEach((name, index) => {
      const emptyValue = giveEmptyValue(index);
      return setValue(name, emptyValue);
    });
    if (isFormModifying && areWatchedInputsDefaultValuesEmpty()) {
      return setIsResetButtonHidden(false);
    }
    return setIsSelectNeeded(false);
  };

  const resetFields = () => {
    watchedInputsNames.forEach((name) => {
      resetField(name);
    });
    setIsResetButtonHidden(true);
    return setIsSelectNeeded(false);
  };

  return (
    <div className={groupClassname}>
      {textField1.label.namespace ? <p>{t(textField1.label.namespace)}</p> : ""}
      <input
        type="text"
        disabled={isDisabled}
        className={textField1.name}
        placeholder={textField1.label?.placeHolder}
        onChange={registeredText1.onChange}
        name={registeredText1.name}
        ref={registeredText1.ref}
        aria-invalid={errors[textField1.name] ? "true" : "false"}
        maxLength={registerOptions[textField1.name]?.maxLength?.value}
      />
      {textField2.label.namespace ? <p>{t(textField2.label.namespace)}</p> : ""}
      <input
        type="text"
        disabled={isDisabled}
        className={textField2.name}
        placeholder={textField2.label?.placeHolder}
        onChange={registeredText2.onChange}
        name={registeredText2.name}
        ref={registeredText2.ref}
        aria-invalid={errors[textField2.name] ? "true" : "false"}
        maxLength={registerOptions[textField2.name]?.maxLength?.value}
      />{" "}
      {!isSelectNeeded && (
        <AdditionalSelectLabelInfo
          label={
            querySpecs.additionalLabelInfo
              ? {
                  labelKeys: responseKeysToBeOptionContent,
                  searchedKeys: [],
                  additionalLabelData: additionalLabelInfo,
                }
              : null
          }
          value={selectFieldValue?.value || null}
        />
      )}
      <FieldEraseButton onClick={eraseFields} isHidden={isEraseButtonHidden} />
      <FieldResetButton onClick={resetFields} isHidden={isResetButtonHidden} />
      <FetchedDataSelect
        fieldName={selectField.name}
        label={selectField.label}
        isHidden={!isSelectNeeded}
        disabled={isDisabled}
        multipleSelection={false}
        watchedInputs={watchedInputs}
        query={querySpecs}
        onSelectedFunction={handleSelected}
        registerOptions={selectFieldRegisterOptions}
        errors={errors}
        t={t}
      />
      <input
        type="hidden"
        onChange={registeredHidden.onChange}
        name={registeredHidden.name}
        ref={registeredHidden.ref}
      />
    </div>
  );
}
export default DualSearchbarSetByResultSelectGroup;
