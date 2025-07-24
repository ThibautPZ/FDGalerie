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

// todo: registerOptions

function DualSearchbarSetByResultSelectGroup({
  groupClassname,
  fields,
  querySpecs,
  // asyncValues,
  registerOptions,
  errors,
  t,
}) {
  const { textField1, textField2, selectField, selectedValueField } = fields;

  const { register, setValue, getValues, trigger } = useFormContext();
  const [isSelectNeeded, setIsSelectNeeded] = useState(false);

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

  return (
    <div className={groupClassname}>
      {textField1.label.namespace ? <p>{t(textField1.label.namespace)}</p> : ""}
      <input
        type="text"
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
        className={textField2.name}
        placeholder={textField2.label?.placeHolder}
        onChange={registeredText2.onChange}
        name={registeredText2.name}
        ref={registeredText2.ref}
        aria-invalid={errors[textField2.name] ? "true" : "false"}
        maxLength={registerOptions[textField2.name]?.maxLength?.value}
      />
      {isSelectNeeded ? (
        <FetchedDataSelect
          fieldName={selectField.name}
          label={selectField.label}
          isHidden={!isSelectNeeded}
          multipleSelection={false}
          watchedInputs={watchedInputs}
          query={querySpecs}
          onSelectedFunction={handleSelected}
          registerOptions={selectFieldRegisterOptions}
          errors={errors}
          t={t}
        />
      ) : (
        <AdditionalSelectLabelInfo
          label={selectFieldValue?.label || null}
          value={selectFieldValue?.value || null}
        />
      )}
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
