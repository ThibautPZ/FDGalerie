import { useTranslation } from "react-i18next";

function OeuvresManagementOeuvrePanel({
  oeuvre,
  displayedInfos,
  disabled,
  handleOeuvreSelected,
}) {
  const { t } = useTranslation(["common", "pageText"]);

  const techniquesArrToStr = (arr) => {
    if (arr.length < 2) {
      return arr.toString();
    }
    const returnedArr = arr.map((technique, index) => {
      if (index === 0) {
        return `${technique}`;
      }
      return ` ${technique.toLowerCase()}`;
    });
    return returnedArr.toString();
  };

  return (
    <div className="OeuvresManagementOeuvrePanel">
      <button
        type="button"
        onClick={() => handleOeuvreSelected(oeuvre.id)}
        disabled={disabled}
      >
        {displayedInfos.picture ? (
          <div id="OeuvrePanelpicture">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${
                import.meta.env.VITE_PAINTINGS_PATH
              }/${oeuvre.pathname}`}
              alt={oeuvre.title}
            />
          </div>
        ) : (
          ""
        )}
        {displayedInfos.title ? (
          <div id="OeuvrePaneltitle">
            <p>{oeuvre.title}</p>
          </div>
        ) : (
          ""
        )}
        {displayedInfos.techniques ? (
          <div id="OeuvrePaneltechniques">
            <p>{techniquesArrToStr(oeuvre.techniques)}</p>
          </div>
        ) : (
          ""
        )}
        {displayedInfos.support ? (
          <div id="OeuvrePanelsupport">
            <p>{oeuvre.support}</p>
          </div>
        ) : (
          ""
        )}
        {displayedInfos.format ? (
          <div id="OeuvrePanelformat">
            <p>{oeuvre.format}</p>
            <div>{`${oeuvre.width}x${oeuvre.height}`}</div>
          </div>
        ) : (
          ""
        )}
        {displayedInfos.family ? (
          <div id="OeuvrePanelfamily">
            <p>{oeuvre.family || "/"}</p>
          </div>
        ) : (
          ""
        )}
        {displayedInfos.sold ? (
          <div id="OeuvrePanelsold">
            <p>{t(`common:oeuvreAvailability.${oeuvre.sold}`)}</p>
          </div>
        ) : (
          ""
        )}
        {displayedInfos.hasComment ? (
          <div id="OeuvrePanelhasComment">
            {!oeuvre.comment ? (
              <p>{t(`common:no`)}</p>
            ) : (
              <p>{t(`common:yes`)}</p>
            )}
          </div>
        ) : (
          ""
        )}
        {displayedInfos.id ? (
          <div id="OeuvrePanelid">
            <p>{oeuvre.id}</p>
          </div>
        ) : (
          ""
        )}
      </button>
    </div>
  );
}
export default OeuvresManagementOeuvrePanel;
