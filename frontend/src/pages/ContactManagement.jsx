import { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  // useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import "../scss/ContactsManagement.scss";

import axiosInstance from "../services/axiosInstance";
import UseCreateContact from "../hooks/RQmutation/UseCreateContact";
import PopUp from "../components/modals/PopUp";
import ContactManagementList from "../pageComponents/contactManagement/ContactManagementList";
import createContactDefaultValues from "../json/formDefaultValues/createContactDefaultValues.json";
import UseModal from "../hooks/UseModal";

function ContactManagement() {
  const { t } = useTranslation(["common", "pageText"]);
  // const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [selectedContact, setSelectedContact] = useState({});
  const [isModifying, setIsModifying] = useState(false);

  const createContactFormMethods = useForm({
    defaultValues: createContactDefaultValues,
    shouldUnregister: false,
  });

  const getContactListFromDb = async () => {
    const url = "api/contacts/browseWithPaintingsOwningCount";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const contactsQuery = useSuspenseQuery({
    queryKey: [
      "contactsWithPaintingsOwningCount",
      { type: "withPaintingsOwningCount" },
    ],
    queryFn: getContactListFromDb,
    throwOnError: true,
  });

  const { popUpState, giveOnClose, handleModalInstall } = UseModal();
  const createContactMutation = UseCreateContact(handleModalInstall);

  const backToPrev = () => {
    navigate("./");
  };

  const setIsModifyingFalse = () => {
    setIsModifying(false);
  };

  const confirmedContactCreation = (data) => {
    const formData = {
      ...data,
      verificationBypass: "checkContactOrUserDoesntExist",
    };
    createContactMutation.mutate(formData);
  };

  const handleCloseModal = giveOnClose(
    {
      status: "backToPreviousPage",
      cb: backToPrev,
    },
    {
      status: "setIsModifyingFalse",
      cb: setIsModifyingFalse,
    },
    {
      status: "doCreateContact",
      cb: confirmedContactCreation,
    }
  );

  const handleReturnClick = () => {
    if (createContactFormMethods.formState.isDirty) {
      return handleModalInstall(
        { type: "info", message: "backWhileCreatingContact" },
        "popUpContent:ContactManagement."
      );
    }
    return navigate("./");
  };

  const handleContactSelected = (contact) => {
    return setSelectedContact(contact);
  };

  return (
    <div className="ContactsManagement">
      {pathname !== "/management/contacts/new" ? (
        <Link to="new">{t("pageText:ContactManagement.CM.newContact")}</Link>
      ) : (
        <button type="button" onClick={() => handleReturnClick()}>
          {t("pageText:ContactManagement.CM.return")}
        </button>
      )}
      <Suspense fallback={<h1>Loading...</h1>}>
        <ContactManagementList
          contactList={contactsQuery.data}
          selectedContact={selectedContact}
          handleContactSelected={handleContactSelected}
          setIsModifying={setIsModifying}
        />
      </Suspense>
      {popUpState.modalOpen ? (
        <PopUp
          isOpen={popUpState.modalOpen}
          content={popUpState.content}
          onClose={handleCloseModal}
        />
      ) : null}
      <Outlet
        context={{
          mutation: createContactMutation,
          contactsQuery,
          createContactFormMethods,
          handleModalInstall,
          isModifying,
          setIsModifying,
        }}
      />
    </div>
  );
}

export default ContactManagement;
