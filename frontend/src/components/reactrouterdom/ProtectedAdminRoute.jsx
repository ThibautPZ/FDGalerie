import { Navigate } from "react-router-dom";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";

function ProtectedAdminRoute({ children }) {
  const { user } = useCurrentUserContext();
  return user.userTypesId === 2 ? children : <Navigate to="/connexion" />;
}

export default ProtectedAdminRoute;
