import DualSearchbarSetByResultSelectGroup from "./DualSearchbarSetByResultSelectGroup";
import SearchbarSetByResultSelectGroup from "./SearchbarSetByResultSelectGroup";

function SpecialGroupConstructor({
  groupClassname,
  specialGroupSpecs,
  // asyncValues,
  registerOptions,
  errors,
  t,
}) {
  const { type, fields, querySpecs } = specialGroupSpecs;
  if (type === "SearchbarSetByResultSelectGroup") {
    return (
      <SearchbarSetByResultSelectGroup
        groupClassname={groupClassname}
        fields={fields}
        querySpecs={querySpecs}
        registerOptions={registerOptions}
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
        querySpecs={querySpecs}
        registerOptions={registerOptions}
        errors={errors}
        t={t}
      />
    );
  }
}

export default SpecialGroupConstructor;
