import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const CurrentUserContext = createContext();

const useCurrentUserContext = () => useContext(CurrentUserContext);

function CurrentUserContextProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const memoizedUser = useMemo(() => {
    return { user, setUser };
  }, [user]);

  return (
    <CurrentUserContext.Provider value={memoizedUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export { useCurrentUserContext, CurrentUserContextProvider };

CurrentUserContextProvider.propTypes = { children: PropTypes.node.isRequired };
