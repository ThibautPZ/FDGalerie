import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const LoginContext = createContext();

const useLoginContext = () => useContext(LoginContext);

function LoginContextProvider({ children }) {
  let loggedUser = false;
  if (JSON.parse(localStorage.getItem("user"))) {
    loggedUser = true;
  }
  const [isLoggedIn, setIsLoggedIn] = useState(loggedUser);
  const memoizedLogin = useMemo(() => {
    return { isLoggedIn, setIsLoggedIn };
  }, [isLoggedIn]);

  return (
    <LoginContext.Provider value={memoizedLogin}>
      {children}
    </LoginContext.Provider>
  );
}

export { useLoginContext, LoginContextProvider };

LoginContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
