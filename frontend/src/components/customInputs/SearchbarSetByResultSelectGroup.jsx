import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  isStringNotEmpty,
  isObject,
} from "../../services/typesAndValidationChecks";
import FetchedDataSelect from "./FetchedDataSelect";
import { giveFieldRegisterOptions } from "../../services/formFunctions";

function SearchbarSetByResultSelectGroup({
  groupClassname,
  fields,
  querySpecs,
  // asyncValues,
  registerOptions,
  errors,
  t,
}) {
  const { textField, selectField } = fields;
  const { name, label } = textField;
  const { register, setValue } = useFormContext();
  const [isSelectNeeded, setIsSelectNeeded] = useState(false);

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

  return (
    <div className={groupClassname}>
      <input
        type="text"
        className={name}
        placeholder={label?.placeHolder}
        onChange={registeredText.onChange}
        name={registeredText.name}
        ref={registeredText.ref}
        aria-invalid={errors[name] ? "true" : "false"}
        maxLength={textFieldRegisterOptions?.maxLength?.value}
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
        ""
      )}
    </div>
  );
}
export default SearchbarSetByResultSelectGroup;
