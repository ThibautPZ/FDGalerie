import DebouncedInput from "../../components/customInputs/DebouncedInput";

export default function OeuvresManagementAttributesTableFilters({
  tableData,

  t,
}) {
  const giveTableFilterValue = (colName) =>
    tableData.getColumn(colName).getFilterValue();

  const setTableFilterValue = (colName, value) => {
    return tableData.getColumn(colName).setFilterValue(value);
  };

  return (
    <div className="OeuvresManagementAttributesTableFilters">
      <p>{t("filterBy")}</p>
      <span>{t("filterByNameFr")}</span>
      <DebouncedInput
        type="text"
        value={giveTableFilterValue("name_Fr") || ""}
        placeholder={t("nameFrFilterPlaceholder")}
        onChange={(value) => setTableFilterValue("name_Fr", value)}
        debounce={500}
      />
      <span>{t("filterByNameEnUS")}</span>
      <DebouncedInput
        type="text"
        value={giveTableFilterValue("name_EnUS") || ""}
        placeholder={t("nameEnUSFilterPlaceholder")}
        onChange={(value) => setTableFilterValue("name_EnUS", value)}
        debounce={500}
      />
      <span>{t("filterByNameEnGB")}</span>
      <DebouncedInput
        type="text"
        value={giveTableFilterValue("name_EnGB") || ""}
        placeholder={t("nameEnGBFilterPlaceholder")}
        onChange={(value) => setTableFilterValue("name_EnGB", value)}
        debounce={500}
      />
      <button type="button" onClick={() => tableData.resetColumnFilters()}>
        {t("resetFilters")}
      </button>
    </div>
  );
}
