import { useTranslation } from "react-i18next";

import "../../scss/Oeuvre.scss";
import FormCore from "../../components/FormCore";
import { isArrayNotEmpty } from "../../services/typesAndValidationChecks";
import axiosInstance from "../../services/axiosInstance";

function OeuvresManagementCreateOeuvreForm({ mutation, handleReturnClick }) {
  const { t } = useTranslation(["common", "pageText"]);

  const fetchUsersAndContactsMatchingSearch = async (searchedArrOfStr) => {
    if (!isArrayNotEmpty(searchedArrOfStr)) {
      return [];
    }

    const searchedStr = `${searchedArrOfStr[0] || "!null"}&${
      searchedArrOfStr[1] || "!null"
    }`;
    // let searchedStr = "";
    // if (isStringNotEmpty(searchedArrOfStr[0])) {
    //   searchedStr = searchedArrOfStr[0];
    // } else {
    //   searchedStr = "!firstname";
    // }
    // if (isStringNotEmpty(searchedArrOfStr[1])) {
    //   searchedStr = searchedArrOfStr[1];
    // } else {
    //   searchedStr = "!lastname";
    // }

    const url = `api/users/searchUsersAndContactsByName/${searchedStr}`;
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const formFields = [
    {
      name: "oeuvreFile",
      label: {
        namespace: "pageText:OeuvresManagement.OMCreateOeuvre.file",
        placeHolder: t("pageText:OeuvresManagement.OMCreateOeuvre.title"),
      },
      input: "file",
      uploadOptions: { fileTypes: "image", maxSize: "" },
    },
    {
      name: "oeuvreTitle",
      label: {
        namespace: "common:info.oeuvreTitle",
        placeHolder: t("pageText:OeuvresManagement.OMCreateOeuvre.title"),
      },

      input: "text",
    },
    {
      name: "oeuvreTechnique",
      input: "select",

      multiple: true,
    },
    { name: "oeuvreSupport", input: "select" },
    {
      groupClassname: "oeuvresFormatDimensions",
      includedComponents: [
        {
          name: "oeuvreFormat",
          label: {
            namespace: "pageText:OeuvresManagement.OMCreateOeuvre.format",
          },

          input: "select",
        },
        {
          groupClassname: "oeuvresDimensions",
          includedComponents: [
            {
              input: "label",
              label: { namespace: `common:info.dimensions` },
            },
            {
              name: "oeuvreWidth",
              input: "text",
              inputmode: "price",
              label: {
                namespace: "common:info.cm",
                placeHolder: t(`common:info.width`),
              },
            },
            {
              input: "label",
              label: { namespace: "common:info.x" },
            },
            {
              name: "oeuvreHeight",
              input: "text",
              inputmode: "price",
              label: {
                namespace: `common:info.cm`,
                placeHolder: t(`common:info.height`),
              },
            },
          ],
        },
      ],
    },
    {
      name: "oeuvreAvailability",
      label: {
        namespace: "pageText:OeuvresManagement.OMCreateOeuvre.available",
      },
      input: "select",
      options: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
      ],
    },
    {
      groupClassname: "oeuvreGivenInfos",
      specialGroup: {
        type: "DualSearchbarSetByResultSelectGroup",
        fields: {
          textField1: {
            name: "oeuvreGivenToFirstname",
            label: {
              namespace:
                "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreGivenToWho",
              placeHolder: t("pageText:inputPlaceHolder.firstname"),
            },
            valueKeysToSetWhenSelect: ["firstname"],
          },
          textField2: {
            name: "oeuvreGivenToLastname",
            label: {
              placeHolder: t("pageText:inputPlaceHolder.lastname"),
            },
            valueKeysToSetWhenSelect: ["lastname"],
          },
          selectField: {
            name: "oeuvreGivenToSelection",
            label: {
              namespace:
                "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreGivenToSelection",
              placeHolder: t("pageText:inputPlaceHolder.choosePerson"),
            },
          },
          selectedValueField: { name: "oeuvreGivenToKnownPerson" },
        },
        querySpecs: {
          queryType: "fetchDependsOnWatched",
          queryFunction: fetchUsersAndContactsMatchingSearch,
          responseKeysToBeOptionValues: [
            "userId",
            "contactId",
            "firstname",
            "lastname",
          ],
          responseKeysToBeOptionContent: ["firstname", "lastname"],
          additionalLabelInfo: {
            infoOfInterestType: "keyHasValue",
            infosOfInterest: [
              { searchedValue: "contactId", namespace: "common:info.contact" },
              { searchedValue: "userId", namespace: "common:userTypes.1" },
            ],
            displayedInfo: "namespace",
          },
          queryResponseEmptyLabel:
            "pageText:OeuvresManagement.OMCreateOeuvre.noUserMatch",
        },
      },
      conditionalRendering: {
        hiddenWhenNoMatch: true,
        behaviour: "default",
        wantedFields: [],
        unWantedFields: [],
        lovedFields: [
          {
            name: "oeuvreAvailability",
            values: [1],
          },
        ],
        hatedFields: [],
      },
    },
    {
      groupClassname: "oeuvreSoldInfos",
      specialGroup: {
        type: "DualSearchbarSetByResultSelectGroup",
        fields: {
          textField1: {
            name: "oeuvreSoldToFirstname",
            label: {
              namespace:
                "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreSoldToWho",
              placeHolder: t("pageText:inputPlaceHolder.firstname"),
            },
            valueKeysToSetWhenSelect: ["firstname"],
          },
          textField2: {
            name: "oeuvreSoldToLastname",
            label: {
              placeHolder: t("pageText:inputPlaceHolder.lastname"),
            },
            valueKeysToSetWhenSelect: ["lastname"],
          },
          selectField: {
            name: "oeuvreSoldToSelection",
            label: {
              namespace:
                "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreGivenToKnownSelection",
              placeHolder: t("pageText:inputPlaceHolder.choosePerson"),
            },
          },
          selectedValueField: { name: "oeuvreSoldToKnownPerson" },
        },
        querySpecs: {
          queryType: "fetchDependsOnWatched",
          queryFunction: fetchUsersAndContactsMatchingSearch,
          responseKeysToBeOptionValues: [
            "userId",
            "contactId",
            "firstname",
            "lastname",
          ],
          responseKeysToBeOptionContent: ["firstname", "lastname"],
          additionalLabelInfo: {
            infoOfInterestType: "keyHasValue",
            infosOfInterest: [
              { searchedValue: "contactId", namespace: "common:info.contact" },
              { searchedValue: "userId", namespace: "common:userTypes.1" },
            ],
            displayedInfo: "namespace",
          },
          queryResponseEmptyLabel:
            "pageText:OeuvresManagement.OMCreateOeuvre.noUserMatch",
        },
      },
      conditionalRendering: {
        hiddenWhenNoMatch: true,
        behaviour: "default",
        lovedFields: [
          {
            name: "oeuvreAvailability",
            values: [2],
          },
        ],
      },
    },
    {
      groupClassname: "oeuvreReservedInfos",
      specialGroup: {
        type: "DualSearchbarSetByResultSelectGroup",
        fields: {
          textField1: {
            name: "oeuvreReservedToFirstname",
            label: {
              namespace:
                "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreReservedToWho",
              placeHolder: t("pageText:inputPlaceHolder.firstname"),
            },
            valueKeysToSetWhenSelect: ["firstname"],
          },
          textField2: {
            name: "oeuvreReservedToLastname",
            label: {
              placeHolder: t("pageText:inputPlaceHolder.lastname"),
            },
            valueKeysToSetWhenSelect: ["lastname"],
          },
          selectField: {
            name: "oeuvreReservedToSelection",
            label: {
              namespace:
                "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreGivenToSelection",
              placeHolder: t("pageText:inputPlaceHolder.choosePerson"),
            },
          },
          selectedValueField: { name: "oeuvreReservedToKnownPerson" },
        },
        querySpecs: {
          queryType: "fetchDependsOnWatched",
          queryFunction: fetchUsersAndContactsMatchingSearch,
          responseKeysToBeOptionValues: [
            "userId",
            "contactId",
            "firstname",
            "lastname",
          ],
          responseKeysToBeOptionContent: ["firstname", "lastname"],
          additionalLabelInfo: {
            infoOfInterestType: "keyHasValue",
            infosOfInterest: [
              { searchedValue: "contactId", namespace: "common:info.contact" },
              { searchedValue: "userId", namespace: "common:userTypes.1" },
            ],
            displayedInfo: "namespace",
          },
          queryResponseEmptyLabel:
            "pageText:OeuvresManagement.OMCreateOeuvre.noUserMatch",
        },
      },
      conditionalRendering: {
        hiddenWhenNoMatch: true,
        behaviour: "default",
        lovedFields: [
          {
            name: "oeuvreAvailability",
            values: [3],
          },
        ],
      },
    },
    {
      name: "oeuvreVisibility",
      label: {
        namespace: "pageText:OeuvresManagement.OMCreateOeuvre.visibility",
      },
      input: "checkbox",
    },
  ];

  const defaultValues = {
    oeuvreFile: {},
    oeuvreTitle: "",
    oeuvreTechnique: [],
    oeuvreSupport: "",
    oeuvreFormat: "",
    oeuvreWidth: "",
    oeuvreHeight: "",
    oeuvreAvailability: "",
    oeuvreGivenToFirstname: "",
    oeuvreGivenToLastname: "",
    oeuvreGivenToSelection: "",
    oeuvreGivenToKnownPerson: "",
    oeuvreSoldToFirstname: "",
    oeuvreSoldToLastname: "",
    oeuvreSoldToSelection: "",
    oeuvreSoldToKnownPerson: "",
    oeuvreReservedToFirstname: "",
    oeuvreReservedToLastname: "",
    oeuvreReservedToSelection: "",
    oeuvreReservedToKnownPerson: "",
    contactLastname: "",
    oeuvreVisibility: "",
  };
  const addedValues = {};
  const asyncVal = {
    oeuvreFormat: {
      key: "oeuvreFormat",
      url: "paintingSizes",
      labelData: "name",
      valuesData: "id",
    },
    oeuvreSupport: {
      key: "oeuvreSupport",
      url: "supports",
      labelData: "name",
      valuesData: "id",
    },
    oeuvreTechnique: {
      key: "oeuvreTechnique",
      url: "techniques",
      labelData: "name",
      valuesData: "id",
    },
  };

  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <button type="button" onClick={() => handleReturnClick()}>
        {t("pageText:OeuvresManagement.OMCreateOeuvre.return")}
      </button>
      <FormCore
        className="CreateOeuvreForm"
        mutation={mutation}
        defaultValues={defaultValues}
        addedValues={addedValues}
        asyncValues={asyncVal}
        fields={formFields}
        submitbuttonText={t(
          "pageText:OeuvresManagement.OMCreateOeuvre.submitBtnText"
        )}
      />
    </div>
  );
}

export default OeuvresManagementCreateOeuvreForm;
