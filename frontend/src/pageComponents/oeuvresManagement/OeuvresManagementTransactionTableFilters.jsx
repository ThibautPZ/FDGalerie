import DebouncedInput from "../../components/customInputs/DebouncedInput";
import FilteringDateRange from "../../components/reactTable/FilteringDateRange";
import FilteringNumberRange from "../../components/reactTable/FilteringNumberRange";
import { isNumber } from "../../services/typesAndValidationChecks";

export default function OeuvresManagementTransactionTableFilters({
  tableData,
  transaction,
  t,
}) {
  const giveTableFilterValue = (colName) =>
    tableData.getColumn(colName).getFilterValue();

  const setTableFilterValue = (colName, value) => {
    return tableData.getColumn(colName).setFilterValue(value);
  };

  return (
    <div className="OeuvresManagementTransactionTableFilters">
      <p>{t("filterBy")}</p>
      <span>{t("filterByTitle")}</span>
      <DebouncedInput
        type="text"
        value={giveTableFilterValue("paintingTitle") || ""}
        placeholder={t("titleFilterPlaceholder")}
        onChange={(value) => setTableFilterValue("paintingTitle", value)}
        debounce={500}
      />
      <span>{t("filterByOwner")}</span>
      <DebouncedInput
        type="text"
        value={giveTableFilterValue("firstName_lastName") || ""}
        placeholder={t("ownerFilterPlaceholder")}
        onChange={(value) => setTableFilterValue("firstName_lastName", value)}
        debounce={500}
      />
      {transaction !== "gifts" ? (
        <>
          <span>{t("filterByPrice")}</span>
          <FilteringNumberRange
            colName="price"
            tableObj={tableData}
            minLabel={t("minPriceFilter")}
            minPlaceholder={t("minPriceFilterPlaceholder")}
            maxLabel={t("maxPriceFilter")}
            maxPlaceholder={t("maxPriceFilterPlaceholder")}
            debounce={500}
          />
        </>
      ) : (
        ""
      )}
      <span>{t("filterByDate")}</span>
      <FilteringDateRange
        colName="date"
        tableObj={tableData}
        minLabel={t("minDateFilter")}
        minPlaceholder={t("minDateFilterPlaceholder")}
        maxLabel={t("maxDateFilter")}
        maxPlaceholder={t("maxDateFilterPlaceholder")}
      />
      <fieldset>
        <legend>{t("filterByPaintingImagePresence")}</legend>
        <div>
          <input
            type="radio"
            id="allImagePresence"
            name="imagePresenceFilter"
            onChange={(event) =>
              setTableFilterValue("image", event.target.value)
            }
            value={null}
            checked={!isNumber(giveTableFilterValue("image"))}
          />
          <label htmlFor="allImagePresence">{t("allImagePresence")}</label>
        </div>
        <div>
          <input
            type="radio"
            id="hasImage"
            name="imagePresenceFilter"
            onChange={(event) =>
              setTableFilterValue("image", parseInt(event.target.value, 10))
            }
            value={1}
            checked={giveTableFilterValue("image") === 1}
          />
          <label htmlFor="hasImage">{t("hasPaintingImage")}</label>
        </div>
        <div>
          <input
            type="radio"
            id="noImage"
            name="imagePresenceFilter"
            onChange={(event) =>
              setTableFilterValue("image", parseInt(event.target.value, 10))
            }
            value={0}
            checked={giveTableFilterValue("image") === 0}
          />
          <label htmlFor="noImage">{t("noPaintingImage")}</label>
        </div>
      </fieldset>
      <button type="button" onClick={() => tableData.resetColumnFilters()}>
        {t("resetFilters")}
      </button>
    </div>
  );
}
