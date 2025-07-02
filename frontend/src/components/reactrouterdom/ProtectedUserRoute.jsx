import { Navigate } from "react-router-dom";
import { useLoginContext } from "../../contexts/LoginContext";

function ProtectedUserRoute({ children }) {
  const { isLoggedIn } = useLoginContext();
  return isLoggedIn ? children : <Navigate to="/connexion" />;
}

export default ProtectedUserRoute;
