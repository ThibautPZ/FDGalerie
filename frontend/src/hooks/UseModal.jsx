import { useState } from "react";
import { isObject } from "../services/typesAndValidationChecks";

/**
 * @function UseModal Hook that returns an object containg state and function relative to modals
 * @returns {{popUpState: Object, setPopUpState: Function, handleModalInstall: handleModalInstall, giveOnClose: Function}}
 */
const UseModal = () => {
  const [popUpState, setPopUpState] = useState({
    modalOpen: false,
    content: {},
  });
  //  * @function handleModalInstall - The function `handleModalInstall` sets the state to open a modal with specific content based on the
  //  * response data object and translation prefix provided.
  /**
   * @typedef {Function} handleModalInstall

   * @param {Object} responseDataObj
   * @param {string} [responseDataObj.type] - Type of modal to be displayed, i.e. "info", "confirmation", "warn", "error"
   * @param {string} responseDataObj.message - String to provide to i18n as key
   * @param {Object} [responseDataObj.confirmationData] - Object that contains values to be used by confirmationPopUp
   * @param { string } [responseDataObj.confirmationData.case] - Object that contains values to be used by confirmationPopUp
   * @param {Object[]} [responseDataObj.confirmationData.matchingPeople] - Object that contains values of users and/or contacts
   * @param {Object} responseDataObj.confirmationData.matchingPeople[].personInfos - Object that contains values to be used by confirmationPopUp
   * @param {string} translationPrefix - String to provide to i18n as namespace
   */

  const handleModalInstall = (responseDataObj, translationPrefix) => {
    setPopUpState({
      modalOpen: true,
      content: {
        responseDataObj,
        translationPrefix,
      },
    });
  };

  /**
   * @function giveOnClose - Returns a function that handle modal closing event. Takes any number of objects that supplies a status identifier and a corresponding callback to fire on modal closing.
   * @param {...{status: string, cb: function }} [arg]
   * @returns {Function} closeModalFunc
   */
  const giveOnClose = (...arg) => {
    /**
     * @function closeModalFunc - Closes a modal and executes a callback function based on a given
     * status and data.
     * @param {string} status
     * @param {Object} data
     */
    const closeModalFunc = (status, data = {}) => {
      if (!isObject(data)) {
        console.error("data not obj");
        return setPopUpState({ modalOpen: false, content: {} });
      }
      if (status) {
        const obj = arg.find((el) => el.status === status);
        obj?.cb(data);
      }
      return setPopUpState({ modalOpen: false, content: {} });
    };
    return closeModalFunc;
  };
  return { popUpState, setPopUpState, handleModalInstall, giveOnClose };
};

export default UseModal;
