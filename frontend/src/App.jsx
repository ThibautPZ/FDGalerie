import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useTranslation } from "react-i18next";
import "./scss/App.scss";
import { NavbarClassnameContextProvider } from "./contexts/NavbarClassnameContext";
import { CurrentUserContextProvider } from "./contexts/CurrentUserContext";
import { LoginContextProvider } from "./contexts/LoginContext";
import Navbar from "./pageComponents/navbar/Navbar";
import ProfilePagePopUp from "./components/modals/ProfilePagePopUp";

function App() {
  const [popUpState, setPopUpState] = useState({
    modalOpen: false,
    content: {},
  });
  const { t } = useTranslation(["common", "errors"]);
  const handleCloseModal = () => {
    setPopUpState({ modalOpen: false, content: {} });
  };

  const handleModalInstall = (title, message) => {
    setPopUpState({
      modalOpen: true,
      content: {
        title: title || t("errors:title.generic"),
        message: message || t("errors:message.generic"),
      },
    });
  };
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (error.response.status === 404) {
          return console.error(error);
        }
        if (error.response.status.toString().startsWith("4")) {
          return handleModalInstall(
            t(`errors:title.${error.response.data.errorObj.title}`),
            t(`errors:message.${error.response.data.errorObj.message}`)
          );
        }
        if (error.response.status.toString().startsWith("4")) {
          return handleModalInstall(
            t(`errors:title.${error.response.data.errorObj.title}`),
            t(`errors:message.${error.response.data.errorObj.message}`)
          );
        }
        return console.error(error, query);
      },
    }),
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <LoginContextProvider>
        <CurrentUserContextProvider>
          <NavbarClassnameContextProvider>
            <Navbar />
            <div className="App">
              <Outlet />
              {popUpState.modalOpen ? (
                <ProfilePagePopUp
                  isOpen={popUpState.modalOpen}
                  content={popUpState.content}
                  onClose={handleCloseModal}
                />
              ) : null}
            </div>
            <ReactQueryDevtools />
          </NavbarClassnameContextProvider>
        </CurrentUserContextProvider>
      </LoginContextProvider>
    </QueryClientProvider>
  );
}

export default App;
