import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import DualSearchbarSetByResultSelectGroup from "./DualSearchbarSetByResultSelectGroup";
import SearchbarSetByResultSelectGroup from "./SearchbarSetByResultSelectGroup";

function SpecialGroupConstructor({
  groupClassname,
  specialGroupSpecs,
  isDisabled,
  // asyncValues,
  registerOptions,
  isFormModifying,
  errors,
  t,
}) {
  const { type, fields, querySpecs } = specialGroupSpecs;

  const { resetField } = useFormContext();

  useEffect(() => {
    if (isDisabled) {
      Object.values(fields).forEach((field) => {
        resetField(field.name);
      });
    }
  }, [isDisabled]);

  if (type === "SearchbarSetByResultSelectGroup") {
    return (
      <SearchbarSetByResultSelectGroup
        groupClassname={groupClassname}
        fields={fields}
        isDisabled={isDisabled}
        querySpecs={querySpecs}
        registerOptions={registerOptions}
        isFormModifying={isFormModifying}
        errors={errors}
        t={t}
      />
    );
  }
  if (type === "DualSearchbarSetByResultSelectGroup") {
    return (
      <DualSearchbarSetByResultSelectGroup
        groupClassname={groupClassname}
        fields={fields}
        isDisabled={isDisabled}
        querySpecs={querySpecs}
        registerOptions={registerOptions}
        isFormModifying={isFormModifying}
        errors={errors}
        t={t}
      />
    );
  }
}

export default SpecialGroupConstructor;
