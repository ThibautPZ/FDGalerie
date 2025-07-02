import PropTypes from "prop-types";

function NavbarCategoriesButtons({
  category,
  displayedPageName,
  handleCategorySelected,
}) {
  return (
    <button
      type="button"
      value={category}
      onClick={(e) => handleCategorySelected(e.target.value)}
    >
      {displayedPageName}
    </button>
  );
}

export default NavbarCategoriesButtons;

NavbarCategoriesButtons.propTypes = {
  category: PropTypes.string.isRequired,
  displayedName: PropTypes.string.isRequired,
  handleCategorySelected: PropTypes.func.isRequired,
}.isRequired;
