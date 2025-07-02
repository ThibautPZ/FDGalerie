import { isArrayNotEmpty } from "../typesAndValidationChecks";

const removeElement = (arrToRemove, removalIdx) => {
  arrToRemove.splice(removalIdx, 1);
  return true;
};
const testIndex = (testedArr, testedIndex, test, testFalse = false) => {
  const testedElement = testedArr[testedIndex];
  if (test(testedElement, testedIndex) === testFalse) {
    return removeElement(testedArr, testedIndex);
  }
  return false;
};

const trimArrayBothEnds = (targetArr, testingCb, options) => {
  const {
    quantityToTrim,
    filterOutWhenTestTrue = false,
    startWithLast = false,
    stayOnSameSideAfterNoRemoval = false,
  } = options;
  if (!isArrayNotEmpty(targetArr) || !quantityToTrim) {
    return targetArr;
  }

  let descIndexToTest = targetArr.length - 1;
  let ascIndexToTest = 0;
  let descIndexIsTested = startWithLast;
  let leftToTrim = quantityToTrim;

  const testDescIndex = () => {
    const hasElementBeenRemoved = testIndex(
      targetArr,
      descIndexToTest,
      testingCb,
      filterOutWhenTestTrue
    );

    if (hasElementBeenRemoved) {
      descIndexToTest -= 1;
      leftToTrim -= 1;
      if (stayOnSameSideAfterNoRemoval) {
        descIndexIsTested = !descIndexIsTested;
      }
    } else if (!stayOnSameSideAfterNoRemoval) {
      descIndexIsTested = !descIndexIsTested;
    }
    descIndexToTest -= 1;
  };

  const testAscIndex = () => {
    const hasElementBeenRemoved = testIndex(
      targetArr,
      ascIndexToTest,
      testingCb,
      filterOutWhenTestTrue
    );

    if (hasElementBeenRemoved) {
      descIndexToTest -= 1;
      leftToTrim -= 1;
      if (stayOnSameSideAfterNoRemoval) {
        descIndexIsTested = !descIndexIsTested;
      }
    } else {
      ascIndexToTest += 1;
      if (!stayOnSameSideAfterNoRemoval) {
        descIndexIsTested = !descIndexIsTested;
      }
    }
  };

  const recursiveTrim = () => {
    if (leftToTrim === 0 || ascIndexToTest > descIndexToTest) {
      return;
    }

    if (descIndexIsTested) {
      testDescIndex();
    } else {
      testAscIndex();
    }

    recursiveTrim();
  };

  recursiveTrim();

  return [...targetArr];
};

const trimArrayStart = (targetArr, testingCb, options) => {
  const { quantityToTrim, filterOutWhenTestTrue = false } = options;
  let indexToTest = 0;
  let leftToTrim = quantityToTrim;

  const testStartIndex = () => {
    const hasElementBeenRemoved = testIndex(
      targetArr,
      indexToTest,
      testingCb,
      filterOutWhenTestTrue
    );

    if (hasElementBeenRemoved) {
      leftToTrim -= 1;
    } else {
      indexToTest += 1;
    }
  };

  const recursiveTrimStart = () => {
    if (leftToTrim === 0 || indexToTest >= targetArr.length) {
      return;
    }
    testStartIndex();

    recursiveTrimStart();
  };

  recursiveTrimStart();

  return [...targetArr];
};

const trimArrayEnd = (targetArr, testingCb, options) => {
  const { quantityToTrim, filterOutWhenTestTrue = false } = options;
  let indexToTest = targetArr.length - 1;
  let leftToTrim = quantityToTrim;

  const recursiveTrim = () => {
    if (leftToTrim === 0 || indexToTest < 0) {
      return;
    }

    const hasElementBeenRemoved = testIndex(
      targetArr,
      indexToTest,
      testingCb,
      filterOutWhenTestTrue
    );

    if (hasElementBeenRemoved) {
      leftToTrim -= 1;
    }
    indexToTest -= 1;

    recursiveTrim();
  };

  recursiveTrim();

  return [...targetArr];
};
export { trimArrayBothEnds, trimArrayStart, trimArrayEnd };
