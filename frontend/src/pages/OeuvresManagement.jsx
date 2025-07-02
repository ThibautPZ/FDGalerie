import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import "../scss/OeuvresManagement.scss";

import axiosInstance from "../services/axiosInstance";
import OeuvresManagementList from "../pageComponents/oeuvresManagement/OeuvresManagementList";
import OeuvresManagementDetailedOeuvre from "../pageComponents/oeuvresManagement/OeuvresManagementDetailedOeuvre";
import OeuvresManagementCreateOeuvre from "../pageComponents/oeuvresManagement/OeuvresManagementCreateOeuvre";
import PopUp from "../components/modals/PopUp";
import UseCreateContact from "../hooks/RQmutation/UseCreateContact";
import { isObjectNotEmpty } from "../services/typesAndValidationChecks";

function OeuvresManagement() {
  const { t } = useTranslation(["common", "pageText"]);
  const [selectedOeuvre, setSelectedOeuvre] = useState({});
  const [displayedComponents, setDisplayedComponents] = useState("default");
  const [popUpState, setPopUpState] = useState({
    modalOpen: false,
    content: {},
  });

  /**
   * Set modal content then displays it.
   * @param {string} title - Title text displayed.
   * @param {string} message - Message text displayed.
   * @param {string} [validationBtnReturnedStr] - String read by the parent, leading to a callback.
   * @param {string} [validationBtnText] - Text displayed in confirmation button. No text equals to no button.
   * @param {boolean} [hasCloseBtn] - True if close button is rendered
   * @param {string} [closeBtnText=OK] - Text displayed in cancel/close button.
   * @function
   */

  const handleModalInstall = (responseDataObj, translationPrefix) => {
    console.warn(responseDataObj, translationPrefix);

    setPopUpState({
      modalOpen: true,
      content: {
        responseDataObj,
        translationPrefix,
      },
    });
  };
  const createContactMutation = UseCreateContact(handleModalInstall);
  /**
   * Executed at modal closing: executes instruction if status is defined, then resets popUpState to undisplay modal
   * @param {string} [status] - String that indicates which function get used
   * @function
   */
  const handleCloseModal = (status, data) => {
    if (status === "backToOeuvresList") {
      setDisplayedComponents("oeuvresList");
    }
    if (status === "doCreateContact" && isObjectNotEmpty(data)) {
      const formData = {
        ...data,
        verificationBypass: "checkContactOrUserDoesntExist",
      };
      createContactMutation.mutate({
        formData,
      });
    }
    return setPopUpState({ modalOpen: false, content: {} });
  };

  const handleReturnClick = () => {
    return setDisplayedComponents("oeuvresList");
  };

  const separateTechniques = (oeuvreObj) => {
    const techArr = oeuvreObj.techniques.split("|");
    return { ...oeuvreObj, techniques: techArr };
  };

  const updateOeuvresWithSeparateTechniques = (oeuvresArr) => {
    const returnedArr = oeuvresArr.map((oeuvre) => {
      return separateTechniques(oeuvre);
    });
    return returnedArr;
  };

  const getOeuvresListFromDb = async () => {
    const url = "api/paintings/details";
    const res = await axiosInstance.get(url);
    return updateOeuvresWithSeparateTechniques(res.data);
  };

  const oeuvresQuery = useQuery({
    queryKey: ["oeuvres"],
    queryFn: getOeuvresListFromDb,
    // meta: {}
    throwOnError: true,
  });

  const handleNewOeuvreClick = () => {
    return setDisplayedComponents("newOeuvre");
  };

  const handleOeuvreSelected = (oeuvreId) => {
    setDisplayedComponents("detailedOeuvre");
    const oeuvresList = oeuvresQuery.data;
    const arr = [];
    oeuvresList.forEach((oeuvre) => oeuvre.id === oeuvreId && arr.push(oeuvre));
    return setSelectedOeuvre(arr[0]);
  };

  return (
    <div className="OeuvresManagement">
      {displayedComponents !== "newOeuvre" ? (
        <>
          <button type="button" onClick={() => handleNewOeuvreClick()}>
            {t("pageText:OeuvresManagement.OM.newOeuvre")}
          </button>
          <OeuvresManagementList
            oeuvresList={oeuvresQuery.data}
            selectedOeuvre={selectedOeuvre}
            handleOeuvreSelected={handleOeuvreSelected}
          />
        </>
      ) : (
        ""
      )}
      {displayedComponents === "detailedOeuvre" ? (
        <OeuvresManagementDetailedOeuvre oeuvre={selectedOeuvre} />
      ) : (
        ""
      )}
      {displayedComponents === "newOeuvre" ? (
        <OeuvresManagementCreateOeuvre
          handleReturnClick={handleReturnClick}
          handleModalInstall={handleModalInstall}
          createContactMutation={createContactMutation}
        />
      ) : (
        ""
      )}
      {popUpState.modalOpen ? (
        <PopUp
          isOpen={popUpState.modalOpen}
          content={popUpState.content}
          onClose={handleCloseModal}
        />
      ) : null}
    </div>
  );
}

export default OeuvresManagement;
