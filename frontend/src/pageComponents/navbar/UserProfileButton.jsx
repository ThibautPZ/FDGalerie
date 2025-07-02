// import "../scss/ProfileButton.scss";

function UserProfileButton({
  category,
  displayedPageName,
  handleProfileButtonClick,
}) {
  return category === "Profil" ? (
    <button
      className="ProfileButton"
      type="button"
      value={category}
      onClick={() => handleProfileButtonClick("Profil")}
    >
      <img
        id="profile"
        src="/src/assets/images/artist-profile.svg"
        alt="profil-menu"
      />
      <p>{displayedPageName}</p>
    </button>
  ) : (
    <button
      className="ProfileButton"
      type="button"
      value={category}
      onClick={() => handleProfileButtonClick("Connexion")}
    >
      <img
        id="profile"
        src="/src/assets/images/artist-profile.svg"
        alt="profil-menu"
      />
      <p>{displayedPageName}</p>
    </button>
  );
}

export default UserProfileButton;
