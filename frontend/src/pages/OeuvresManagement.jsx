import { useState, Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import i18n from "../i18n";
import "../scss/OeuvresManagement.scss";

import axiosInstance from "../services/axiosInstance";
import PopUp from "../components/modals/PopUp";
import UseCreateContact from "../hooks/RQmutation/UseCreateContact";
import UseCreateOeuvre from "../hooks/RQmutation/UseCreateOeuvre";
import UseModal from "../hooks/UseModal";
import createContactDefaultValues from "../json/formDefaultValues/createContactDefaultValues.json";
import createOeuvreDefaultValues from "../json/formDefaultValues/createOeuvreDefaultValues.json";
import createTechniqueDefaultValues from "../json/formDefaultValues/createTechniqueDefaultValues.json";
import UseCreateTechnique from "../hooks/RQmutation/UseCreateTechnique";
import UseCreateFamily from "../hooks/RQmutation/UseCreateFamily";
import createFamilyDefaultValues from "../json/formDefaultValues/createFamilyDefaultValues.json";
import createFormatDefaultValues from "../json/formDefaultValues/createFormatDefaultValues.json";
import UseCreateFormat from "../hooks/RQmutation/UseCreateFormat";
import UseCreateSupport from "../hooks/RQmutation/UseCreateSupport";
import createSupportDefaultValues from "../json/formDefaultValues/createSupportDefaultValues.json";
import OeuvresManagementOeuvresList from "../pageComponents/oeuvresManagement/OeuvresManagementOeuvresList";
import UseDeletePainting from "../hooks/RQmutation/UseDeleteOeuvre";
import UseDeleteTechnique from "../hooks/RQmutation/UseDeleteTechnique";

function OeuvresManagement() {
  const { t } = useTranslation(["common", "pageText"]);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isModifying, setIsModifying] = useState(false);

  const createContactFormMethods = useForm({
    defaultValues: createContactDefaultValues,
    shouldUnregister: false,
  });
  const createOeuvreFormMethods = useForm({
    defaultValues: createOeuvreDefaultValues,
    shouldUnregister: false,
  });
  const createTechniqueFormMethods = useForm({
    defaultValues: createTechniqueDefaultValues,
    shouldUnregister: false,
  });

  const createFamilyFormMethods = useForm({
    defaultValues: createFamilyDefaultValues,
    shouldUnregister: false,
  });

  const createFormatFormMethods = useForm({
    defaultValues: createFormatDefaultValues,
    shouldUnregister: false,
  });

  const createSupportFormMethods = useForm({
    defaultValues: createSupportDefaultValues,
    shouldUnregister: false,
  });

  const getOeuvresListFromDb = async () => {
    const url = "api/paintings/adminDetailed";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const oeuvresQuery = useSuspenseQuery({
    queryKey: ["oeuvresWithDetails"],
    queryFn: getOeuvresListFromDb,
    throwOnError: true,
  });

  const getAllTechniquesFromDb = async () => {
    const url = "api/techniques";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const techniquesQuery = useSuspenseQuery({
    queryKey: ["techniques", { type: "basic" }],
    queryFn: getAllTechniquesFromDb,
    throwOnError: true,
  });

  const getAllFamiliesFromDb = async () => {
    const url = "api/families";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const familiesQuery = useSuspenseQuery({
    queryKey: ["oeuvreFamily"],
    queryFn: getAllFamiliesFromDb,
    throwOnError: true,
  });

  const getAllSupportsFromDb = async () => {
    const url = "api/supports";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const supportsQuery = useSuspenseQuery({
    queryKey: ["oeuvreSupport"],
    queryFn: getAllSupportsFromDb,
    throwOnError: true,
  });

  const getAllPaintingSizesFromDb = async () => {
    const url = "api/paintingSizes";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const formatsQuery = useSuspenseQuery({
    queryKey: ["oeuvreFormat"],
    queryFn: getAllPaintingSizesFromDb,
    throwOnError: true,
  });

  const { popUpState, giveOnClose, handleModalInstall } = UseModal();
  const createContactMutation = UseCreateContact(handleModalInstall);
  const createOeuvreMutation = UseCreateOeuvre(handleModalInstall);
  const createTechniqueMutation = UseCreateTechnique(handleModalInstall, i18n);
  const createFamilyMutation = UseCreateFamily(handleModalInstall);
  const createFormatMutation = UseCreateFormat(handleModalInstall);
  const createSupportMutation = UseCreateSupport(handleModalInstall);
  const deleteOeuvreMutation = UseDeletePainting(handleModalInstall);
  const deleteTechniqueMutation = UseDeleteTechnique(handleModalInstall);

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

  const deleteOeuvre = (data) => {
    const { id } = data;
    return deleteOeuvreMutation.mutate(id);
  };

  const deleteTechnique = (data) => {
    const { id } = data;
    navigate(`/management/oeuvres/techniques/`);
    return deleteTechniqueMutation.mutate(id);
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
    },
    {
      status: "doDeleteOeuvre",
      cb: deleteOeuvre,
    },
    {
      status: "doDeleteTechnique",
      cb: deleteTechnique,
    }
  );

  const handleReturnClick = () => {
    if (createContactFormMethods.formState.isDirty) {
      return handleModalInstall(
        { type: "info", message: "backWhileCreatingContact" },
        "popUpContent:ContactManagement."
      );
    }
    if (createOeuvreFormMethods.formState.isDirty) {
      return handleModalInstall(
        { type: "info", message: "backWhileCreatingOeuvre" },
        "popUpContent:OeuvresManagement."
      );
    }
    return navigate("./");
  };

  /* eslint-disable prefer-destructuring */
  const givePath = (basePath) => {
    const id = pathname.split("/id:")[1];
    return basePath + (id ? `id:${id}` : "");
  };

  return (
    <div className="OeuvresManagement">
      {pathname !== "/management/oeuvres/new" ? (
        <div className="OeuvresManagementHeader">
          <div>
            <Link to="new">{t("pageText:OeuvresManagement.OM.newOeuvre")}</Link>
          </div>
          <Link to={givePath("/management/oeuvres/")}>
            {t("pageText:OeuvresManagement.OM.allOeuvres")}
          </Link>
          <Link to={givePath("/management/oeuvres/dons/")}>
            {t("pageText:OeuvresManagement.OM.dons")}
          </Link>
          <Link to={givePath("/management/oeuvres/ventes/")}>
            {t("pageText:OeuvresManagement.OM.ventes")}
          </Link>
          <Link to={givePath("/management/oeuvres/reservations/")}>
            {t("pageText:OeuvresManagement.OM.reservations")}
          </Link>
          <Link to="/management/oeuvres/techniques/">
            {t("pageText:OeuvresManagement.OM.techniques")}
          </Link>
        </div>
      ) : (
        <button type="button" onClick={() => handleReturnClick()}>
          {t("pageText:OeuvresManagement.OM.return")}
        </button>
      )}
      {pathname === "/management/oeuvres/" ||
      pathname.startsWith("/management/oeuvres/id:") ? (
        <Suspense fallback={<h1>Loading...</h1>}>
          <h1>{t("pageText:OeuvresManagement.OMOeuvresList.title")}</h1>
          <OeuvresManagementOeuvresList
            oeuvresList={oeuvresQuery.data}
            techniques={techniquesQuery.data}
            families={familiesQuery.data}
            formats={formatsQuery.data}
            supports={supportsQuery.data}
            setIsModifying={setIsModifying}
          />
        </Suspense>
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
      <Outlet
        context={{
          oeuvresQuery,
          techniquesQuery,
          familiesQuery,
          formatsQuery,
          supportsQuery,
          createContactMutation,
          createContactFormMethods,
          createOeuvreMutation,
          createOeuvreFormMethods,
          createTechniqueMutation,
          createTechniqueFormMethods,
          createFamilyMutation,
          createFamilyFormMethods,
          createFormatMutation,
          createFormatFormMethods,
          createSupportMutation,
          createSupportFormMethods,
          handleModalInstall,
          isModifying,
          setIsModifying,
        }}
      />
    </div>
  );
}

export default OeuvresManagement;
