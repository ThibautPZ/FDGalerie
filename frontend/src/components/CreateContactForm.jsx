import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

import FormCore from "./FormCore";

function CreateContactForm({
  createContactMutation,
  createContactFormMethods,
}) {
  const { t } = useTranslation(["common", "pageText"]);
  const outletContext = useOutletContext();
  // const { mutation, createContactFormMethods } = useOutletContext();
  const mutation = createContactMutation || outletContext.createContactMutation;
  const formMethods =
    createContactFormMethods || outletContext.createContactFormMethods;

  const formFields = [
    {
      name: "optionalDependantLastname",
      label: {
        namespace: "common:info.lastname",
        placeHolder: t("pageText:UtilisateurManagement.UMCreateUser.lastname"),
      },
      input: "text",
      validationDeps: "optionalFirstname",
    },
    {
      name: "optionalDependantFirstname",
      // registerOptionsKey: "optionalDependantFirstname",
      label: {
        namespace: "common:info.firstname",
        placeHolder: t("pageText:UtilisateurManagement.UMCreateUser.firstname"),
      },
      input: "text",
    },
    {
      name: "optionalAddress",
      label: {
        namespace: "common:info.address",
        placeHolder: t("pageText:UtilisateurManagement.UMCreateUser.address"),
      },

      input: "text",
    },
    {
      name: "optionalPostalCode",
      label: {
        namespace: "common:info.postalCode",
        placeHolder: t(
          "pageText:UtilisateurManagement.UMCreateUser.postalCode"
        ),
      },

      input: "text",
    },
    {
      name: "optionalCity",
      label: {
        namespace: "common:info.city",
        placeHolder: t("pageText:UtilisateurManagement.UMCreateUser.city"),
      },

      input: "text",
    },
    {
      name: "phoneNumber1",
      registerOptionsKey: "optionalPhoneNumber",
      label: {
        namespace: "common:info.phoneNumber",
        number: 1,
        placeHolder: t(
          "pageText:UtilisateurManagement.UMCreateUser.phoneNumber"
        ),
      },

      input: "text",
    },
    {
      name: "phoneNumber2",
      registerOptionsKey: "optionalPhoneNumber",
      label: {
        namespace: ["common:info.phoneNumber"],
        number: 2,
        placeHolder: t(
          "pageText:UtilisateurManagement.UMCreateUser.phoneNumber"
        ),
      },

      input: "text",
    },
    {
      name: "optionalEmail",
      label: {
        namespace: "common:info.email",
        placeHolder: t("pageText:UtilisateurManagement.UMCreateUser.email"),
      },

      input: "text",
    },
    {
      groupClassname: "contactLanguage",
      includedComponents: [
        {
          name: "spokenLanguage",
          input: "creatableSelect",
          label: {
            namespace: `common:info.spokenLanguage`,
          },
          options: [{ value: "fr" }, { value: "en" }, { value: "000" }],
        },
      ],
    },
  ];

  const defaultValues = {
    optionalDependantLastname: "",
    optionalDependantFirstname: "",
    optionalAddress: "",
    optionalPostalCode: "",
    optionalCity: "",
    phoneNumber1: "",
    phoneNumber2: "",
    optionalEmail: "",
    spokenLanguage: "",
  };

  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <FormCore
        className="CreateContactForm"
        mutation={mutation}
        formMethods={formMethods}
        defaultValues={defaultValues}
        addedValues={null}
        asyncValues={0}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={t(
          "pageText:OeuvresManagement.OMCreateOeuvre.newContactSubmitBtnText"
        )}
      />
    </div>
  );
}

export default CreateContactForm;
