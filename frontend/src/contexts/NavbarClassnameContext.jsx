import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const NavbarClassnameContext = createContext();
const useNavbarClassnameContext = () => useContext(NavbarClassnameContext);

function NavbarClassnameContextProvider({ children }) {
  const [navbarClassname, setNavbarClassname] = useState("Navbar");
  const memoizedClassname = useMemo(() => {
    return { navbarClassname, setNavbarClassname };
  }, [navbarClassname]);

  return (
    <NavbarClassnameContext.Provider value={memoizedClassname}>
      {children}
    </NavbarClassnameContext.Provider>
  );
}

export { useNavbarClassnameContext, NavbarClassnameContextProvider };
NavbarClassnameContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
