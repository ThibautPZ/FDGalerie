import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import "../../scss/Oeuvre.scss";

import axiosInstance from "../../services/axiosInstance";
import OeuvresManagementCreateOeuvreForm from "./OeuvresManagementCreateOeuvreForm";
import UseCreateOeuvre from "../../hooks/RQmutation/UseCreateOeuvre";
import FoldableComponent from "../../components/FoldableComponent";
import CreateContactForm from "../../components/CreateContactForm";
import createContactDefaultValues from "../../json/formDefaultValues/createContactDefaultValues.json";

function OeuvresManagementCreateOeuvre({
  handleReturnClick,
  handleModalInstall,
  createContactMutation,
}) {
  const { t } = useTranslation(["common", "pageText"]);

  const createContactFormMethods = useForm({
    defaultValues: createContactDefaultValues,
    shouldUnregister: false,
  });

  const createOeuvreMutation = UseCreateOeuvre(handleModalInstall);

  const getTechniquesListFromDb = async () => {
    const url = "api/techniques";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const techniquesQuery = useQuery({
    queryKey: ["techniques"],
    queryFn: getTechniquesListFromDb,
    throwOnError: true,
  });

  const getSupportsListFromDb = async () => {
    const url = "api/supports";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const supportsQuery = useQuery({
    queryKey: ["supports"],
    queryFn: getSupportsListFromDb,
    throwOnError: true,
  });

  const getFormatsListFromDb = async () => {
    const url = "api/paintingSizes";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const formatsQuery = useQuery({
    queryKey: ["formats"],
    queryFn: getFormatsListFromDb,
    throwOnError: true,
  });
  const isFetchReady = () => {
    const techniques = techniquesQuery.data;
    const supports = supportsQuery.data;
    const formats = formatsQuery.data;
    if (techniques && supports && formats) {
      return true;
    }
    return false;
  };

  const popUpNS = "popUpContent:";
  const onFoldClose = {
    condition: createContactFormMethods.formState.isDirty,
    popUpNS,
  };

  return (
    <div className="OeuvresManagementCreateOeuvre">
      {isFetchReady() ? (
        <div>
          <OeuvresManagementCreateOeuvreForm
            mutation={createOeuvreMutation}
            techniques={techniquesQuery.data}
            supports={supportsQuery.data}
            formats={formatsQuery.data}
            handleReturnClick={handleReturnClick}
          />
          <FoldableComponent
            className=""
            labelNS="pageText:OeuvresManagement.OMCreateOeuvre.createNewContact"
            isOpen={false}
            whenLabel="always"
            onOpen={null}
            onClose={onFoldClose}
          >
            <CreateContactForm
              createContactMutation={createContactMutation}
              createContactFormMethods={createContactFormMethods}
            />
          </FoldableComponent>
        </div>
      ) : (
        <button type="button" onClick={() => handleReturnClick(null)}>
          {t("pageText:OeuvresManagement.OMCreateOeuvre.return")}
        </button>
      )}
    </div>
  );
}
export default OeuvresManagementCreateOeuvre;
