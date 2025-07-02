import PropTypes from "prop-types";
import NavbarCategoriesButtons from "../../pageComponents/navbar/NavbarCategoriesButton";

import "../../scss/BurgerMenuPopUp.scss";

function BurgerMenuPopUp({
  popUpOpen,
  handleNavigationSelected,
  handleCategorySelected,
}) {
  return popUpOpen.burger === true && popUpOpen.subMenu !== "Profil" ? (
    <div className="BurgerMenuPopUp">
      <NavbarCategoriesButtons
        category="Accueil"
        displayedPageName="Accueil"
        handleCategorySelected={handleNavigationSelected}
      />
      <NavbarCategoriesButtons
        category="Diaporama"
        displayedPageName="Diaporama"
        handleCategorySelected={handleNavigationSelected}
      />
      <NavbarCategoriesButtons
        category="Oeuvres"
        displayedPageName="Oeuvres"
        handleCategorySelected={handleNavigationSelected}
      />
      <NavbarCategoriesButtons
        category="Techniques"
        displayedPageName="Techniques"
        handleCategorySelected={handleCategorySelected}
      />
      <NavbarCategoriesButtons
        category="Formats"
        displayedPageName="Formats"
        handleCategorySelected={handleCategorySelected}
      />
    </div>
  ) : (
    ""
  );
}

export default BurgerMenuPopUp;

BurgerMenuPopUp.propTypes = {
  popUpOpen: PropTypes.shape({
    burger: PropTypes.bool,
    subMenu: PropTypes.string,
  }).isRequired,
  handleNavigationSelected: PropTypes.func.isRequired,
  handleCategorySelected: PropTypes.func.isRequired,
}.isRequired;
