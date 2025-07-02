import { trimArrayBothEnds } from "../arrayMethods/trimArray";
import giveRelativeTime from "./giveRelativeTime";

const timeUnits = [
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond",
];

export default function giveElapsedTime(
  precision,
  comparedDate,
  referenceDate
) {
  const timeDifference = giveRelativeTime(comparedDate, referenceDate);

  const valuesToBeCurated = 7 - precision;

  const findNonZeroValues = () => {
    const values = timeDifference.map((el, idx) => {
      const pushedObj = {
        timeUnit: timeUnits[idx],
        value: el,
      };

      return pushedObj;
    });

    const isValueZero = (valueObj) => {
      if (valueObj.value === 0) {
        return true;
      }
      return false;
    };

    const curatedValues = trimArrayBothEnds(values, isValueZero, {
      quantityToTrim: valuesToBeCurated,
      filterOutWhenTestTrue: true,
      stayOnSameSideAfterNoRemoval: false,
    });

    const elementsStillToRemove = curatedValues.length - precision;
    if (elementsStillToRemove > 0) {
      for (let i = elementsStillToRemove; i > 0; i -= 1) {
        curatedValues.pop();
      }
    }

    return curatedValues;
  };
  const returnedTimeDiff = findNonZeroValues();

  return returnedTimeDiff;
}
