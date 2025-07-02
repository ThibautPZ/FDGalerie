import { useState } from "react";
import { useTranslation } from "react-i18next";
import OeuvresManagementOeuvrePanel from "./OeuvresManagementOeuvrePanel";

function OeuvresManagementList({
  oeuvresList,
  selectedOeuvre,
  handleOeuvreSelected,
}) {
  const { t } = useTranslation(["common", "pageText"]);

  // todo: figure out why setDisplayedInfos isn't used (it's send currently as props to OMOP to trick eslint, but unused whatsoever)
  const [displayedInfos, setDisplayedInfos] = useState({
    picture: true,
    title: true,
    techniques: true,
    support: true,
    format: true,
    family: true,
    sold: true,
    hasComment: true,
    id: true,
  });

  const displayInfosLegend = (infosObj) => {
    const returnedArr = [];
    for (const [key, value] of Object.entries(infosObj)) {
      if (value) {
        returnedArr.push(key);
      }
    }
    return returnedArr;
  };

  return oeuvresList?.length ? (
    <div className="OeuvresManagementList">
      <label htmlFor="infoDisplayedSelect">
        {t("pageText:UtilisateurManagement.UMList.displayed")}
      </label>
      <select
        name="infoDisplayedSelect"
        id="infoDisplayedSelect"
        multiple
        onChange={(e) => handleOeuvreSelected(e.target.value)}
      >
        <option value="picture">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.picture")}
        </option>
        <option value="title">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.title")}
        </option>
        <option value="techniques">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.techniques")}
        </option>
        <option value="support">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.support")}
        </option>
        <option value="format">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.format")}
        </option>
        <option value="family">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.family")}
        </option>
        <option value="sold">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.sold")}
        </option>
        <option value="hasComment">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.hasComment")}
        </option>
        <option value="id">
          {t("pageText:OeuvresManagement.OMOeuvrePanel.id")}
        </option>
      </select>

      <div className="OMLInfosLegend">
        {displayInfosLegend(displayedInfos).map((info) =>
          info === "picture" ? (
            <div key={info} id="pictureSpacer">
              {" "}
            </div>
          ) : (
            <button key={info} type="button" id={`OeuvrePanel${info}`}>
              {t(`pageText:OeuvresManagement.OMOeuvrePanel.${info}`)}
            </button>
          )
        )}
      </div>
      <div>
        {oeuvresList.map((oeuvre) => (
          <OeuvresManagementOeuvrePanel
            key={oeuvre.id}
            oeuvre={oeuvre}
            displayedInfos={displayedInfos}
            setDisplayedInfos={setDisplayedInfos}
            disabled={oeuvre.id === selectedOeuvre.id}
            handleOeuvreSelected={handleOeuvreSelected}
          />
        ))}
      </div>
    </div>
  ) : (
    ""
  );
}
export default OeuvresManagementList;
