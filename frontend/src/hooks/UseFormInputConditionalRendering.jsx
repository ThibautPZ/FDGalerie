function UseFormInputConditionalRendering(watch, conditions) {
  if (!conditions) {
    return false;
  }

  const hideInput = conditions.hiddenWhenNoMatch || false;

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

    if (typeof watchedValueStrOrArr !== "object") {
      return watchedValueStrOrArr === targetedValue;
    }

    return watchedValueStrOrArr.value === targetedValue;

    // return watchedValueStrOrArr === targetedValue;
  };

  const hasFieldTargetedValues = (fieldObj) => {
    if (!fieldObj.values || !fieldObj.values[0]) {
      return false;
    }

    const watchedValue = watch(fieldObj.name);

    const matchingFieldValues = fieldObj.values.filter((value) =>
      isWatchedValueEqualToTargetedValue(watchedValue, value)
    );
    if (!matchingFieldValues[0]) {
      return false;
    }

    return true;
  };

  const haveFieldsTargetedValues = (fieldsArr) => {
    if (!fieldsArr || !fieldsArr[0]) {
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
