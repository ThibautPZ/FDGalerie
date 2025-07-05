import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

import FormCore from "../../components/FormCore";
import UseModifyContact from "../../hooks/RQmutation/UseModifyContact";

function ModifyContactForm({ contactId, formMethods, onSubmit }) {
  const { t } = useTranslation(["common", "pageText"]);

  const { handleModalInstall } = useOutletContext();

  const mutation = UseModifyContact(contactId, handleModalInstall);

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

  return (
    <div className="OeuvresManagementCreateOeuvreForm">
      <FormCore
        className="ModifyContactForm"
        mutation={mutation}
        formMethods={formMethods}
        // defaultValues={defaultValues}
        addedValues={null}
        asyncValues={0}
        fields={formFields}
        setWatchMethod={null}
        submitbuttonText={t(
          "pageText:OeuvresManagement.OMCreateOeuvre.newContactSubmitBtnText"
        )}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default ModifyContactForm;
