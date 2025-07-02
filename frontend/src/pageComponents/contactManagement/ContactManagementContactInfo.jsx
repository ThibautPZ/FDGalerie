import { useSuspenseQuery } from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import axiosInstance from "../../services/axiosInstance";
import ModifyContactForm from "./ModifyContactForm";
import ContactManagementDetails from "./ContactManagementDetails";
import tranlationInstance from "../../services/translationInstance";
import filterObject from "../../services/objectMethods/filterObject";

function ContactManagementContactInfo() {
  const [tPageText, tCommon] = tranlationInstance(
    "pageText:ContactManagement.CMContactInfo",
    "common"
  );
  const { isModifying, setIsModifying } = useOutletContext();
  const { id } = useParams();
  const contactId = parseInt(id.split(":")[1], 10);

  const getContactFromDb = async () => {
    const url = `api/contacts/${contactId}`;
    const res = await axiosInstance.get(url);
    return res.data[0];
  };

  const { data } = useSuspenseQuery({
    queryKey: ["contact", contactId],
    queryFn: getContactFromDb,
    throwOnError: true,
  });

  const {
    firstname,
    lastname,
    address,
    postalCode,
    city,
    phoneNumber1,
    phoneNumber2,
    email,
    language,
  } = data;

  const defaultValues = {
    optionalDependantLastname: lastname,
    optionalDependantFirstname: firstname,
    optionalAddress: address,
    optionalPostalCode: postalCode,
    optionalCity: city,
    phoneNumber1,
    phoneNumber2,
    optionalEmail: email,
    spokenLanguage: {
      value: language,
      label: tCommon(`spokenLanguage.${language}`),
    },
  };
  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  });
  const formDirtyFields = formMethods.formState.dirtyFields;
  const isKeyDirtyField = (key) => {
    if (formDirtyFields[key]) {
      return true;
    }
    return false;
  };

  const handleSubmitForm = (formData) => {
    const [returnedData] = filterObject(formData, isKeyDirtyField);

    return returnedData;
  };

  const handleModifyBtnClick = () => {
    setIsModifying(!isModifying);
  };

  return (
    <>
      <div>
        {!isModifying ? (
          <ContactManagementDetails contactData={data} />
        ) : (
          <ModifyContactForm
            contactId={contactId}
            contactDefaultValues={data}
            formMethods={formMethods}
            onSubmit={handleSubmitForm}
          />
        )}
      </div>
      <button type="button" onClick={handleModifyBtnClick}>
        {isModifying
          ? tPageText("modifyBtnReturn")
          : tPageText("modifyBtnModify")}
      </button>
    </>
  );
}
export default ContactManagementContactInfo;
