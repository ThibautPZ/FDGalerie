import { useTranslation } from "react-i18next";

import "../../scss/Oeuvre.scss";
import FormCore from "../../components/FormCore";
import { isArrayNotEmpty } from "../../services/typesAndValidationChecks";
import axiosInstance from "../../services/axiosInstance";
import tranlationInstance from "../../services/translationInstance";
import { minOneNonSpaceCharRegExp } from "../../services/regularExpressions";

function OeuvresManagementCreateOeuvreForm({
  mutation,
  formMethods,
  onSubmit,
  onSuccess,
  isFormModifying = false,
}) {
  const { t } = useTranslation(["common", "pageText"]);

  const [tCommon, tTechniques, tSupports, tFormats, tFamilies] =
    tranlationInstance(
      "common",
      "techniques",
      "supports",
      "paintingSizes",
      "families"
    );

  const submitBtnText = isFormModifying
    ? t("pageText:OeuvresManagement.OMModifyOeuvre.submitBtnText")
    : t("pageText:OeuvresManagement.OMCreateOeuvre.submitBtnText");

  const fetchUsersAndContactsMatchingSearch = async (searchedArrOfStr) => {
    if (!isArrayNotEmpty(searchedArrOfStr)) {
      return [];
    }
    const [firstName, lastName] = searchedArrOfStr;
    const searchedFirstname = minOneNonSpaceCharRegExp.test(firstName)
      ? firstName
      : "!null";
    const searchedLastname = minOneNonSpaceCharRegExp.test(lastName)
      ? lastName
      : "!null";

    if (searchedFirstname === "!null" && searchedLastname === "!null") {
      return [];
    }

    const url = `api/users/searchUsersAndContactsByName/${searchedFirstname}&${searchedLastname}`;
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const formFields = [
    {
      name: "oeuvreFile",
      label: {
        namespace: "pageText:OeuvresManagement.OMCreateOeuvre.file",
        placeHolder: t("pageText:OeuvresManagement.OMCreateOeuvre.title"),
        newNamespace: "pageText:OeuvresManagement.OMCreateOeuvre.newFile",
        modifyNamespace: "pageText:OeuvresManagement.OMCreateOeuvre.modifyFile",
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
      name: "artistCommentFr",
      input: "text",
      label: {
        namespace: `pageText:OeuvresManagement.OMCreateOeuvre.artistCommentFr`,
        placeHolder: t(
          `pageText:OeuvresManagement.OMCreateOeuvre.artistCommentFrPlaceHolder`
        ),
        count: "artistCommentFr",
      },
    },
    {
      name: "artistCommentEnUS",
      input: "text",
      label: {
        namespace: `pageText:OeuvresManagement.OMCreateOeuvre.artistCommentEnUS`,
        placeHolder: t(
          `pageText:OeuvresManagement.OMCreateOeuvre.artistCommentEnUSPlaceHolder`
        ),
        count: "artistCommentEnUS",
      },
    },
    {
      name: "artistCommentEnGB",
      input: "text",
      label: {
        namespace: `pageText:OeuvresManagement.OMCreateOeuvre.artistCommentEnGB`,
        placeHolder: t(
          `pageText:OeuvresManagement.OMCreateOeuvre.artistCommentEnGBPlaceHolder`
        ),
        count: "artistCommentEnGB",
      },
    },
    {
      name: "oeuvreAvailability",
      label: {
        namespace: "pageText:OeuvresManagement.OMCreateOeuvre.available",
      },
      input: "select",
      options: [
        { value: 4, label: tCommon("oeuvreAvailability.available") },
        { value: 1, label: tCommon("oeuvreAvailability.given") },
        { value: 2, label: tCommon("oeuvreAvailability.sold") },
        { value: 3, label: tCommon("oeuvreAvailability.reserved") },
        { value: 5, label: tCommon("oeuvreAvailability.unavailable") },
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
        {
          name: "giftNote",
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreGivenNote",
            placeHolder: t(
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreNotePlaceHolder"
            ),
          },
          input: "text",
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
                    "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreGivenToSelection",
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
        {
          name: "saleNote",
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreSoldNote",
            placeHolder: t(
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreNotePlaceHolder"
            ),
          },
          input: "text",
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
        {
          name: "reservationNote",
          label: {
            namespace:
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreReservedNote",
            placeHolder: t(
              "pageText:OeuvresManagement.OMCreateOeuvre.oeuvreNotePlaceHolder"
            ),
          },
          input: "text",
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
        disbledWhenNoMatch: true,
        behaviour: "default",
        wantedFields: [{ name: "oeuvreFileDefaultFile", values: "truthy" }],
        unWantedFields: [],
        lovedFields: [
          {
            name: "oeuvreFile",
            values: "truthy",
          },
        ],
        hatedFields: [
          {
            name: "oeuvreFileDeleteFile",
            values: [true],
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
        hiddenWhenNoMatch: false,
        behaviour: "spiteful",
        unWantedFields: [{ name: "oeuvreFileDefaultFile", values: "truthy" }],
        lovedFields: [
          {
            name: "oeuvreFileDeleteFile",
            values: [true],
          },
        ],
        hatedFields: [
          {
            name: "oeuvreFile",
            values: "truthy",
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
      labelData: { key: "name", labelCb: (value) => tFormats(`${value}.name`) },
      valuesData: "id",
    },
    oeuvreSupport: {
      key: "oeuvreSupport",
      url: "supports",
      labelData: {
        key: "name",
        labelCb: (value) => tSupports(`${value}.name`),
      },
      valuesData: "id",
    },
    oeuvreTechnique: {
      key: "oeuvreTechnique",
      url: "techniques",
      labelData: {
        key: "name",
        labelCb: (value) => tTechniques(`${value}.name`),
      },
      valuesData: "id",
    },
    oeuvreFamily: {
      key: "oeuvreFamily",
      url: "families",
      labelData: {
        key: "name",
        labelCb: (value) => tFamilies(`${value}.name`),
      },
      valuesData: "id",
    },
  };

  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <FormCore
        className="CreateOeuvreForm"
        mutation={mutation}
        formMethods={formMethods}
        addedValues={addedValues}
        asyncValues={asyncVal}
        fields={formFields}
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        isFormModifying={isFormModifying}
        submitbuttonText={submitBtnText}
      />
    </div>
  );
}

export default OeuvresManagementCreateOeuvreForm;
