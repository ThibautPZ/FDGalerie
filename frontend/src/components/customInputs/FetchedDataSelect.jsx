import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

import CustomOption from "../customComponents/CustomOption";

/**
 * Renders a select field with its label to display in a FormCore form.
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.multipleSelection] - Determines if multiple options can be selected
 * @param {string} props.fieldName - Field name in RHF
 * @param {Array.<{key: (string|number), value: (string|number), defaultValue:boolean, label: (string|number)}>} props.options - Array containing objects with RadioInput data
 * @param {*} [props.defaultValue] - Input default value
 * @param {{name: string, onChange: function, onBlur: function, ref: function}} props.register - Object containing RHF register tools
 * @param {{type: string, message: string, ref: Object}} props.error - Object containing errors due to form registerOptions
 * @param {function} props.t - Function i18n which returns a string in specified language
 * @returns {JSX.Element} Rendered radio container with a label with each radio input.
 */
function FetchedDataSelect({
  fieldName,
  label,
  isHidden,
  multipleSelection,
  watchedInputs,
  query,
  onSelectedFunction,
  registerOptions,
  error,
  t,
}) {
  const placeholder =
    label?.placeHolder || t(`pageText:inputPlaceHolder.${fieldName}`);

  const {
    queryType,
    queryFunction,
    responseKeysToBeOptionValues,
    responseKeysToBeOptionContent,
    additionalLabelInfo,
    queryResponseEmptyLabel,
  } = query;
  const { watchedInputNames } = watchedInputs;

  const { watch, getValues, control } = useFormContext();

  const queryFunctionArguments = [];

  if (queryType === "fetchDependsOnWatched") {
    const watchedInputData = watch(watchedInputNames);
    if (watchedInputData?.length === 1) {
      queryFunctionArguments.push(watchedInputData[0]);
    }
    if (watchedInputData?.length > 1) {
      queryFunctionArguments.push(...watchedInputData);
    }
  }

  const selectOptionsQuery = useQuery({
    queryKey: [fieldName, { type: queryType, sent: queryFunctionArguments }],
    queryFn: () => queryFunction([...queryFunctionArguments]),
    throwOnError: true,
  });

  const labelNs = label?.namespace || `common:info.${fieldName}`;

  const giveOptionValue = (queryResponseKeysArr, queryResponseObj) => {
    const returnedObj = {};
    if (Array.isArray(queryResponseKeysArr) && queryResponseObj) {
      queryResponseKeysArr.forEach((key) => {
        if (typeof key === "string") {
          Object.assign(returnedObj, { [key]: queryResponseObj[key] || null });
        }
      });
    }

    return returnedObj;
  };

  const isFieldHidden = () => {
    const fieldValue = getValues(watchedInputNames);
    if (isHidden === true || !fieldValue) {
      return true;
    }
    return false;
  };

  const giveResultsOptions = (
    labelKeys,
    valueKeys,
    queryData,
    searchedKeys,
    additionalLabelData
  ) => {
    if (!queryData) {
      return [];
    }
    const returnedArr = queryData.map((obj) => {
      return {
        label: { labelKeys, searchedKeys, additionalLabelData },
        value: giveOptionValue(valueKeys, obj),
      };
    });
    return returnedArr;
  };

  const handleChange = (changeEvent, onChangeFunc) => {
    if (onSelectedFunction) {
      onSelectedFunction(changeEvent);
    }
    return onChangeFunc(changeEvent);
  };

  if (selectOptionsQuery.data?.searchResults?.length) {
    const options = giveResultsOptions(
      responseKeysToBeOptionContent,
      responseKeysToBeOptionValues,
      selectOptionsQuery.data.searchResults,
      selectOptionsQuery.data.searchedParams,
      additionalLabelInfo
    );

    return (
      <div
        hidden={isFieldHidden()}
        aria-invalid={error ? "true" : "false"}
        className={fieldName}
      >
        <label htmlFor={fieldName}>{t(labelNs)}</label>
        <Controller
          name={fieldName}
          control={control}
          rules={registerOptions}
          render={({ field: { onChange, onBlur, name, ref, value } }) => (
            <Select
              options={options}
              placeholder={placeholder}
              onChange={(e) => handleChange(e, onChange)}
              // onChange={onChange}
              onBlur={onBlur}
              name={name}
              ref={ref}
              value={value}
              components={{ Option: CustomOption }}
              isMulti={multipleSelection}
            />
          )}
        />
      </div>
    );
  }

  if (selectOptionsQuery.data?.searchResults?.length === 0) {
    return (
      <div
        hidden={isFieldHidden()}
        aria-invalid={error ? "true" : "false"}
        className={fieldName}
      >
        {t(queryResponseEmptyLabel)}
      </div>
    );
  }
}

export default FetchedDataSelect;
