import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import giveTimeUnitsFromDate from "../../services/dateTimeMethods/giveTimeUnitsFromDate";
import translationInstance from "../../services/translationInstance";
import CustomDateInput from "../customComponents/CustomDateInput";

export default function FilteringDateRange({
  colName,
  tableObj,
  minLabel,
  minPlaceholder,
  maxLabel,
  maxPlaceholder,
  restrictions = {},
}) {
  const { minDate: minDateRestriction, maxDate: maxDateRestriction } =
    restrictions;

  const setTableFilterValue = (value) => {
    return tableObj.getColumn(colName).setFilterValue(value);
  };

  const [tCommonD, { resolvedLanguage }] = translationInstance(
    "common:date",
    "i18n"
  );

  const minDateValue =
    tableObj.getColumn(colName).getFilterValue()?.[0] || null;

  const { strYear, strMonth, strDay } = giveTimeUnitsFromDate(minDateValue);
  const [minDay, setMinDay] = useState(strDay);
  const [minMonth, setMinMonth] = useState(strMonth);
  const [minYear, setMinYear] = useState(strYear);

  const onMinDateChange = (dateChange) => {
    return setTableFilterValue((prevValues) => [
      dateChange,
      prevValues?.[1] || new Date(),
    ]);
  };

  const onMinCalendarDatePicked = (pickedDate) => {
    const newValues = giveTimeUnitsFromDate(pickedDate);
    setMinDay(newValues.strDay);
    setMinMonth(newValues.strMonth);
    setMinYear(newValues.strYear);
    return onMinDateChange(pickedDate);
  };

  const maxDateValue =
    tableObj.getColumn(colName).getFilterValue()?.[1] || null;

  const {
    strYear: strMaxYear,
    strMonth: strMaxMonth,
    strDay: strMaxDay,
  } = giveTimeUnitsFromDate(maxDateValue);

  const [maxDay, setMaxDay] = useState(strMaxDay);
  const [maxMonth, setMaxMonth] = useState(strMaxMonth);
  const [maxYear, setMaxYear] = useState(strMaxYear);

  const onMaxDateChange = (dateChange) => {
    return setTableFilterValue((prevValues) => [
      prevValues?.[0] || dateChange,
      dateChange,
    ]);
  };

  const onMaxCalendarDatePicked = (pickedDate) => {
    const newValues = giveTimeUnitsFromDate(pickedDate);
    setMaxDay(newValues.strDay);
    setMaxMonth(newValues.strMonth);
    setMaxYear(newValues.strYear);
    return onMaxDateChange(pickedDate);
  };
  useEffect(() => {
    onMinCalendarDatePicked(minDateValue);
  }, [maxDateValue]);

  useEffect(() => {
    onMaxCalendarDatePicked(maxDateValue);
  }, [minDateValue]);

  return (
    <div>
      <label htmlFor={`${colName}_min`}>{minLabel}</label>
      <DatePicker
        selected={minDateValue}
        openToDate={minDateValue}
        todayButton={tCommonD("today")}
        placeholderText={minPlaceholder}
        onChange={onMinCalendarDatePicked}
        name={`${colName}_min`}
        locale={resolvedLanguage}
        minDate={minDateRestriction}
        maxDate={maxDateRestriction}
        customInput={
          <CustomDateInput
            locale={resolvedLanguage}
            onDateChange={onMinDateChange}
            day={minDay}
            setDay={setMinDay}
            month={minMonth}
            setMonth={setMinMonth}
            year={minYear}
            setYear={setMinYear}
            tCommonD={tCommonD}
          />
        }
      />
      <label htmlFor={`${colName}_max`}>{maxLabel}</label>
      <DatePicker
        selected={maxDateValue}
        openToDate={maxDateValue}
        todayButton={tCommonD("today")}
        placeholderText={maxPlaceholder}
        onChange={onMaxCalendarDatePicked}
        name={`${colName}_max`}
        locale={resolvedLanguage}
        minDate={minDateRestriction}
        maxDate={maxDateRestriction}
        customInput={
          <CustomDateInput
            locale={resolvedLanguage}
            onDateChange={onMaxDateChange}
            day={maxDay}
            setDay={setMaxDay}
            month={maxMonth}
            setMonth={setMaxMonth}
            year={maxYear}
            setYear={setMaxYear}
            tCommonD={tCommonD}
          />
        }
      />
    </div>
  );
}
