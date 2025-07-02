import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import "../../scss/ManagementMenuPopUp.scss";

import NavbarCategoriesButtons from "../../pageComponents/navbar/NavbarCategoriesButton";

function ManagementMenuPopUp({ popUpOpen, handleNavigationSelected }) {
  const { t } = useTranslation(["common"]);
  const tWithPrefix = (keyStr) => t(`common:pageNames.${keyStr}`);
  const urlPrefix = "management/";
  return popUpOpen.subMenu === "Management" ? (
    <div className="ManagementMenuPopUp">
      <NavbarCategoriesButtons
        category={`${urlPrefix}utilisateurs`}
        displayedPageName={tWithPrefix("users")}
        handleCategorySelected={handleNavigationSelected}
      />
      <NavbarCategoriesButtons
        category={`${urlPrefix}oeuvres`}
        displayedPageName={tWithPrefix("paintings")}
        handleCategorySelected={handleNavigationSelected}
      />
      <NavbarCategoriesButtons
        category={`${urlPrefix}bio`}
        displayedPageName={tWithPrefix("bio")}
        handleCategorySelected={handleNavigationSelected}
      />
      <NavbarCategoriesButtons
        category={`${urlPrefix}projets`}
        displayedPageName={tWithPrefix("mesProjets")}
        handleCategorySelected={handleNavigationSelected}
      />
      <NavbarCategoriesButtons
        category={`${urlPrefix}atelier`}
        displayedPageName={tWithPrefix("aLAtelier")}
        handleCategorySelected={handleNavigationSelected}
      />
      <NavbarCategoriesButtons
        category={`${urlPrefix}contacts`}
        displayedPageName={tWithPrefix("contacts")}
        handleCategorySelected={handleNavigationSelected}
      />
    </div>
  ) : (
    ""
  );
}

export default ManagementMenuPopUp;

ManagementMenuPopUp.propTypes = {
  popUpOpen: PropTypes.shape({
    burger: PropTypes.bool,
    subMenu: PropTypes.string,
  }).isRequired,
  handleNavigationSelected: PropTypes.func.isRequired,
}.isRequired;
