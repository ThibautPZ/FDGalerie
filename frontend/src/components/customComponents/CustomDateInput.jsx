import { forwardRef, useRef } from "react";

import giveTimeUnitsFromDate from "../../services/dateTimeMethods/giveTimeUnitsFromDate";

const CustomDateInput = forwardRef(
  (
    {
      locale,
      onClick,
      day,
      setDay,
      month,
      setMonth,
      year,
      setYear,
      onDateChange,
      tCommonD,
    },
    ref
  ) => {
    const secondPlaceInputRef = useRef(null);
    const thirdPlaceInputRef = useRef(null);

    const isDayFirstPlace = locale === "fr" || locale === "enGB";

    const setFocusOnNextInput = (currentInput) => {
      if (
        (currentInput === "day" && isDayFirstPlace) ||
        (currentInput === "month" && !isDayFirstPlace)
      ) {
        return secondPlaceInputRef.current.focus();
      }
      return thirdPlaceInputRef.current.focus();
    };

    const handleFocus = (event) => {
      onClick();
      event.target.select();
    };

    const isDaySafeValue = (dayValueFromInput) => {
      const int = parseInt(dayValueFromInput, 10);
      if (int > 0 && int < 32) {
        return true;
      }
      return false;
    };

    const isMonthSafeValue = (monthValueFromInput) => {
      const int = parseInt(monthValueFromInput, 10);
      if (int > 0 && int < 13) {
        return true;
      }
      return false;
    };

    const isYearSafeValue = (yearValueFromInput) => {
      const int = parseInt(yearValueFromInput, 10);
      if (int > 0 && int < 3000) {
        return true;
      }
      return false;
    };

    const updateDate = ({
      updatedDay = day,
      updatedMonth = month,
      updatedYear = year,
    }) => {
      const { idxMonth, strYear } = giveTimeUnitsFromDate(new Date());
      const defaultMonth = idxMonth.toString();
      const defaultYear = strYear;
      const arg = [];

      if (isYearSafeValue(updatedYear)) {
        arg.push(updatedYear);
      } else {
        arg.push(defaultYear);
      }

      if (isMonthSafeValue(updatedMonth)) {
        arg.push(updatedMonth - 1);
      } else {
        arg.push(defaultMonth);
      }

      if (isDaySafeValue(updatedDay)) {
        arg.push(updatedDay);
      }

      const fullDate = new Date(...arg);

      return onDateChange(fullDate);
    };

    const onDayChange = (newDay) => {
      if (newDay?.length > 1) {
        setFocusOnNextInput("day");
      }
      setDay(newDay);
      updateDate({ updatedDay: newDay });
    };

    const onMonthChange = (newMonth) => {
      if (newMonth?.length > 1) {
        setFocusOnNextInput("month");
      }
      setMonth(newMonth);
      updateDate({ updatedMonth: newMonth });
    };

    const onYearChange = (newYear) => {
      setYear(newYear);
      updateDate({ updatedYear: newYear });
    };

    return isDayFirstPlace ? (
      <div ref={ref}>
        <input
          value={day}
          type="text"
          placeholder={tCommonD("day")}
          onChange={(e) => onDayChange(e.target.value)}
          onFocus={handleFocus}
          maxLength={2}
        />
        <input
          value={month}
          type="text"
          placeholder={tCommonD("month")}
          inputMode="decimal"
          ref={secondPlaceInputRef}
          onChange={(e) => onMonthChange(e.target.value)}
          onFocus={handleFocus}
          maxLength={2}
        />
        <input
          value={year}
          type="text"
          placeholder={tCommonD("year")}
          inputMode="decimal"
          ref={thirdPlaceInputRef}
          onChange={(e) => onYearChange(e.target.value)}
          onFocus={handleFocus}
          maxLength={4}
        />
      </div>
    ) : (
      <div ref={ref}>
        <input
          value={month}
          type="text"
          placeholder={tCommonD("month")}
          inputMode="decimal"
          onChange={(e) => onMonthChange(e.target.value)}
          onFocus={handleFocus}
          maxLength={2}
        />
        <input
          value={day}
          type="text"
          placeholder={tCommonD("day")}
          ref={secondPlaceInputRef}
          onChange={(e) => onDayChange(e.target.value)}
          onFocus={handleFocus}
          maxLength={2}
        />
        <input
          value={year}
          type="text"
          placeholder={tCommonD("year")}
          inputMode="decimal"
          ref={thirdPlaceInputRef}
          onChange={(e) => onYearChange(e.target.value)}
          onFocus={handleFocus}
          maxLength={4}
        />
      </div>
    );
  }
);
export default CustomDateInput;
