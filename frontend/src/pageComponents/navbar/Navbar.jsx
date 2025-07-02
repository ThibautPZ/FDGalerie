import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import axiosInstance from "../../services/axiosInstance";
import { useNavbarClassnameContext } from "../../contexts/NavbarClassnameContext";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useLoginContext } from "../../contexts/LoginContext";

import "../../scss/Navbar.scss";

import BurgerMenuPopUp from "../../components/burgerPopUps/BurgerMenuPopUp";
import ProfilMenuPopUp from "../../components/burgerPopUps/ProfilMenuPopUp";
import TechniquesMenuPopUp from "../../components/burgerPopUps/TechniquesMenuPopUp";
import FormatsMenuPopUp from "../../components/burgerPopUps/FormatsMenuPopUp";
import NavbarCategoriesButton from "./NavbarCategoriesButton";
import UserProfileButton from "./UserProfileButton";
import ManagementMenuPopUp from "../../components/burgerPopUps/ManagementMenuPopUp";
import LocaleSwitcher from "./LocaleSwitcher";

function Navbar() {
  const navigate = useNavigate();

  const { navbarClassname } = useNavbarClassnameContext();
  const { isLoggedIn, setIsLoggedIn } = useLoginContext();
  const { user, setUser } = useCurrentUserContext();
  const [characteristicsList, setCharacteristicsList] = useState({
    formats: [],
    techniques: [],
  });

  const [popUpOpen, setPopUpOpen] = useState({
    burger: false,
    subMenu: null,
  });

  const handleBurgerClick = () => {
    setPopUpOpen({ burger: !popUpOpen.burger, subMenu: null });
  };

  const handleCategorySelected = (category) => {
    return popUpOpen.subMenu === category
      ? setPopUpOpen({ ...popUpOpen, subMenu: null })
      : setPopUpOpen({ ...popUpOpen, subMenu: category });
  };

  const handleProfileButtonClick = (category) => {
    return popUpOpen.subMenu === category
      ? setPopUpOpen({ burger: false, subMenu: null })
      : setPopUpOpen({ burger: false, subMenu: category });
  };

  const handleNavigationSelected = (pageName) => {
    let link = "/";
    setPopUpOpen({ burger: false, subMenu: null });
    if (pageName !== "Accueil") {
      link = `${link}${pageName}`;
    }
    navigate(link);
  };

  const handleLogOut = async () => {
    try {
      const res = await axiosInstance.get("/api/auth/logout");
      if (res.status === 200) {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.clear();
        navigate("/");
      }
    } catch {
      console.error("Impossible to logout");
    }
  };

  const handleDeconnexionSelected = () => {
    setPopUpOpen({ burger: false, subMenu: null });
    handleLogOut();
  };

  const fetchOeuvresCharacteristics = async () => {
    try {
      const formatsList = await axiosInstance.get("/api/paintings/sizes");
      const techniquesList = await axiosInstance.get(
        "/api/paintings/techniques"
      );
      setCharacteristicsList({
        formats: formatsList.data,
        techniques: techniquesList.data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOeuvresCharacteristics();
  }, []);

  return (
    <div className={navbarClassname}>
      <div className="NavbarDesktop">
        <NavbarCategoriesButton
          category="Accueil"
          displayedPageName="Accueil"
          handleCategorySelected={handleNavigationSelected}
        />
        <NavbarCategoriesButton
          category="Diaporama"
          displayedPageName="Diaporama"
          handleCategorySelected={handleNavigationSelected}
        />
        <NavbarCategoriesButton
          category="Oeuvres"
          displayedPageName="Oeuvres"
          handleCategorySelected={handleNavigationSelected}
        />
        <NavbarCategoriesButton
          category="Techniques"
          displayedPageName="Techniques"
          handleCategorySelected={handleCategorySelected}
        />
        <NavbarCategoriesButton
          category="Formats"
          displayedPageName="Formats"
          handleCategorySelected={handleCategorySelected}
        />
        {user?.userTypesId === 2 ? (
          <NavbarCategoriesButton
            category="Management"
            displayedPageName="Management"
            handleCategorySelected={handleCategorySelected}
          />
        ) : (
          ""
        )}
      </div>
      <button
        className="NavbarMobile"
        type="button"
        onClick={handleBurgerClick}
      >
        <img
          id="burger"
          src="/src/assets/images/burger-menu.svg"
          alt="burger-menu"
        />
      </button>
      <LocaleSwitcher />
      {isLoggedIn ? (
        <UserProfileButton
          category="Profil"
          displayedPageName={user.firstname || user.email}
          handleCategorySelected={handleCategorySelected}
          handleDeconnexionSelected={handleDeconnexionSelected}
          handleProfileButtonClick={handleProfileButtonClick}
        />
      ) : (
        <UserProfileButton
          category="Connexion"
          displayedPageName="Inscription Connexion"
          handleCategorySelected={handleCategorySelected}
          handleDeconnexionSelected={handleDeconnexionSelected}
          handleProfileButtonClick={handleProfileButtonClick}
        />
      )}
      {popUpOpen.burger
        ? createPortal(
            <BurgerMenuPopUp
              popUpOpen={popUpOpen}
              handleNavigationSelected={handleNavigationSelected}
              handleCategorySelected={handleCategorySelected}
            />,
            document.body
          )
        : ""}
      {popUpOpen.subMenu === "Techniques"
        ? createPortal(
            <TechniquesMenuPopUp
              popUpOpen={popUpOpen}
              setPopUpOpen={setPopUpOpen}
              techniques={characteristicsList.techniques}
            />,
            document.body
          )
        : ""}
      {popUpOpen.subMenu === "Formats"
        ? createPortal(
            <FormatsMenuPopUp
              popUpOpen={popUpOpen}
              setPopUpOpen={setPopUpOpen}
              formats={characteristicsList.formats}
            />,
            document.body
          )
        : ""}
      {popUpOpen.subMenu === "Profil"
        ? createPortal(
            <ProfilMenuPopUp
              popUpOpen={popUpOpen}
              setPopUpOpen={setPopUpOpen}
              handleNavigationSelected={handleNavigationSelected}
              handleDeconnexionSelected={handleDeconnexionSelected}
              profil={user || false}
            />,
            document.body
          )
        : ""}
      {popUpOpen.subMenu === "Connexion"
        ? createPortal(
            <ProfilMenuPopUp
              popUpOpen={popUpOpen}
              setPopUpOpen={setPopUpOpen}
              handleNavigationSelected={handleNavigationSelected}
              profil={false}
            />,
            document.body
          )
        : ""}
      {popUpOpen.subMenu === "Management"
        ? createPortal(
            <ManagementMenuPopUp
              popUpOpen={popUpOpen}
              setPopUpOpen={setPopUpOpen}
              handleNavigationSelected={handleNavigationSelected}
              profil={false}
            />,
            document.body
          )
        : ""}

      {/* 
      <Link to="/projets">
        <p>projets</p>
      </Link>
      <Link to="/atelier">
        <p>atelier</p>
      </Link>
      <Link to="/bio">
        <p>bio</p>
      </Link>
      <Link to="/contact">
        <p>contact</p>
      </Link>
      <Link to="/messages">
        <p>messages</p>
      </Link>
      <Link to="/profil">
        <p>profil</p>
      </Link>
      <Link to="/management">
        <p>management</p>
      </Link>
      <Link to="/management/oeuvres">
        <p>oeuvres management</p>
      </Link>
      <Link to="/management/bio">
        <p>bio management</p>
      </Link>
      <Link to="/management/carousel">
        <p>carousel management</p>
      </Link>
      <Link to="/management/utilisateurs">
        <p>utilisateurs management</p>
      </Link> */}
    </div>
  );
}

export default Navbar;
