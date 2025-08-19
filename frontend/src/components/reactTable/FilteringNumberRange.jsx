import DebouncedInput from "../customInputs/DebouncedInput";

export default function FilteringNumberRange({
  colName,
  tableObj,
  minLabel,
  minPlaceholder,
  maxLabel,
  maxPlaceholder,
  debounce,
}) {
  const giveTableFilterValue = () =>
    tableObj.getColumn(colName).getFilterValue();

  const setTableFilterValue = (value) => {
    return tableObj.getColumn(colName).setFilterValue(value);
  };

  const giveMinValue = (previous, newMaxValue) => {
    const previousMin = previous?.[0];
    if (previousMin) {
      return previousMin;
    }
    const newMinValue = Number(newMaxValue) - 1;
    if (newMinValue < 0) {
      return 0;
    }
    return `${newMinValue}`;
  };

  const giveMaxValue = (previous, newMinValue) => {
    const previousMax = previous?.[1];
    if (previousMax) {
      return previousMax;
    }
    return `${Number(newMinValue) + 1}`;
  };

  return (
    <div>
      <label htmlFor={`${colName}_min`}>{minLabel}</label>
      <DebouncedInput
        type="number"
        id={`${colName}_min`}
        value={giveTableFilterValue()?.[0] || ""}
        placeholder={minPlaceholder}
        onChange={(value) =>
          setTableFilterValue((prevValues) => [
            value,
            giveMaxValue(prevValues, value),
          ])
        }
        debounce={debounce}
      />
      <label htmlFor={`${colName}_max`}>{maxLabel}</label>
      <DebouncedInput
        type="number"
        id={`${colName}_max`}
        value={giveTableFilterValue()?.[1] || ""}
        placeholder={maxPlaceholder}
        onChange={(value) =>
          setTableFilterValue((prevValues) => [
            giveMinValue(prevValues, value),
            value,
          ])
        }
        debounce={debounce}
      />
    </div>
  );
}
