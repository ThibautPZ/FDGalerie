import giveElapsedTime from "../../services/dateTimeMethods/giveElapsedTime";
import {
  dateFormatter,
  relativeTimeFormatter,
} from "../../services/i18n/formatAdapters";
import tranlationInstance from "../../services/translationInstance";

export default function DateWithElapsedTime({ date }) {
  const tCommon = tranlationInstance("common");
  const formatedDate = dateFormatter("YYYY-MM-DD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const elapsedTime = giveElapsedTime(2, date);

  const otherTime = tCommon("intlRelativeTimeNoText", {
    val: elapsedTime[1].value,
    range: elapsedTime[1].timeUnit,
  });

  const formatedRelativeTimes = relativeTimeFormatter({
    range: elapsedTime[0].timeUnit,
    style: "long",
    other: otherTime,
  });
  return (
    <span>
      <span>{tCommon("intlDate", formatedDate(date))}</span>{" "}
      <span>
        ({" "}
        {tCommon(
          "intlRelativeTimes",
          formatedRelativeTimes(elapsedTime[0].value)
        )}
        )
      </span>
    </span>
  );
}
