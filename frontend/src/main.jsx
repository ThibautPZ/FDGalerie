import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./i18n";

import App from "./App";

import Accueil from "./pages/Accueil";
import Atelier from "./pages/Atelier";
import Bio from "./pages/Bio";
import BioManagement from "./pages/BioManagement";
import CarouselManagement from "./pages/CarouselManagement";
import Connexion from "./pages/Connexion";
import Contact from "./pages/Contact";
import ContactManagement from "./pages/ContactManagement";
import Diaporama from "./pages/Diaporama";
import Format from "./pages/Format";
import Management from "./pages/Management";
import MDPOublie from "./pages/MDPOublie";
import Messages from "./pages/Messages";
import Oeuvre from "./pages/Oeuvre";
import Oeuvres from "./pages/Oeuvres";
import OeuvresManagement from "./pages/OeuvresManagement";
import Profil from "./pages/Profil";
import Projet from "./pages/Projet";
import Projets from "./pages/Projets";
import ReinitialisationMDP from "./pages/ReinitialisationMDP";
import Technique from "./pages/Technique";
import UtilisateurManagement from "./pages/UtilisateurManagement";
import ProtectedUserRoute from "./components/reactrouterdom/ProtectedUserRoute";
import ProtectedAdminRoute from "./components/reactrouterdom/ProtectedAdminRoute";
import ProtectedNonUserRoute from "./components/reactrouterdom/ProtectedNonUserRoute";
import ContactManagementContactInfo from "./pageComponents/contactManagement/ContactManagementContactInfo";
import CreateContact from "./pageComponents/contactManagement/CreateContact";
import GlobalErrorBoundary from "./services/errorElements/GlobalErrorBoundary";
import OeuvresManagementDetailedOeuvre from "./pageComponents/oeuvresManagement/OeuvresManagementDetailedOeuvre";
import OeuvresManagementCreateOeuvre from "./pageComponents/oeuvresManagement/OeuvresManagementCreateOeuvre";

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<h1>Loading...</h1>}>
        <App />
      </Suspense>
    ),
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Accueil />,
      },
      { path: "/diaporama", element: <Diaporama /> },
      {
        path: "/oeuvres",
        element: <Outlet />,
        children: [
          { index: true, element: <Oeuvres /> },
          {
            path: "technique",
            element: <Outlet />,
            children: [{ path: ":nomTechnique", element: <Technique /> }],
          },
          {
            path: "format",
            element: <Outlet />,
            children: [{ path: ":nomFormat", element: <Format /> }],
          },
        ],
      },
      { path: "/oeuvre/:titreOeuvre", element: <Oeuvre /> },
      { path: "/projets", element: <Projets /> },
      { path: "/projet/:id", element: <Projet /> },
      { path: "/atelier", element: <Atelier /> },
      { path: "/bio", element: <Bio /> },
      { path: "/contact", element: <Contact /> },
      {
        path: "/messages",
        element: (
          <ProtectedUserRoute>
            <Messages />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/profil",
        element: (
          <ProtectedUserRoute>
            <Profil />
          </ProtectedUserRoute>
        ),
      },
      {
        path: "/Connexion",
        element: (
          <ProtectedNonUserRoute>
            <Connexion />
          </ProtectedNonUserRoute>
        ),
      },
      {
        path: "/MDPOublie",
        element: (
          <ProtectedNonUserRoute>
            <MDPOublie />
          </ProtectedNonUserRoute>
        ),
      },
      {
        path: "/reinitialisationMDP",
        element: (
          <ProtectedNonUserRoute>
            <ReinitialisationMDP />
          </ProtectedNonUserRoute>
        ),
      },
      {
        path: "/management",
        element: (
          <ProtectedAdminRoute>
            <Outlet />
          </ProtectedAdminRoute>
        ),
        children: [
          { index: true, element: <Management /> },
          {
            path: "oeuvres",
            element: (
              <Suspense fallback={<p>"loading"</p>}>
                <OeuvresManagement />
              </Suspense>
            ),
            children: [
              {
                path: ":id",
                element: (
                  // <Suspense fallback="loading">
                  <OeuvresManagementDetailedOeuvre />
                  // </Suspense>
                ),
              },
              {
                path: "new",
                element: (
                  // <Suspense fallback="loading">
                  <OeuvresManagementCreateOeuvre />
                  // </Suspense>
                ),
              },
            ],
          },
          { path: "bio", element: <BioManagement /> },
          { path: "carousel", element: <CarouselManagement /> },
          {
            path: "utilisateurs",
            element: (
              // <Suspense fallback="loading">
              <UtilisateurManagement />
              // </Suspense>
            ),
          },
          {
            path: "contacts",
            element: (
              <Suspense fallback={<p>"loading"</p>}>
                <ContactManagement />
              </Suspense>
            ),
            children: [
              {
                path: ":id",
                element: (
                  // <Suspense fallback="loading">
                  <ContactManagementContactInfo />
                  // </Suspense>
                ),
              },
              {
                path: "new",
                element: (
                  // <Suspense fallback="loading">
                  <CreateContact />
                  // </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
