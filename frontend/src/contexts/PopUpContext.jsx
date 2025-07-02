import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const PopUpContext = createContext();

const usePopUpContext = () => useContext(PopUpContext);

function PopUpContextProvider({ children }) {
  const [popUpState, setpopUpState] = useState({
    modalOpen: false,
    content: {},
  });
  const memoizedPopUp = useMemo(() => {
    return { popUpState, setpopUpState };
  }, [popUpState]);

  return (
    <PopUpContext.Provider value={memoizedPopUp}>
      {children}
    </PopUpContext.Provider>
  );
}

export { usePopUpContext, PopUpContextProvider };

PopUpContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
