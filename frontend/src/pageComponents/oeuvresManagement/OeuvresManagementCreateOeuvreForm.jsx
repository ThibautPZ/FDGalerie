import { useTranslation } from "react-i18next";

import "../../scss/Oeuvre.scss";
import FormCore from "../../components/FormCore";
import { isArrayNotEmpty } from "../../services/typesAndValidationChecks";
import axiosInstance from "../../services/axiosInstance";
import createOeuvreDefaultValues from "../../json/formDefaultValues/createOeuvreDefaultValues.json";

// todo: create big text box collapsable on unfocus to leave comment, create conditional deactivating

function OeuvresManagementCreateOeuvreForm({ mutation }) {
  const { t } = useTranslation(["common", "pageText"]);

  const fetchUsersAndContactsMatchingSearch = async (searchedArrOfStr) => {
    if (!isArrayNotEmpty(searchedArrOfStr)) {
      return [];
    }

    const searchedStr = `${searchedArrOfStr[0] || "!null"}&${
      searchedArrOfStr[1] || "!null"
    }`;

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
              inputmode: "decimalPrec2",
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
              inputmode: "decimalPrec2",
              label: {
                namespace: `common:info.cm`,
                placeHolder: t(`common:info.height`),
              },
            },
          ],
        },
      ],
    },
    { name: "oeuvreFamily", input: "select" },
    {
      name: "artistComment",
      input: "text",
      label: {
        namespace: `pageText:OeuvresManagement.OMCreateOeuvre.artistComment`,
        placeHolder: t(
          `pageText:OeuvresManagement.OMCreateOeuvre.artistCommentPlaceHolder`
        ),
        count: "artistComment",
      },
    },
    {
      name: "oeuvreAvailability",
      label: {
        namespace: "pageText:OeuvresManagement.OMCreateOeuvre.available",
      },
      input: "select",
      options: [
        { value: 4 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 5 },
      ],
    },
    {
      groupClassname: "oeuvreGivenInfos",
      includedComponents: [
        {
          groupClassname: "oeuvreGivenToKnownPerson",
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
                  {
                    searchedValue: "contactId",
                    namespace: "common:info.contact",
                  },
                  { searchedValue: "userId", namespace: "common:userTypes.1" },
                ],
                displayedInfo: "namespace",
              },
              queryResponseEmptyLabel:
                "pageText:OeuvresManagement.OMCreateOeuvre.noUserMatch",
            },
          },
        },
        {
          name: "giftDate",
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreGivenDate",
          },
          input: "date",
        },
      ],

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
      includedComponents: [
        {
          groupClassname: "oeuvreSoldPerson",
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
                  {
                    searchedValue: "contactId",
                    namespace: "common:info.contact",
                  },
                  { searchedValue: "userId", namespace: "common:userTypes.1" },
                ],
                displayedInfo: "namespace",
              },
              queryResponseEmptyLabel:
                "pageText:OeuvresManagement.OMCreateOeuvre.noUserMatch",
            },
          },
        },
        {
          name: "saleDate",
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreSoldDate",
          },
          input: "date",
        },
        {
          name: "salePrice",
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreSoldPrice",
          },
          input: "text",
          inputmode: "priceEur",
        },
      ],
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
      groupClassname: "oeuvreReservationInfos",
      includedComponents: [
        {
          groupClassname: "oeuvreReservedPerson",
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
                  {
                    searchedValue: "contactId",
                    namespace: "common:info.contact",
                  },
                  { searchedValue: "userId", namespace: "common:userTypes.1" },
                ],
                displayedInfo: "namespace",
              },
              queryResponseEmptyLabel:
                "pageText:OeuvresManagement.OMCreateOeuvre.noUserMatch",
            },
          },
        },
        {
          name: "reservationDate",
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreReservedDate",
          },
          input: "date",
        },
        {
          name: "reservationPrice",
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreReservedPrice",
          },
          input: "text",
          inputmode: "priceEur",
        },
      ],
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
      conditionalDisabling: {
        disbledWhenNoMatch: false,
        behaviour: "default",
        hatedFields: [
          {
            name: "oeuvreFile",
            values: [null],
          },
        ],
      },
    },
    {
      groupClassname: "noVisibilityCuzNoFile",
      includedComponents: [
        {
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.noVisibilityCuzNoFile",
          },
          input: "label",
        },
      ],
      conditionalRendering: {
        hiddenWhenNoMatch: true,
        behaviour: "default",
        lovedFields: [
          {
            name: "oeuvreFile",
            values: [null],
          },
        ],
      },
    },
  ];

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
    oeuvreFamily: {
      key: "oeuvreFamily",
      url: "families",
      labelData: "name",
      valuesData: "id",
    },
  };

  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <FormCore
        className="CreateOeuvreForm"
        mutation={mutation}
        defaultValues={createOeuvreDefaultValues}
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
