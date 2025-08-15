import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import enUS from "date-fns/locale/en-US";
import enGB from "date-fns/locale/en-GB";

import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "../customComponents/CustomDateInput";
import giveTimeUnitsFromDate from "../../services/dateTimeMethods/giveTimeUnitsFromDate";
import translationInstance from "../../services/translationInstance";
import { supportedLngs } from "../../i18n";
import { isObjectNotEmpty } from "../../services/typesAndValidationChecks";
import FieldResetButton from "../customComponents/FieldResetButton";
import FieldEraseButton from "../customComponents/FieldEraseButton";

const dateLocales = { fr, enUS, enGB };

Object.keys(supportedLngs).forEach((lng) =>
  registerLocale(lng, dateLocales[lng])
);

/**
 * Renders a text input component with its label to display in a FormCore form.
 * @component
 * @param {Object} props - Component props
 * @param {{namespace: string, count: ?string}}  [props.label] - Object containing label text and or name of watched text input
 * @param {string} props.fieldName - Field name in RHF
 * @param {*} [props.defaultValue] - Input default value
 * @param {{name: string, onChange: function, onBlur: function, ref: function}} props.register - Object containing RHF register tools
 * @param {{type: string, message: string, ref: Object}} props.error - Object containing errors due to form registerOptions
 * @param {function} [props.watch] - Function which returns a specified form field value
 * @param {number} [props.maxLength] - Number of max characters in a text input
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered text input with label.
 */
export default function DateInput({
  label,
  fieldName,
  isHidden,
  isDisabled,
  registerOptions = {},
  isFormModifying,
  // asyncValues,
  dateRestrictions,
  error,
  t,
}) {
  const [tCommonD, tFormMsg] = translationInstance(
    "common:date",
    "formRegisterOptionsMessages"
  );
  const { getValues, setValue, control, formState, watch, trigger } =
    useFormContext();

  const { resolvedLanguage } = translationInstance();

  const giveRestrictions = (restrictionObj) => {
    const restrictions = {
      minDate: null,
      maxDate: null,
    };

    if (!isObjectNotEmpty(restrictionObj)) {
      return restrictions;
    }

    const assignNewDateRestriction = (key) => {
      return Object.assign(restrictions, {
        [key]: new Date(restrictionObj[key]),
      });
    };

    if (restrictionObj.minDate) {
      assignNewDateRestriction("minDate");
    }
    if (restrictionObj.maxDate) {
      assignNewDateRestriction("maxDate");
    }

    return restrictions;
  };

  const { minDate, maxDate } = giveRestrictions(dateRestrictions);

  const dateValue = getValues(fieldName);

  const { strYear, strMonth, strDay } = giveTimeUnitsFromDate(dateValue);
  const [day, setDay] = useState(strDay);
  const [month, setMonth] = useState(strMonth);
  const [year, setYear] = useState(strYear);
  const [selectedDate, setSelectedDate] = useState(dateValue);

  const onDateChange = (dateChange) => {
    setValue(fieldName, dateChange, {
      shouldValidate: true,
      shouldDirty: true,
    });

    return setSelectedDate(dateChange);
  };

  const onCalendarDatePicked = (pickedDate) => {
    const newValues = giveTimeUnitsFromDate(pickedDate);
    setDay(newValues.strDay);
    setMonth(newValues.strMonth);
    setYear(newValues.strYear);
    return onDateChange(pickedDate);
  };

  const labelNs = label?.namespace || `common:info.${fieldName}`;

  const inputValues = new Map([
    ["strYear", year],
    ["strMonth", month],
    ["strDay", day],
  ]);

  const checkInputAndCalendarSameValue = (calendarValue) => {
    const calendarValues = giveTimeUnitsFromDate(calendarValue);

    for (const [key, value] of inputValues) {
      if (calendarValues[key] !== value) {
        return tFormMsg(`${fieldName}.pattern`);
      }
    }
    return true;
  };

  const areInputsDirty = () => {
    const defaultValues = giveTimeUnitsFromDate(
      formState.defaultValues[fieldName]
    );
    for (const [key, value] of inputValues) {
      if (defaultValues[key] !== value) {
        return true;
      }
    }
    return false;
  };

  Object.assign(registerOptions, {
    validate: {
      inputDate: checkInputAndCalendarSameValue,
    },
  });

  const isEraseButtonHidden = !watch(fieldName) && !day && !month && !year;

  const isResetButtonHidden =
    !isFormModifying || !(formState.dirtyFields[fieldName] || areInputsDirty());

  useEffect(() => {
    trigger(fieldName);
  }, [day, month, year, dateValue]);

  return (
    <div
      hidden={isHidden}
      className={fieldName}
      aria-invalid={error ? "true" : "false"}
    >
      <label htmlFor={fieldName}>{t(`${labelNs}`)}</label>

      <Controller
        name={fieldName}
        control={control}
        rules={registerOptions}
        render={({ field: { name, ref } }) => (
          <DatePicker
            disabled={isDisabled}
            selected={selectedDate}
            openToDate={selectedDate}
            todayButton={tCommonD("today")}
            placeholderText={label?.placeHolder}
            onChange={onCalendarDatePicked}
            name={name}
            locale={resolvedLanguage}
            minDate={minDate}
            maxDate={maxDate}
            ref={ref}
            customInput={
              <CustomDateInput
                locale={resolvedLanguage}
                onDateChange={onDateChange}
                day={day}
                setDay={setDay}
                month={month}
                setMonth={setMonth}
                year={year}
                setYear={setYear}
                tCommonD={tCommonD}
              />
            }
          />
        )}
      />
      <FieldEraseButton
        onClick={() => onCalendarDatePicked(null)}
        isHidden={isEraseButtonHidden}
      />
      <FieldResetButton
        onClick={() => onCalendarDatePicked(formState.defaultValues[fieldName])}
        isHidden={isResetButtonHidden}
      />
    </div>
  );
}
