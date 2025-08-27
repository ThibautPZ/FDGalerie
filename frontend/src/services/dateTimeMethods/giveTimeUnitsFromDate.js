import { isDate } from "../typesAndValidationChecks";

function numToStr(num) {
  if (num === 0) {
    return "";
  }
  return num.toString();
}

export default function giveTimeUnitsFromDate(date) {
  if (!isDate(date)) {
    return {
      numYear: 0,
      strYear: "",
      numMonth: 0,
      strMonth: "",
      idxMonth: 0,
      numDay: 0,
      strDay: "",
      numWeekday: 0,
      idxWeekday: 0,
      strFulltime: "",
      numHour: 0,
      strHour: "",
      numMinute: 0,
      strMinute: "",
      numSecond: 0,
      strSecond: "",
      numMillisecond: 0,
      strMillisecond: "",
    };
  }

  const numYear = date.getFullYear();
  const strYear = numToStr(numYear);
  const idxMonth = date.getMonth();
  const numMonth = idxMonth + 1;
  const strMonth = numToStr(numMonth);
  const numDay = date.getDate();
  const strDay = numToStr(numDay);
  const idxWeekday = date.getDay();
  const numWeekday = idxWeekday + 1;
  const strFulltime = date.toTimeString().substring(0, 8);
  const numHour = date.getHours();
  const strHour = numToStr(numHour);
  const numMinute = date.getMinutes();
  const strMinute = numToStr(numMinute);
  const numSecond = date.getSeconds();
  const strSecond = numToStr(numSecond);
  const numMillisecond = date.getMilliseconds();
  const strMillisecond = numToStr(numMillisecond);

  return {
    numYear,
    strYear,
    numMonth,
    strMonth,
    idxMonth,
    numDay,
    strDay,
    numWeekday,
    idxWeekday,
    strFulltime,
    numHour,
    strHour,
    numMinute,
    strMinute,
    numSecond,
    strSecond,
    numMillisecond,
    strMillisecond,
  };
}
