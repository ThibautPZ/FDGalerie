import Select from "react-select";

import tranlationInstance from "../../services/translationInstance";
import {
  isArrayNotEmpty,
  isNumber,
  isObjectNotEmpty,
  isStringNotEmpty,
} from "../../services/typesAndValidationChecks";
import DebouncedInput from "../../components/customInputs/DebouncedInput";

export default function OeuvresListFilters({
  tableData,
  techniques,
  families,
  formats,
  supports,
}) {
  const [
    tTechniques,
    tSupports,
    tFormats,
    tFamilies,
    tAvailability,
    tPageText,
  ] = tranlationInstance(
    "techniques",
    "supports",
    "paintingSizes",
    "families",
    "common:oeuvreAvailability",
    "pageText:OeuvresManagement.OMOeuvresList"
  );
  const giveTableFilterValue = (colName) =>
    tableData.getColumn(colName).getFilterValue();

  const setTableFilterValue = (colName, value) => {
    return tableData.getColumn(colName).setFilterValue(value);
  };

  const giveOptionObj = (value, options) => {
    const { translationFn, optionsObj } = options;
    if (!isStringNotEmpty(value)) {
      return null;
    }
    if (translationFn) {
      return { value, label: translationFn(`${value}.name`) };
    }
    if (isObjectNotEmpty(optionsObj)) {
      return { value, label: optionsObj[value] };
    }
    return { value, label: value };
  };

  const giveOptionsArr = (valuesArr, options) => {
    if (!isArrayNotEmpty(valuesArr)) {
      return [];
    }
    return valuesArr.map(({ name }) => {
      return giveOptionObj(name, options);
    });
  };

  const techniqueFilterOptions = giveOptionsArr(techniques, {
    translationFn: tTechniques,
  });
  const familyFilterOptions = giveOptionsArr(families, {
    translationFn: tFamilies,
  });
  const formatFilterOptions = giveOptionsArr(formats, {
    translationFn: tFormats,
  });
  const supportFilterOptions = giveOptionsArr(supports, {
    translationFn: tSupports,
  });

  const availabilities = {
    given: tAvailability("given"),
    sold: tAvailability("sold"),
    reserved: tAvailability("reserved"),
    available: tAvailability("available"),
    unavailable: tAvailability("unavailable"),
  };

  const availabilityFilterOptions = Object.entries(availabilities).map(
    ([value, label]) => ({ value, label })
  );

  const giveMultipleOptionValues = (colName, translationFn) => {
    const valuesArr = giveTableFilterValue(colName);
    if (!isArrayNotEmpty(valuesArr)) {
      return [];
    }
    return valuesArr.map((value) => {
      return giveOptionObj(value, translationFn);
    });
  };

  const onMultipleSelectChange = (valuesArr, colName) => {
    const valuesToSet = valuesArr.map(({ value }) => value);
    return setTableFilterValue(colName, valuesToSet);
  };

  return (
    <div className="OeuvresManagementOeuvresListFilters">
      <p>{tPageText("filterBy")}</p>
      <span>{tPageText("filterByTitle")}</span>
      <DebouncedInput
        type="text"
        value={giveTableFilterValue("title") || ""}
        placeholder={tPageText("titleFilterPlaceholder")}
        onChange={(value) => setTableFilterValue("title", value)}
        debounce={500}
      />
      <span>{tPageText("filterByTechnique")}</span>
      <Select
        isClearable
        options={techniqueFilterOptions}
        placeholder={tPageText("techniqueFilterPlaceholder")}
        onChange={(value) => onMultipleSelectChange(value, "techniques")}
        name="techniquesFilter"
        value={giveMultipleOptionValues("techniques", {
          translationFn: tTechniques,
        })}
        controlShouldRenderValue
        hideSelectedOptions
        isMulti
      />
      <span>{tPageText("filterBySupport")}</span>
      <Select
        isClearable
        options={supportFilterOptions}
        placeholder={tPageText("supportFilterPlaceholder")}
        onChange={(value) => onMultipleSelectChange(value, "support")}
        name="supportFilter"
        value={giveMultipleOptionValues("support", {
          translationFn: tSupports,
        })}
        controlShouldRenderValue
        hideSelectedOptions
        isMulti
      />
      <span>{tPageText("filterByFormat")}</span>
      <Select
        isClearable
        options={formatFilterOptions}
        placeholder={tPageText("formatFilterPlaceholder")}
        onChange={(value) => onMultipleSelectChange(value, "format")}
        name="formatFilter"
        value={giveMultipleOptionValues("format", {
          translationFn: tFormats,
        })}
        controlShouldRenderValue
        hideSelectedOptions
        isMulti
      />
      <span>{tPageText("filterByFamily")}</span>
      <Select
        isClearable
        options={familyFilterOptions}
        placeholder={tPageText("familyFilterPlaceholder")}
        onChange={(value) => onMultipleSelectChange(value, "family")}
        name="familyFilter"
        value={giveMultipleOptionValues("family", {
          translationFn: tFamilies,
        })}
        controlShouldRenderValue
        hideSelectedOptions
        isMulti
      />
      <span>{tPageText("filterByAvailability")}</span>
      <Select
        isClearable
        options={availabilityFilterOptions}
        placeholder={tPageText("availabilityFilterPlaceholder")}
        onChange={(value) => onMultipleSelectChange(value, "availabilityName")}
        name="availabilityFilter"
        value={giveMultipleOptionValues("availabilityName", {
          optionsObj: availabilities,
        })}
        controlShouldRenderValue
        hideSelectedOptions
        isMulti
      />
      <fieldset>
        <legend>{tPageText("filterByPubliclyVisible")}</legend>

        <div>
          <input
            type="radio"
            id="allVisibilities"
            name="publiclyVisible"
            onChange={(event) =>
              setTableFilterValue("publiclyVisible", event.target.value)
            }
            value={null}
            checked={!isNumber(giveTableFilterValue("publiclyVisible"))}
          />
          <label htmlFor="allVisibilities">
            {tPageText("allVisibilities")}
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="visible"
            name="publiclyVisible"
            onChange={(event) =>
              setTableFilterValue(
                "publiclyVisible",
                parseInt(event.target.value, 10)
              )
            }
            value={1}
            checked={giveTableFilterValue("publiclyVisible") === 1}
          />
          <label htmlFor="visible">{tPageText("visible")}</label>
        </div>

        <div>
          <input
            type="radio"
            id="hidden"
            name="publiclyVisible"
            onChange={(event) =>
              setTableFilterValue(
                "publiclyVisible",
                parseInt(event.target.value, 10)
              )
            }
            value={0}
            checked={giveTableFilterValue("publiclyVisible") === 0}
          />
          <label htmlFor="hidden">{tPageText("hidden")}</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>{tPageText("filterByPaintingImagePresence")}</legend>
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
          <label htmlFor="allImagePresence">
            {tPageText("allImagePresence")}
          </label>
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
          <label htmlFor="hasImage">{tPageText("hasPaintingImage")}</label>
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
          <label htmlFor="noImage">{tPageText("noPaintingImage")}</label>
        </div>
      </fieldset>
      <button type="button" onClick={() => tableData.resetColumnFilters()}>
        {tPageText("resetFilters")}
      </button>
    </div>
  );
}
