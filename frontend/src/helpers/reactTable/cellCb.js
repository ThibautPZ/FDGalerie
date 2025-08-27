import PaintingThumbMd from "../../components/image/PaintingThumbMd";

const defaultCellCb = (info) => info.getValue() || "-";

const thumbMdCellCb = ({ row }) => {
  const { original } = row;
  const { fileName } = original;
  return PaintingThumbMd({
    fileName,
    className: "PaintingThumbMd",
  });
};

const giveTranslationFromNameCellCb = (t) => {
  return (info) => {
    const value = info.getValue();
    return value ? t(`${value}.name`) : "-";
  };
};

const giveTranslationCellCb = (t) => {
  return (info) => {
    const value = info.getValue();
    return value ? t(value) : "-";
  };
};

const giveYesNoCellCb = (tCommon) => {
  return (info) => {
    const value = info.getValue();
    return value ? tCommon("yes") : tCommon("no");
  };
};

const giveLimitedTextCellCb = (textLimit) => {
  return (info) => {
    const value = info.getValue();
    if (!value) {
      return "-";
    }
    if (value.length > textLimit) {
      return `${value.substring(0, textLimit)}...`;
    }
    return value;
  };
};

const giveTextFieldsCellCb = (...fields) => {
  return (info) => {
    const { original } = info.row;
    let hasValues = false;
    const text = fields.map(
      ({ colName, translation = null, title = "", textLimit = 0 }) => {
        let value = original[colName];
        const textHeader = title ? `${title}: ` : "";
        if (!value) {
          return `${textHeader}-`;
        }
        hasValues = true;

        if (translation?.type === "byName") {
          value = `${textHeader}${translation.t(`${value}.name`)}`;
        } else if (translation) {
          value = `${textHeader}${translation.t(value)}`;
        } else {
          value = `${textHeader}${value}`;
        }
        if (textLimit) {
          value = `${value.substring(0, textLimit)}...`;
        }
        return value;
      }
    );

    if (!hasValues) {
      return "-";
    }
    return text.join(", ");
  };
};

const giveDateCellCb = (t) => {
  return (info) => {
    const value = info.getValue();
    return value
      ? t("intlDate", {
          val: new Date(value),
          formatParams: {
            val: { year: "numeric", month: "long", day: "numeric" },
          },
        })
      : "-";
  };
};

export {
  defaultCellCb,
  thumbMdCellCb,
  giveTranslationFromNameCellCb,
  giveTranslationCellCb,
  giveYesNoCellCb,
  giveLimitedTextCellCb,
  giveTextFieldsCellCb,
  giveDateCellCb,
};
