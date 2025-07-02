import NavbarCategoriesButtons from "../../pageComponents/navbar/NavbarCategoriesButton";

import "../../scss/ProfilMenuPopUp.scss";

function ProfilMenuPopUp({
  popUpOpen,
  handleNavigationSelected,
  profil,
  handleDeconnexionSelected,
}) {
  return (
    <div className="ProfilMenuPopUp">
      {popUpOpen.subMenu === "Profil" ? (
        <div>
          <p>Bonjour, {profil.firstname || profil.email || "Visiteur"}</p>
          <NavbarCategoriesButtons
            category="Profil"
            displayedPageName="Mon profil"
            handleCategorySelected={handleNavigationSelected}
          />
          <NavbarCategoriesButtons
            category="Déconnexion"
            displayedPageName="Se déconnecter"
            handleCategorySelected={handleDeconnexionSelected}
          />
        </div>
      ) : null}
      {popUpOpen.subMenu === "Connexion" ? (
        <div className="ProfilMenuPopUp">
          <p>Bonjour, visiteur.</p>
          <NavbarCategoriesButtons
            category="Connexion"
            displayedPageName="Se connecter"
            handleCategorySelected={handleNavigationSelected}
          />
          <NavbarCategoriesButtons
            category="Connexion?page=Inscription"
            displayedPageName="S'inscrire"
            handleCategorySelected={handleNavigationSelected}
          />
        </div>
      ) : null}
    </div>
  );
}

export default ProfilMenuPopUp;
