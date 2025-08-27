import {
  giveType,
  isArrayNotEmpty,
  isObjectNotEmpty,
} from "../services/typesAndValidationChecks";

const isValueFalsy = (value) => {
  if (!value) {
    return true;
  }
  const valueType = giveType(value);
  if (valueType === "array") {
    return !isArrayNotEmpty(value);
  }
  if (valueType === "object") {
    return !isObjectNotEmpty(value);
  }
  return false;
};

function UseFormInputConditionalRendering(watch, conditions) {
  if (!conditions) {
    return false;
  }

  const hideInput =
    conditions.hiddenWhenNoMatch || conditions.disbledWhenNoMatch || false;

  const isWatchedValueEqualToTargetedValue = (
    watchedValueStrOrArr,
    targetedValue
  ) => {
    if (Array.isArray(watchedValueStrOrArr)) {
      const matchingArr = watchedValueStrOrArr.filter((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return value === targetedValue;
        }

        return value.value === targetedValue;
      });
      if (!matchingArr[0]) {
        return false;
      }
      return true;
    }

    if (typeof watchedValueStrOrArr !== "object" || !watchedValueStrOrArr) {
      return watchedValueStrOrArr === targetedValue;
    }

    return watchedValueStrOrArr.value === targetedValue;
  };

  const hasFieldTargetedValues = (fieldObj) => {
    if (!fieldObj) {
      return false;
    }
    const { name, values } = fieldObj;

    const watchedValue = watch(name);

    const isWatchedValueFalsy = isValueFalsy(watchedValue);

    if (values === "falsy") {
      return isWatchedValueFalsy;
    }

    if (values === "truthy") {
      return !isWatchedValueFalsy;
    }

    const matchingFieldValues = fieldObj.values.filter((value) =>
      isWatchedValueEqualToTargetedValue(watchedValue, value)
    );

    return isArrayNotEmpty(matchingFieldValues);
  };

  const haveFieldsTargetedValues = (fieldsArr) => {
    if (!isArrayNotEmpty(fieldsArr)) {
      return false;
    }
    const matchingFieldsValues = fieldsArr.filter((fieldToBeWatched) =>
      hasFieldTargetedValues(fieldToBeWatched)
    );
    if (!matchingFieldsValues[0]) {
      return false;
    }
    return true;
  };

  const giveIsHiddenDependingOfBehaviour = (behaviourStr, presentValuesObj) => {
    const {
      isWantedPresent,
      isUnWantedPresent,
      isLovedPresent,
      isHatedPresent,
    } = presentValuesObj;
    // If no match, then return default isHidden value
    if (
      !isWantedPresent &&
      !isUnWantedPresent &&
      !isLovedPresent &&
      !isHatedPresent
    ) {
      return hideInput;
    }
    if (!behaviourStr || behaviourStr === "default") {
      if (
        (isHatedPresent && !isLovedPresent) ||
        (isUnWantedPresent && !isWantedPresent && !isLovedPresent)
      ) {
        return true;
      }
      return false;
    }
    if (behaviourStr === "exclusive") {
      if (
        (isLovedPresent && !isHatedPresent) ||
        (isWantedPresent && !isHatedPresent)
      ) {
        return false;
      }
      return true;
    }
    if (behaviourStr === "spiteful") {
      if (
        (isLovedPresent && !isHatedPresent) ||
        (isWantedPresent && !isHatedPresent && !isUnWantedPresent)
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  const isInputHidden = (conditionalRenderingObj) => {
    const {
      behaviour,
      wantedFields,
      unWantedFields,
      lovedFields,
      hatedFields,
    } = conditionalRenderingObj;

    const presentValues = {
      isWantedPresent: haveFieldsTargetedValues(wantedFields),
      isUnWantedPresent: haveFieldsTargetedValues(unWantedFields),
      isLovedPresent: haveFieldsTargetedValues(lovedFields),
      isHatedPresent: haveFieldsTargetedValues(hatedFields),
    };

    return giveIsHiddenDependingOfBehaviour(behaviour, presentValues);
  };

  return isInputHidden(conditions);
}
export default UseFormInputConditionalRendering;
